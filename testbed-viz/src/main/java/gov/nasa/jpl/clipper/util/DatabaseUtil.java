package gov.nasa.jpl.clipper.util;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DatabaseUtil {
    private static ComboPooledDataSource dataSource;
    private static final String mysqlDateFormatString = "yyyy-MM-dd HH:mm:ss";
    private static final String isoFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    static {
        try {
            dataSource = new ComboPooledDataSource();
            dataSource.setDriverClass("com.mysql.cj.jdbc.Driver");

            dataSource.setJdbcUrl(System.getenv("JDBC_URL"));
            dataSource.setUser(System.getenv("JDBC_USER"));
            dataSource.setPassword(System.getenv("JDBC_PASS"));

            dataSource.setMinPoolSize(3);
            dataSource.setMaxPoolSize(20);
            dataSource.setAcquireIncrement(1);
            dataSource.setTestConnectionOnCheckin(true);
            dataSource.setIdleConnectionTestPeriod(300);
            dataSource.setMaxIdleTimeExcessConnections(240);
            dataSource.setMaxStatements(100);
            dataSource.setInitialPoolSize(5);
        } catch (PropertyVetoException e) {
            e.printStackTrace();
        }
    }

    public static DataSource getDataSource() {
        return dataSource;
    }

    public static String convertIsoDate(String date) {
        DateFormat outputFormat = new SimpleDateFormat(mysqlDateFormatString, Locale.ENGLISH);

        TemporalAccessor ta = DateTimeFormatter.ISO_INSTANT.parse(date);
        Instant instant = Instant.from(ta);
        Date parsedDate = Date.from(instant);

        return outputFormat.format(parsedDate);
    }

    public static String convertDateToMysqlDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        DateFormat inputDateFormat = new SimpleDateFormat(mysqlDateFormatString, Locale.ENGLISH);
        String formattedDate = inputDateFormat.format(date);

        calendar.setTime(date);

        if (calendar.get(Calendar.HOUR_OF_DAY) == 0) {
            StringBuilder sb = new StringBuilder(formattedDate);
            sb.replace(sb.lastIndexOf("24"), sb.lastIndexOf("24") + 1, "00");
            formattedDate = sb.toString();
        }

        return formattedDate;
    }

    public static String convertMysqlDate(String date) {
        DateFormat inputFormat = new SimpleDateFormat(mysqlDateFormatString, Locale.ENGLISH);
        DateFormat outputFormat = new SimpleDateFormat(isoFormat, Locale.ENGLISH);

        return convertDate(date, inputFormat, outputFormat);
    }

    private static String convertDate(String date, DateFormat inputFormat, DateFormat outputFormat) {
        try {
            Date parsedDate = inputFormat.parse(date);

            return outputFormat.format(parsedDate);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
