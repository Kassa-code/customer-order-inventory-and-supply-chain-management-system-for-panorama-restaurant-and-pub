package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Marks this class as a JPA entity mapped to a database table
@Entity
// Specifies the name of the database association table to which this entity is
// mapped
@Table(name = "supplier_has_ingredients")
// Lombok annotation to generate getters, setters, equals, hashCode, and
// toString methods
@Data
// Lombok annotation to generate a constructor with all arguments
@AllArgsConstructor
// Lombok annotation to generate a no-arguments constructor
@NoArgsConstructor
public class SupplierHasIngredient {

    // Marks this field as part of the composite primary key
    @Id
    // Defines a many-to-one relationship between SupplierHasIngredient and
    // Ingredient
    @ManyToOne
    // Specifies the foreign key column in the table and its reference to the
    // Ingredient entity's ID
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id")
    private Ingredient ingredients_id;

    // Marks this field as part of the composite primary key
    @Id
    // Defines a many-to-one relationship between SupplierHasIngredient and Supplier
    @ManyToOne
    // Specifies the foreign key column in the table and its reference to the
    // Supplier entity's ID
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier_id;
}
