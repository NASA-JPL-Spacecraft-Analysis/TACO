export class StateTrackerConstants {
  // Moment
  public static MOMENT_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss';
  public static MOMENT_DATE_PARSE_FORMAT = 'YYYY-MM-DD';
  public static MOMENT_TIME_FORMAT = 'HH:mm';

  // Regex
  public static LINK_REGEX = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;

  // Other
  public static NOT_PRESENT_TEXT = 'Not Present/Absent';
  public static NOT_PRESENT_STATUS_ID = -1;
  public static DEFAULT_RECENTLY_CHANGED_DAYS = 5;
  public static TOOLTIP_DESCRIPTION_MAX_LENGTH = 80;
  public static SAMPLE_ITEM_CHANGES_PAYLOAD = `
  {
    "id":null,
    "itemId":"4",
    "status":3,
    "description":"New description.",
    "version":"001",
    "serialNumber":"12938123-1",
    "partNumber":"01023123",
    "username":"cmhansen",
    "updated":null,
    "rationale":"New rationale."
  }
  `;

  public static SAMPLE_JSON_PAYLOAD = `
    {
      "statuses": [
        {
          "status": "Status Name Here",
          "color": "#a6cd13"
        },
        {
          "status": "Engineering Model (EM)",
          "color": "#00216b"
        }
      ],
      "testbedStructure": {
        "name": "Testbed Name",
        "acronym": "Testbed Acronym",
        "items": [
          {
            "name": "C&DH",
            "fullname": "Command & Data Handling",
            "children": [
              {
                "name": "ECE A",
                "fullname": "Europa Compute Element A",
                "children": [
                  {
                    "name": "ECE PCU",
                    "fullname": "ECE Power Conditioning Unit"
                  },
                  {
                    "name": "SFC",
                    "fullname": "Spacecraft Flight Computer"
                  }
                ]
              }
            ]
          },
          {
            "name": "SSE",
            "fullname": "Simulation and Support Equipment",
            "children": [
              {
                "name": "SSE SW Version",
                "fullname": "SSE Software Version"
              }
            ]
          }
        ]
      }
    }
  `;
}
