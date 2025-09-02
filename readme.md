# TACO (Testbed Asset Collection for Operations)

## Project Components

-   [Middle-tier](testbed-viz/README.md)
-   [Front-end](front-end/README.md)

## Building From Scratch

Requirements for running locally:

1. Docker
2. Maven
3. Node.js

First you'll need to edit `docker.compose.yml` to point it to the database you're going to use. The commented out example is to connect to the local dockerized MySQL.

After installing the above dependences, follow these instructions to run the application locally:

1. Navigate to the `front-end` directory.
2. Run `npm i` to install the front-end dependences.
3. Start the docker containers, run `./run-dev.sh`

4. Build and deploy the `.war` for the backend by running `./build.sh <env>`.
    - This will need to rebuilt on EVERY change to the FE and BE

The application should now be running and will be accessible at `http://localhost:4200/taco`

## Setting up the `docker-compose.yml` configuration file

This application uses `docker-compose` to run both in development and production. The base/development configuration is stored in the `docker-compose.yml` file, while the edits to be made for a production instance of the app exist in `docker-compose.prod.yml`. When you run in production, you run the command like this: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml <etc> up`, where each subsequent `.yml` file you specify with the `-f` flag will overrwrite any specific configuration that differs from the files before it.

You **are required to create a file called `docker-compose.custom.yml`** to then override any configuration from the first two files (like the ports that are exposed from the containers to the hosts, for example). That file name specifically is untracked by git (within the `.gitignore` file) to make sure that future updates to the git repository (when updating) do not affect the config and vice versa.

Inside your `docker-compose.custom.yml` you can also add an `environment` variable named `ADMIN_GROUP`. Users added to the AD group listed here will have access to a management page where they can rename and reorder items.

Documentation for docker-compose files is here: https://docs.docker.com/compose/compose-file/

After creating it in the root of the project and editing it to your specifications, the `run-prod.py` script will automatically run the correct command for you to get your containers up and running in a production state! (but if you're following along, don't run that script quite yet!)

Example for changing the default port to access the DB to 3307 in `docker-compose.custom.yml`, as well as setting the actual application's port to be on 8080. Both of these are **required steps**:

```yaml
version: '3.3'

services:
    web:
        ports:
            - '8080:8080'

    db:
        ports:
            - '3307:3306' # incoming data to host on 3307 will go to container's 3306 port
```

## Environment Variables

Supported web server environment variables.

1. `APP_URL` The URL to our application, used in our email notification.
    - Example: `APP_URL=http://localhost:4200/taco`
2. `MYSQL_PASSWORD` (**REQUIRED**) The password for the MySQL database.
3. `TESTBED_VIZ_BASE_URL`
4. `PRODUCTION_FLAG` BOOLEAN - is this the production copy?
5. `AUTH` <CSSO_PROXY, CAM, NO_AUTH> - What auth scheme to use
6. `EMAIL` <SMTP, HTTP_CSSO> - What email scheme to use, has the following sub options
    1. `EMAIL_FROM` - What the email is sent from
    2. `EMAIL_SRL_URL` - email server's URL
    3. `EMAIL_CSSO_URL` - CSSO server's URL
    4. `EMAIL_CSSO_SUB` - CSSO server's auth username
    5. `EMAIL_CSSO_PWD` - CSSO server's auth password

## Setting up the Database

To setup the `testbed-db` schema, you'll need to run the `database_setup.sql` script in the root of the project.
There's a few ways to do it, but a command that should generally work in most situations is `mysql -u testbed-user -h <ADDRESS_OF_DB> -p < database_setup.sql`. This will prompt you for the password you specified in the startup script sections above, and then you should be good to go to access the tool!

## Accessing the Tool

Now you should be able to access the tool at `ADDRESS:PORT/taco` in any "modern" browser.
For example, if you deployed the tool at `besttools.jpl.nasa.gov` on port `8080`, you'd navigate to `besttools.jpl.nasa.gov:8080/taco` in the address bar in your browser.
If a blank screen comes up, try refreshing a couple times and it should eventually take you to the page to upload a new testbed configuration.
