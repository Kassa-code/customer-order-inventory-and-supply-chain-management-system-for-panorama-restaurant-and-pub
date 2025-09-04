package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.OrderProcess;

// OrderDao interface handles database operations for the Order entity
// It extends JpaRepository to provide all basic CRUD methods automatically

// JpaRepository<Order, Integer>:
// - Order: the entity type this repository manages
// - Integer: the type of the primary key of the Order entity
public interface OrderDao extends JpaRepository<OrderProcess, Integer> {

    // Generates the next order code by extracting the numeric part from the max
    // existing order code,
    // incrementing it by 1, padding with zeros to length 5, and prefixing with
    // 'ODP'.
    // If no existing order codes, returns 'ODP00001'.
     @Query(value = "SELECT coalesce(concat('ODP', lpad(substring(max(op.order_code),4) + 1,5,0)), 'ODP00001') FROM panaromarestaurant.order_process as op ;", nativeQuery = true)
    String getNextOrderCode();

    // Retrieves all orders where status is '1' (new) or '2' (in progress) for the
    // current date,
    // ordered by the added timestamp ascending (oldest first).
    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where (op.order_status_id=1 or op.order_status_id=2) and op.date = current_date() order by op.added_datetime;" , nativeQuery = true)
     List<OrderProcess> listByNewAndInProgress();

     // Retrieves all orders with status '3' (ready) that do not have any associated
     // payment record yet.
     @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.order_status_id=3 and op.id not in (select p.order_process_id from panaromarestaurant.payment as p)", nativeQuery = true)
    List<OrderProcess> bystatusready();
    
    // Retrieves all orders with status 'In Progress' (2) or 'Ready' (3) that have
    // order type 'Delivery' (order_type_id=4).
    // Useful for showing delivery orders that are active or ready.
    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.order_status_id=3 and op.kitchen_status_id=3 and op.order_type_id=4;", nativeQuery = true)
     List<OrderProcess> bystatusreadyandotdelivery();

    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.order_type_id =3 order by op.id desc;", nativeQuery = true)
    List<OrderProcess> getPickUPOrderList();

    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.order_type_id =4 order by op.id desc;", nativeQuery = true)
    List<OrderProcess> getDeliveryOrderList();

    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.order_type_id =2 order by op.id desc;", nativeQuery = true)
    List<OrderProcess> getTakeAwayOrderList();

    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.order_type_id =1 order by op.id desc;", nativeQuery = true)
    List<OrderProcess> getDineInOrderList();

    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op order by op.id desc;", nativeQuery = true)
    List<OrderProcess> getAllOrderList();

    @Query(value = "SELECT * FROM panaromarestaurant.order_process as op where op.service_charge order by op.id desc;", nativeQuery = true)
    List<OrderProcess> getServiceChargeOrderList();


    // You can define custom query methods here if needed
    // Example:
    // List<Order> findByCustomerId(Integer customerId);
    // Optional<Order> findTopByOrderByAddedDateDesc();

}
