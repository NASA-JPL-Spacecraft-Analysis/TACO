import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import gov.nasa.jpl.clipper.model.Testbed;
import gov.nasa.jpl.clipper.model.ItemData;
import gov.nasa.jpl.clipper.model.Comparison;
import gov.nasa.jpl.clipper.model.ItemChanges;
import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.service.ItemService;
import gov.nasa.jpl.clipper.service.ItemServiceImpl;
import gov.nasa.jpl.clipper.service.ImageService;
import gov.nasa.jpl.clipper.service.ImageServiceImpl;
import gov.nasa.jpl.clipper.testbed.service.TestbedService;
import gov.nasa.jpl.clipper.testbed.service.TestbedServiceImpl;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;

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

            Pattern testbedByIdPattern = Pattern.compile("^/testbed/(\\d+)$");
            Matcher testbedByIdMatcher = testbedByIdPattern.matcher(route);
            if (testbedByIdMatcher.matches()) {
                int testbedId = Integer.parseInt(testbedByIdMatcher.group(1));
                TestbedService testbedService = new TestbedServiceImpl();
                Testbed testbed = testbedService.getTestbedById(testbedId);

                if (testbed == null) {
                    System.out.println("null");
                } else {
                    System.out.println(gson.toJson(testbed));
                }
                return;
            }

            Pattern comparisonPattern = Pattern.compile("^/testbed/(\\d+)/comparison/([^/]+)/([^/]+)/?$");
            Matcher comparisonMatcher = comparisonPattern.matcher(route);
            if (comparisonMatcher.matches()) {
                int testbedId = Integer.parseInt(comparisonMatcher.group(1));
                String firstDatetime = comparisonMatcher.group(2);
                String secondDatetime = comparisonMatcher.group(3);
                ItemService itemService = new ItemServiceImpl();
                List<Comparison> comparison = itemService.getComparison(testbedId, firstDatetime, secondDatetime);

                if (comparison == null || comparison.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(comparison));
                }
                return;
            }

            Pattern snapshotPattern = Pattern.compile("^/testbed/(\\d+)/snapshot/?$");
            Matcher snapshotMatcher = snapshotPattern.matcher(route);
            if (snapshotMatcher.matches()) {
                int testbedId = Integer.parseInt(snapshotMatcher.group(1));
                ItemService itemService = new ItemServiceImpl();
                List<ItemData> snapshot = itemService.getSnapshot(testbedId);

                if (snapshot == null || snapshot.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(snapshot));
                }
                return;
            }

            Pattern snapshotDatePattern = Pattern.compile("^/testbed/(\\d+)/snapshot/(.+)$");
            Matcher snapshotDateMatcher = snapshotDatePattern.matcher(route);
            if (snapshotDateMatcher.matches()) {
                int testbedId = Integer.parseInt(snapshotDateMatcher.group(1));
                String dateTime = snapshotDateMatcher.group(2);
                ItemService itemService = new ItemServiceImpl();
                List<ItemData> snapshot = itemService.getSnapshot(testbedId, dateTime);

                if (snapshot == null || snapshot.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(snapshot));
                }
                return;
            }

            Pattern itemChangesByItemPattern = Pattern.compile("^/item-changes/(\\d+)/?$");
            Matcher itemChangesByItemMatcher = itemChangesByItemPattern.matcher(route);
            if (itemChangesByItemMatcher.matches()) {
                int itemId = Integer.parseInt(itemChangesByItemMatcher.group(1));
                ItemService itemService = new ItemServiceImpl();
                List<ItemChanges> changes = itemService.getItemChangesByItemId(itemId);

                if (changes == null || changes.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(changes));
                }
                return;
            }

            if ("/item-data-map".equals(route)) {
                ItemService itemService = new ItemServiceImpl();
                Map<Integer, Map<Integer, ItemData>> map = itemService.getItemDataMap();
                if (map == null || map.isEmpty()) {
                    System.out.println("{}");
                } else {
                    System.out.println(gson.toJson(map));
                }
                return;
            }

            Pattern itemByIdPattern = Pattern.compile("^/items/(\\d+)/?$");
            Matcher itemByIdMatcher = itemByIdPattern.matcher(route);
            if (itemByIdMatcher.matches()) {
                int itemId = Integer.parseInt(itemByIdMatcher.group(1));
                ItemService itemService = new ItemServiceImpl();
                ItemData item = itemService.getItemDataById(itemId);
                if (item == null) {
                    System.out.println("null");
                } else {
                    System.out.println(gson.toJson(item));
                }
                return;
            }

            Pattern testbedItemsPattern = Pattern.compile("^/testbed/(\\d+)/items(\\?.*)?$");
            Matcher testbedItemsMatcher = testbedItemsPattern.matcher(route);
            if (testbedItemsMatcher.matches()) {
                int testbedId = Integer.parseInt(testbedItemsMatcher.group(1));
                String query = testbedItemsMatcher.group(2);
                List<Integer> ids = new ArrayList<>();
                if (query != null && query.startsWith("?")) {
                    for (String part : query.substring(1).split("&")) {
                        String[] kv = part.split("=", 2);
                        if (kv.length == 2 && "itemId".equals(kv[0]) && kv[1] != null && !kv[1].isEmpty()) {
                            for (String s : kv[1].split(",")) {
                                ids.add(Integer.parseInt(s));
                            }
                        }
                    }
                }
                ItemService itemService = new ItemServiceImpl();
                List<ItemData> items = itemService.getItemMetadataWithIds(testbedId, ids);
                if (items == null || items.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(items));
                }
                return;
            }

            Pattern itemsFindPattern = Pattern.compile("^/items/find(\\?.*)?$");
            Matcher itemsFindMatcher = itemsFindPattern.matcher(route);
            if (itemsFindMatcher.matches()) {
                String query = itemsFindMatcher.group(1);
                List<Integer> testbedIds = new ArrayList<>();
                String searchString = null;
                if (query != null && query.startsWith("?")) {
                    for (String part : query.substring(1).split("&")) {
                        String[] kv = part.split("=", 2);
                        if (kv.length == 2) {
                            if ("testbedIds".equals(kv[0]) && kv[1] != null && !kv[1].isEmpty()) {
                                for (String s : kv[1].split(",")) {
                                    testbedIds.add(Integer.parseInt(s));
                                }
                            } else if ("searchString".equals(kv[0])) {
                                searchString = kv[1];
                            }
                        }
                    }
                }
                ItemService itemService = new ItemServiceImpl();
                List<ItemChanges> results = itemService.searchItemChangesForTestbeds(searchString, testbedIds);
                if (results == null || results.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(results));
                }
                return;
            }

            Pattern historyPattern = Pattern.compile("^/history/(\\d+)/?$");
            Matcher historyMatcher = historyPattern.matcher(route);
            if (historyMatcher.matches()) {
                int testbedId = Integer.parseInt(historyMatcher.group(1));
                ItemService itemService = new ItemServiceImpl();
                List<ItemChanges> history = itemService.getItemChanges(testbedId);
                if (history == null || history.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(history));
                }
                return;
            }

            Pattern imagePattern = Pattern.compile("^/image/(\\d+)/?$");
            Matcher imageMatcher = imagePattern.matcher(route);
            if (imageMatcher.matches()) {
                int itemChangeId = Integer.parseInt(imageMatcher.group(1));
                ImageService imageService = new ImageServiceImpl();
                InputStream in = imageService.getImage(itemChangeId);
                if (in == null) {
                    System.out.println("null");
                } else {
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    byte[] buf = new byte[8192];
                    int r;
                    while ((r = in.read(buf)) != -1) { baos.write(buf, 0, r); }
                    byte[] bytes = baos.toByteArray();
                    System.out.println("{\"bytes\":" + bytes.length + "}");
                }
                return;
            }

            if ("/testbed-settings".equals(route)) {
                TestbedService testbedService = new TestbedServiceImpl();
                List<TestbedSettings> settings = testbedService.getTestbedSettings();
                if (settings == null || settings.isEmpty()) {
                    System.out.println("[]");
                } else {
                    System.out.println(gson.toJson(settings));
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
        System.err.println("Usage: java -jar taco-cli.jar -i '<route>'");
        System.err.println("Routes:");
        System.err.println("  /testbeds");
        System.err.println("  /testbed/<id>");
        System.err.println("  /testbed/<id>/item-data");
        System.err.println("  /testbed/<id>/comparison/<firstDatetime>/<secondDatetime>");
        System.err.println("  /testbed/<id>/snapshot");
        System.err.println("  /testbed/<id>/snapshot/<dateTime>");
        System.err.println("  /item-changes/<itemId>");
        System.err.println("  /item-data-map");
        System.err.println("  /items/<itemId>");
        System.err.println("  /testbed/<id>/items?itemId=1,2,3");
        System.err.println("  /items/find?testbedIds=1,2&searchString=foo");
        System.err.println("  /history/<testbedId>");
        System.err.println("  /image/<itemChangesId>");
        System.err.println("  /testbed-settings");
        System.exit(2);
    }
}
