package com.panaromarestaurant.model; 

import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id; 
import jakarta.persistence.Table;
import lombok.AllArgsConstructor; 
import lombok.Data; 
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, making it a table in the database
@Table(name = "supplierpurchaseorder_status") // Maps this entity to the "supplierpurchaseorder_status" table in the database

@Data // Lombok annotation to generate getter, setter, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields as arguments
@NoArgsConstructor // Lombok annotation to generate a default constructor with no arguments

public class PurchaseOrderStatus {
    
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for the primary key
    private Integer id; // Represents the primary key for the supplierpurchaseorder_status table

    // @Column(name = "status_name", nullable = false, length = 100) // Explicit column mapping (optional)
    private String name; // Represents the status name in the table
}
