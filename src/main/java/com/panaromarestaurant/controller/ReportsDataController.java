package com.panaromarestaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.panaromarestaurant.model.Privilage;
import com.panaromarestaurant.repository.ReportsDao;

// REST controller for handling report-related data retrieval for the frontend
@RestController
public class ReportsDataController {

    // Inject UserPrivilageController to verify access rights for reports
    @Autowired
    private UserPrivilageController userPrivilageController;

    // Inject ReportsDao to run report-related queries
    @Autowired
    private ReportsDao reportsDao;

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportpayment/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportpayment/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getPaymentReportDate(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Weekly")) {
                return reportsDao.getPaymentBySdEdWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getPaymentBySdEdMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }

    // Endpoint to retrieve payment report for the previous six months
    // URL: /reportpayment/bysixmonth
    @GetMapping(value = "/reportpayment/bysixmonth", produces = "application/json")
    public String[][] getPaymentReportSixMonth() {
        // Directly fetch six-month summary from DAO
        return reportsDao.getPaymentByPreviousSixMonth();
    }

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportsupplierpayment/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportsupplierpayment/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getSupplierPaymentReportDate(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Weekly")) {
                return reportsDao.getSupplierPaymentBySdEdWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getSupplierPaymentBySdEdMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportcustomerpayment/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportcustomerpayment/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getCustomerPaymentReportDate(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Daily")) {
                return reportsDao.getCustomerPaymentBySdEdDaily(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportsDao.getCustomerPaymentBySdEdWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getCustomerPaymentBySdEdMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportcustomerpaymentbycard/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportcustomerpaymentbycard/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getCustomerPaymentByCardReportDate(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Daily")) {
                return reportsDao.getCustomerPaymentByCardEdDaily(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportsDao.getCustomerPaymentByCardWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getCustomerPaymentByCardMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportcustomerpaymentbycash/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportcustomerpaymentbycash/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getCustomerPaymentByCashReportDate(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Daily")) {
                return reportsDao.getCustomerPaymentByCashEdDaily(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportsDao.getCustomerPaymentByCashWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getCustomerPaymentByCashMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportdailyingredientusage/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportdailyingredientusage/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getDailyIngredientUsageReport(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Daily")) {
                return reportsDao.getIngredientUsageDaily(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportsDao.getIngredientUsageWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getIngredientUsageMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }


    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportdailysales/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportdailysales/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getDailySalesReport(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Daily")) {
                return reportsDao.getSalesDaily(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportsDao.getSalesWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getSalesMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }

    // Endpoint to retrieve payment report based on a date range and type
    // URL:
    // /reportdailysalesbyitem/bysdedtype?startdate=2024-01-01&enddate=2024-01-31&type=Monthly
    @GetMapping(value = "/reportdailysalesbyitem/bysdedtype", params = { "startdate", "enddate",
            "type" }, produces = "application/json")
    public String[][] getDailySalesByItemReport(
            @RequestParam("startdate") String startdate,
            @RequestParam("enddate") String enddate,
            @RequestParam("type") String type) {

        // Get currently authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if user has update privilege for "Reports" module
        Privilage userPrivilage = userPrivilageController.getPrivilageByUserModule(auth.getName(), "Reports");

        // If permission is granted, fetch data according to the report type
        if (userPrivilage.getPrivilage_update()) {
            if (type.equals("Daily")) {
                return reportsDao.getSalesByItemDaily(startdate, enddate);
            }
            if (type.equals("Weekly")) {
                return reportsDao.getSalesByItemWeekly(startdate, enddate);
            }
            if (type.equals("Monthly")) {
                return reportsDao.getSalesByItemMonthly(startdate, enddate);
            }
        }

        // Return null if user lacks permission or report type is invalid
        return null;
    }
}
