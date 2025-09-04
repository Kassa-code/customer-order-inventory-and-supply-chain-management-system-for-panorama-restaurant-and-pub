package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.Employee;

// Defines a repository interface for the Employee entity, extending JpaRepository
public interface EmployeeDao extends JpaRepository<Employee, Integer> {
     // JpaRepository provides built-in CRUD operations such as findAll(), save(),
     // delete(), etc.

     /*
      * --------------------------------
      * 1 Native Query (Raw SQL Query)
      * --------------------------------
      * - Native Queries allow direct execution of SQL statements.
      * - They are database-dependent and use actual table and column names.
      * - Suitable for complex queries, stored procedures, or database-specific
      * functions.
      * - The "nativeQuery = true" flag must be set.
      */

     // Retrieves the next available employee number as an 8-digit string, padding it
     // with leading zeros.
     // Uses a native SQL query to fetch the highest employee number, increment it by
     // 1, and format it.
     @Query(value = "SELECT LPAD(MAX(e.emp_no) + 1, 8, '0') FROM panaromarestaurant.employee AS e;", nativeQuery = true)
     String getNextEmpNo();

     /*
      * ----------------------------
      * 2 JPA Query (JPQL - Java Persistence Query Language)
      * ----------------------------
      * - JPQL is an object-oriented query language provided by JPA.
      * - It operates on entity objects rather than database tables.
      * - The advantage of JPQL is that it works across different database types.
      * - Unlike native queries, JPQL does NOT require "nativeQuery = true".
      */

     // Retrieves an Employee entity by NIC (National Identity Card Number)
     // JPQL uses "Employee" (the entity name) instead of the table name.
     @Query(value = "SELECT e FROM Employee e WHERE e.nic = ?1")
     Employee getByNIC(String nic);

     // Retrieves an Employee entity by email
     @Query(value = "SELECT e FROM Employee e WHERE e.email = ?1")
     Employee getByEmail(String email);

     // Retrieves an Employee entity by mobile number
     @Query(value = "SELECT e FROM Employee e WHERE e.mobileno = ?1")
     Employee getByMobile(String mobileno);

     // Custom query to find all Employees who do not have an associated User account
     @Query(value = "SELECT e FROM Employee AS e WHERE e.id NOT IN (SELECT u.employee_id.id FROM User AS u WHERE u.employee_id IS NOT NULL)")
     // Method to return a list of employees without user accounts
     List<Employee> listUsersWithoutAccount();

     // Custom query to find waitors who have not been assigned to more than 3
     // pending orders
     // Custom query to find waiters (designation_id = 7) who are active (status_id =
     // 1)
     // and have less than 3 pending orders today (order_status_id 1, 2, or 3,
     // order_type_id = 1)
     // The subquery excludes employees assigned to 3 or more pending orders today
     @Query(value = "SELECT * FROM panaromarestaurant.employee AS e WHERE e.designation_id = 7 AND e.status_id = 1 AND e.id NOT IN (SELECT op.employee_id FROM order_process as op where op.date = current_date() and op.order_type_id=1 and (op.order_status_id=1 or op.order_status_id=2 or op.order_status_id=3) GROUP BY op.employee_id HAVING COUNT(op.id) >= 3);", nativeQuery = true)
     List<Employee> getWaitorListWithoutAssign();

     // Custom query to find riders (designation_id = 9) who are active (status_id =
     // 1)
     // and who are not currently assigned to any delivery with order status
     // completed (order_status_id = 3)
     // for orders of type delivery (order_type_id = 4) on the current date
     @Query(value = "SELECT * FROM panaromarestaurant.employee AS e WHERE e.designation_id = 9 AND e.status_id = 1 AND e.id NOT IN (SELECT d.employee_id FROM panaromarestaurant.delivery as d where d.order_process_id in(SELECT op.id FROM order_process as op where op.date = current_date() and op.order_type_id=4 and  op.order_status_id=3));", nativeQuery = true)
     List<Employee> getAvailableRiders();

}

/*
 * ------------------ Summary ------------------
 * Native Query (Raw SQL)
 * - Uses direct SQL and is database-dependent.
 * - Example: getNextEmpNo() fetches the next employee number using SQL
 * functions.
 * 
 * JPA Query (JPQL)
 * - Uses entity names and is database-independent.
 * - Example: getByNIC(), getByEmail(), and getByMobile() retrieve Employee
 * entities using JPQL.
 * 
 * Best Practice:
 * - Use JPQL for most queries (better portability and maintainability).
 * - Use Native Queries only when required (e.g., advanced SQL functions,
 * performance tuning).
 */

/*
 * ------------------ Repository Explanation ------------------
 * 1. This interface extends JpaRepository<Employee, Integer>, meaning:
 * - It manages Employee entities.
 * - The primary key of Employee is of type Integer.
 * 
 * 2. JpaRepository provides the following built-in database operations:
 * - findAll(): Retrieves all Employee records.
 * - findById(id): Fetches an Employee by its primary key.
 * - save(employee): Saves or updates an Employee record.
 * - delete(employee): Deletes a given Employee record.
 * - deleteById(id): Deletes an Employee by its ID.
 * 
 * 3. Custom Queries:
 * - `getNextEmpNo()`: Generates the next employee number in 8-digit format.
 * - `getByNIC(nic)`: Finds an Employee by NIC.
 * - `getByEmail(email)`: Finds an Employee by email.
 * - `getByMobile(mobileno)`: Finds an Employee by mobile number.
 * 
 * 4. This repository layer abstracts database operations,
 * keeping the service and controller layers clean and maintainable.
 */
