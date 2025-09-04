package com.panaromarestaurant.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, creating a corresponding table in the database
@Table(name = "employee") // Maps this entity to the "employee" table

@Data // Generates getters, setters, toString, equals, and hashCode methods using Lombok
@AllArgsConstructor // Generates a constructor with all fields as arguments
@NoArgsConstructor // Generates a default constructor with no arguments

public class Employee {
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for the primary key
    private Integer id;

    @Column(name = "emp_no", unique = true) // Maps to the "emp_no" column and ensures uniqueness
    @Length(max = 8) // Sets a maximum length of 8 characters
    @NotNull // Ensures this field cannot be null
    private String emp_no;

    @NotNull // Ensures this field cannot be null
    private String fullname; // Stores the full name of the employee

    private byte[] emp_photo; // Stores employee photo

    @NotNull 
    private String callingname;
    
    @Column(name = "nic", unique = true) // Maps to the "nic" column and ensures uniqueness
    @Length(min = 10, max = 12) // NIC should have between 10 and 12 characters
    @NotNull // Ensures this field cannot be null
    private String nic;

    @NotNull
    private String gender; // Stores the gender of the employee

    @NotNull
    private LocalDate dob; // Stores the date of birth of the employee

    @Column(name = "email", unique = true) // Maps to the "email" column and ensures uniqueness
    @NotNull
    private String email; // Stores the email of the employee

    @NotNull
    private String civilstatus; // Stores the civil status (e.g., Single, Married)

    @Length(max = 10) // Limits the mobile number to 10 characters
    @NotNull
    private String mobileno; // Stores the mobile number of the employee

    @Length(max = 10) // Limits the landline number to 10 characters
    private String landno; // Stores the landline number of the employee (optional)

    @NotNull
    private String address; // Stores the address of the employee


    private String note; // Stores additional notes about the employee

    @NotNull
    private LocalDateTime added_datetime; // Stores the timestamp of when the employee was added

    private LocalDateTime updated_datetime; // Stores the timestamp of when the employee was last updated

    private LocalDateTime deleted_datetime; // Stores the timestamp of when the employee was deleted (if applicable)

    @NotNull
    private Integer added_user_id; // Stores the ID of the user who added the employee record

    private Integer updated_user_id; // Stores the ID of the user who last updated the employee record

    private Integer deleted_user_id; // Stores the ID of the user who deleted the employee record (if applicable)

    @ManyToOne // Establishes a many-to-one relationship with the Designation entity
    @JoinColumn(name = "designation_id", referencedColumnName = "id") // Foreign key linking to Designation
    private Designation designation_id; // Stores the designation of the employee

    @ManyToOne // Establishes a many-to-one relationship with the Status entity
    @JoinColumn(name = "status_id", referencedColumnName = "id") // Foreign key linking to Status
    private EmployeeStatus employeestatus_id; // Stores the current employment status of the employee (e.g., Active, Inactive)
}

