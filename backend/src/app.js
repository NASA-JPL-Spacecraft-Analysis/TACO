import express from 'express';
import cors from 'cors';

import { errorHandler } from './api/middleware/error.js';
import testbedRoutes from './api/testbeds/testbed.routes.js';
import userRoutes from './api/users/user.routes.js';
import { asyncHandler } from './api/middleware/error.js';
import * as testbedService from './api/testbeds/testbed.service.js';
import * as testbedRepo from './api/testbeds/testbed.repository.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);
app.use('/api', testbedRoutes);

// health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/bloom', (req, res) => {
    const testbeds = testbedService.getTestbeds()

    console.log("in bloom")
    console.log(testbeds)
    console.log("after print")

    if (testbeds.length === 0) {
             return res.status(204).send(); // NO_CONTENT
         }

    res.status(200).json(testbeds);

    // res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
})

app.get(
    '/testbeds',
    asyncHandler(async (req, res) => {


        const testbeds = await testbedService.getTestbeds();

            console.log("in testbeds2")
    console.log(testbeds)
    console.log("after print")

        if (testbeds.length === 0) {
            return res.status(204).send(); // NO_CONTENT
        }

        res.status(200).json(testbeds);
    })
);

app.post(
    '/testbeds',
    (req, res) => {

        console.log(req.body);

        const { name, acronym, description, statuses, items } = req.body;

        console.log(statuses)

        if (!name || !acronym) {
            return res.status(400).json({ error: 'Name and acronym are required' });
        }

        const testbed =  testbedService.createTestbed({
            name,
            acronym,
            description,
            statuses,
            items
        });

        res.status(201).json(testbed);
    }
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(3000, () => {
            console.log('Server listening on port 3000');
        });


//     asyncHandler(async (req, res) => {
//         const testbeds = await testbedService.getTestbeds();

//         if (testbeds.length === 0) {
//             return res.status(204).send(); // NO_CONTENT
//         }

//         res.status(200).json(testbeds);
//     })
// );

// error handling
app.use(errorHandler);

export default app;
