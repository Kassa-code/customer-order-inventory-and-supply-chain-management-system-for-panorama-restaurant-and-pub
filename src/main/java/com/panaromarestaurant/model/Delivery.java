package com.panaromarestaurant.model;

// Validation and persistence annotations
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

// Lombok annotations to reduce boilerplate
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity
@Table(name = "delivery") // Maps to "delivery" table in the database

@Data // Lombok: Generates getters, setters, equals, hashCode, toString
@AllArgsConstructor // Lombok: Constructor with all fields
@NoArgsConstructor // Lombok: No-args constructor (required by JPA)
public class Delivery {

    @Id // Primary key field
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented ID
    private Integer id; // Unique ID for the delivery record

    @Column(name = "code", unique = true) // Unique code for delivery
    @Length(max = 8) // Max length of the code is 8 characters
    @NotNull // Code field cannot be null
    private String code;

    @ManyToOne // Many deliveries can have one status
    @JoinColumn(name = "deliverystatus_id", referencedColumnName = "id") // Foreign key to DeliverStatus table
    private DeliverStatus deliverystatus_id; // Status of the delivery

    @ManyToOne // Many deliveries can be assigned to one vehicle
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id") // Foreign key to Vehicle table
    private Vehicle vehicle_id; // Vehicle used for the delivery

    @ManyToOne // Many deliveries can be linked to one order process
    @JoinColumn(name = "order_process_id", referencedColumnName = "id") // Foreign key to OrderProcess table
    private OrderProcess order_process_id; // Associated order process

    @ManyToOne // Many deliveries can be handled by one employee
    @JoinColumn(name = "employee_id", referencedColumnName = "id") // Foreign key to Employee table
    private Employee employee_id; // Delivery employee
}
