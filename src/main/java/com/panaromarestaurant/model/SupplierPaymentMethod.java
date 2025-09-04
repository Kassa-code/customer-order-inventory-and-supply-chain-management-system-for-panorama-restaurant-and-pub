package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, meaning it maps to a table in the database
@Table(name = "supplierpaymentmethod") // Maps this entity to the "supplierpaymentmethod" table

@Data // Lombok annotation that generates getters, setters, toString, equals, and
      // hashCode methods
@AllArgsConstructor // Lombok generates a constructor with all fields
@NoArgsConstructor // Lombok generates a default no-argument constructor

public class SupplierPaymentMethod {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Primary key will auto-increment in the database
    private Integer id; // Unique identifier for each supplier payment method record

    private String name; // Describes the method of payment (e.g., "Cash", "Bank Transfer", "Cheque")
}
