package com.panaromarestaurant.repository; 

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.PurchaseOrder;

// Defines a repository interface for PurchaseOrder entity, extending JpaRepository
// Provides data access methods for generating reports on purchase totals
public interface ReportsDao extends JpaRepository<PurchaseOrder, Integer> {

   // Retrieves total purchase amount grouped by month name for the past 6 months
   // Output format: [MonthName, TotalAmount]
   @Query (value = "SELECT monthname(spo.added_datetime),sum(spo.total_amount) FROM panaromarestaurant.supplierpurchaseorder as spo where spo.added_datetime between current_date() - interval 6 month and current_date() group by monthname(spo.added_datetime);", nativeQuery = true)
   String [][] getPaymentByPreviousSixMonth();

   // Retrieves total purchase amount grouped by month name between two specific
   // dates
   // Parameters: startdate, enddate
   // Output format: [MonthName, TotalAmount]

   @Query (value = "SELECT monthname(spo.added_datetime),sum(spo.total_amount) FROM panaromarestaurant.supplierpurchaseorder as spo where spo.added_datetime between ?1 and ?2 group by monthname(spo.added_datetime);", nativeQuery = true)
   String [][] getPaymentBySdEdMonthly(String startdate , String enddate);

   // Retrieves total purchase amount grouped by week number between two specific
   // dates
   // Parameters: startdate, enddate
   // Output format: [WeekNumber, TotalAmount]

   @Query (value = "SELECT week(spo.added_datetime),sum(spo.total_amount) FROM panaromarestaurant.supplierpurchaseorder as spo where spo.added_datetime between  ?1 and ?2  group by week(spo.added_datetime);", nativeQuery = true)
   String [][] getPaymentBySdEdWeekly(String startdate, String enddate);


   /*
    * SELECT * FROM panaromarestaurant.supplierpayment;
    * SELECT monthname(sp.added_datetime),sum(sp.total_amount) FROM
    * panaromarestaurant.supplierpayment as sp where date(sp.added_datetime)
    * between current_date() - interval 6 Month and current_date() group by
    * monthname(sp.added_datetime);
    */

    // Retrieves total supplier payment amounts grouped by month name
   // between the specified start and end dates.
   // Parameters:
   // - startdate: The start date for filtering (format: 'YYYY-MM-DD')
   // - enddate: The end date for filtering (format: 'YYYY-MM-DD')
   // Output:
   // - A 2D String array where each row contains:
   // [0] → Month name (e.g., 'January')
   // [1] → Sum of total_amount for that month
   @Query (value = "SELECT monthname(sp.added_datetime),sum(sp.total_amount) FROM panaromarestaurant.supplierpayment as sp where sp.added_datetime  between ?1 and ?2 group by monthname(sp.added_datetime);", nativeQuery = true)
   String [][] getSupplierPaymentBySdEdMonthly(String startdate , String enddate);

   // Retrieves total supplier payment amounts grouped by week number
   // between the specified start and end dates.
   // Parameters:
   // - startdate: The start date for filtering (format: 'YYYY-MM-DD')
   // - enddate: The end date for filtering (format: 'YYYY-MM-DD')
   // Output:
   // - A 2D String array where each row contains:
   // [0] → Week number (1–52)
   // [1] → Sum of total_amount for that week

   @Query (value = "SELECT week(sp.added_datetime),sum(sp.total_amount) FROM panaromarestaurant.supplierpayment as sp where sp.added_datetime between  ?1 and ?2  group by week(sp.added_datetime);", nativeQuery = true)
   String [][] getSupplierPaymentBySdEdWeekly(String startdate, String enddate);



   @Query (value = "SELECT date(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 group by date(p.added_datetime);", nativeQuery = true)
   String [][] getCustomerPaymentBySdEdDaily(String startdate, String enddate);

   @Query (value = "SELECT week(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 group by week(p.added_datetime);", nativeQuery = true)
   String [][] getCustomerPaymentBySdEdWeekly(String startdate, String enddate);

   @Query (value = "SELECT monthname(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 group by monthname(p.added_datetime);", nativeQuery = true)
   String [][] getCustomerPaymentBySdEdMonthly(String startdate, String enddate);



   @Query(value = "SELECT date(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 and p.payment_method_id =1 group by date(p.added_datetime);", nativeQuery = true)
   String[][] getCustomerPaymentByCardEdDaily(String startdate, String enddate);

   @Query(value = "SELECT week(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 and p.payment_method_id =1 group by week(p.added_datetime);", nativeQuery = true)
   String[][] getCustomerPaymentByCardWeekly(String startdate, String enddate);

   @Query(value = "SELECT monthname(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 and p.payment_method_id =1 group by monthname(p.added_datetime);", nativeQuery = true)
   String[][] getCustomerPaymentByCardMonthly(String startdate, String enddate);



   @Query(value = "SELECT date(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 and p.payment_method_id =2 group by date(p.added_datetime);", nativeQuery = true)
   String[][] getCustomerPaymentByCashEdDaily(String startdate, String enddate);

   @Query(value = "SELECT week(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 and p.payment_method_id =2 group by week(p.added_datetime);", nativeQuery = true)
   String[][] getCustomerPaymentByCashWeekly(String startdate, String enddate);

