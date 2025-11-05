import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import gov.nasa.jpl.clipper.model.Testbed;
import gov.nasa.jpl.clipper.model.ItemData;
import gov.nasa.jpl.clipper.service.ItemService;
import gov.nasa.jpl.clipper.service.ItemServiceImpl;
import gov.nasa.jpl.clipper.testbed.service.TestbedService;
import gov.nasa.jpl.clipper.testbed.service.TestbedServiceImpl;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class runTaco {
    public static void main(String[] args) {
        String route = null;

        for (int i = 0; i < args.length; i++) {
            String arg = args[i];
            if (("-i".equals(arg) || "--input".equals(arg)) && i + 1 < args.length) {
                route = args[++i];
            }
        }

        if (route == null || route.trim().isEmpty()) {
            printUsageAndExit("Missing route. Use -i '/testbeds'");
        }

        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();

            if ("/testbeds".equals(route)) {
                TestbedService testbedService = new TestbedServiceImpl();
                List<Testbed> testbeds = testbedService.getTestbeds();

                if (testbeds == null || testbeds.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(testbeds));
                }
                return;
            }

            Pattern itemDataPattern = Pattern.compile("^/testbed/(\\d+)/item-data/?$");
            Matcher itemDataMatcher = itemDataPattern.matcher(route);
            if (itemDataMatcher.matches()) {
                int testbedId = Integer.parseInt(itemDataMatcher.group(1));
                ItemService itemService = new ItemServiceImpl();
                Map<Integer, ItemData> itemDataMap = itemService.getItemDataMap(testbedId);

                if (itemDataMap == null || itemDataMap.isEmpty()) {
                    System.out.println("{}");
                } else {
                    System.out.println(gson.toJson(itemDataMap));
                }
                return;
            }

            printUsageAndExit("Unsupported route: " + route);
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void printUsageAndExit(String message) {
        if (message != null && !message.isEmpty()) {
            System.err.println(message);
        }
        System.err.println("Usage: java -jar taco-cli.jar -i '/testbeds' | -i '/testbed/<id>/item-data/'");
        System.exit(2);
    }
}
