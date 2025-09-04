package com.panaromarestaurant.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "supplierpurchaseorder_has_ingredients") // Maps this entity to the "supplierpurchaseorder_has_ingredients" table
@Data // Generates getters, setters, toString, equals, and hashCode methods using Lombok
@AllArgsConstructor // Generates a constructor with all fields as arguments
@NoArgsConstructor // Generates a default constructor with no arguments

public class PurchaseOrderHasIngredients {
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for the primary key
    private Integer id;

    @NotNull // Ensures this field cannot be null
    private BigDecimal unit_price; // Stores the unit price of the ingredient

    @NotNull // Ensures this field cannot be null
    private Integer quantity; // Stores the quantity of the ingredient

    @NotNull // Ensures this field cannot be null
    private BigDecimal line_price; // Stores the line price calculated as unit price multiplied by quantity

    @ManyToOne // Establishes a many-to-one relationship with the Ingredient entity
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id") // Foreign key linking to Ingredient
    private Ingredient ingredients_id; // Stores the ingredient associated with the purchase order line

    @ManyToOne // Establishes a many-to-one relationship with the PurchaseOrder entity
    @JoinColumn(name = "supplierpurchaseorder_id", referencedColumnName = "id") // Foreign key linking to PurchaseOrder
    @JsonIgnore // Prevents recursion ( reading property)
    private PurchaseOrder supplierpurchaseorder_id; // Stores the purchase order associated with the ingredient line
}