   @Query(value = "SELECT monthname(p.added_datetime), sum(p.total_amount) FROM panaromarestaurant.payment as p where p.added_datetime between ?1 and ?2 and p.payment_method_id =2 group by monthname(p.added_datetime);", nativeQuery = true)
   String[][] getCustomerPaymentByCashMonthly(String startdate, String enddate);


   
   @Query(value = "SELECT date(op.added_datetime) , i.itemname , sum(ophi.required_qty) FROM panaromarestaurant.order_process_has_ingredients as ophi, panaromarestaurant.order_process as op, panaromarestaurant.ingredients as i where op.id = ophi.order_process_id and ophi.ingredients_id = i.id and date(op.added_datetime) between ?1 and ?2 group by i.id, date(op.added_datetime);", nativeQuery = true)
   String[][] getIngredientUsageDaily(String startdate, String enddate);

   // --- Weekly (date range; weekly buckets) ---
   @Query(value = "SELECT WEEK(op.added_datetime) , i.itemname , SUM(ophi.required_qty) FROM panaromarestaurant.order_process_has_ingredients AS ophi, panaromarestaurant.order_process AS op, panaromarestaurant.ingredients AS i WHERE op.id = ophi.order_process_id AND ophi.ingredients_id = i.id AND op.added_datetime BETWEEN ?1 AND ?2 GROUP BY i.id, i.itemname, WEEK(op.added_datetime) ORDER BY WEEK(op.added_datetime), i.itemname", nativeQuery = true)
   String[][] getIngredientUsageWeekly(String startdate, String enddate);

   // --- Monthly (date range; monthly buckets) ---
   @Query(value = "SELECT MONTHNAME(op.added_datetime) , i.itemname , SUM(ophi.required_qty) FROM panaromarestaurant.order_process_has_ingredients AS ophi, panaromarestaurant.order_process AS op, panaromarestaurant.ingredients AS i WHERE op.id = ophi.order_process_id AND ophi.ingredients_id = i.id AND op.added_datetime BETWEEN ?1 AND ?2 GROUP BY i.id, i.itemname, MONTH(op.added_datetime), MONTHNAME(op.added_datetime) ORDER BY MONTH(op.added_datetime), i.itemname", nativeQuery = true)
   String[][] getIngredientUsageMonthly(String startdate, String enddate);

   @Query(value = "SELECT date(op.added_datetime) , count(op.id)  FROM panaromarestaurant.order_process as op where date(op.added_datetime) between ?1 and ?2 group by date(op.added_datetime);", nativeQuery = true)
   String[][] getSalesDaily(String startdate, String enddate);

   @Query(value = "SELECT week(op.added_datetime) , count(op.id)  FROM panaromarestaurant.order_process as op where date(op.added_datetime) between ?1 and ?2 group by week(op.added_datetime);", nativeQuery = true)
   String[][] getSalesWeekly(String startdate, String enddate);

   @Query(value = "SELECT monthname(op.added_datetime) , count(op.id)  FROM panaromarestaurant.order_process as op where date(op.added_datetime) between ?1 and ?2 group by monthname(op.added_datetime);", nativeQuery = true)
   String[][] getSalesMonthly(String startdate, String enddate);


   @Query(value = "SELECT DATE(oi.complete_datetime) AS complete_date, oi.name, SUM(oi.completed_qty) AS total_completed_qty,SUM(oi.line_price) AS total_line_price FROM panaromarestaurant.order_item AS oi WHERE oi.is_confirm = 1 AND DATE(oi.complete_datetime) BETWEEN ?1 AND ?2 GROUP BY oi.name, DATE(oi.complete_datetime) ORDER BY complete_date, oi.name;", nativeQuery = true)
   String[][] getSalesByItemDaily(String startdate, String enddate);

   // --- Weekly Sales by Item (date range; weekly buckets) ---
   @Query(value = "SELECT WEEK(oi.complete_datetime) AS complete_week, oi.name, SUM(oi.completed_qty) AS total_completed_qty, SUM(oi.line_price) AS total_line_price FROM panaromarestaurant.order_item AS oi WHERE oi.is_confirm = 1 AND oi.complete_datetime BETWEEN ?1 AND ?2 GROUP BY oi.name, WEEK(oi.complete_datetime) ORDER BY complete_week, oi.name", nativeQuery = true)
   String[][] getSalesByItemWeekly(String startdate, String enddate);

   // --- Monthly Sales by Item (date range; monthly buckets) ---
   @Query(value = "SELECT MONTHNAME(oi.complete_datetime) AS complete_month, oi.name, SUM(oi.completed_qty) AS total_completed_qty, SUM(oi.line_price) AS total_line_price FROM panaromarestaurant.order_item AS oi WHERE oi.is_confirm = 1 AND oi.complete_datetime BETWEEN ?1 AND ?2 GROUP BY oi.name, MONTH(oi.complete_datetime), MONTHNAME(oi.complete_datetime) ORDER BY MONTH(oi.complete_datetime), oi.name", nativeQuery = true)
   String[][] getSalesByItemMonthly(String startdate, String enddate);


}
