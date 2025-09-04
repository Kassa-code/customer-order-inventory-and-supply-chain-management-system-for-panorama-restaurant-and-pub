package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, mapping it to a database table
@Table(name = "dailyoutstock") // Specifies the table name as "dailyoutstock"

@Data // Automatically generates getters, setters, toString, equals, and hashCode methods for all fields in the class
@AllArgsConstructor // Automatically generates a constructor with one parameter for each field in the class
@NoArgsConstructor // Automatically generates a no-argument constructor (default constructor)
@JsonInclude(value = Include.NON_NULL) // Ensures that during JSON serialization, only non-null fields are included in the output

public class DailyOutStock {

    @Id // Specifies the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Primary key is auto-incremented by the database
    private Integer id;

    @NotNull // Field cannot be null
    private LocalDate out_date; // Date of the stock going out

    @NotNull // Field cannot be null
    private BigDecimal out_qty; // Quantity of stock going out

    @NotNull // Field cannot be null
    private BigDecimal in_qty; // Quantity of stock coming in (possibly for adjustment or transfer tracking)

    @NotNull // Field cannot be null
    private LocalDateTime added_datetime; // Date and time the record was added

    @NotNull // Field cannot be null
    private Integer added_user_id; // ID of the user who added this record

    @ManyToOne // Many DailyOutStock records can be associated with one Ingredient
    @JoinColumn(name = "from_ingredients_id", referencedColumnName = "id") // Foreign key to Ingredient table
    private Ingredient from_ingredients_id;

    @ManyToOne // Many DailyOutStock records can be associated with one Inventory
    @JoinColumn(name = "from_inventory_id", referencedColumnName = "id") // Foreign key to Inventory table
    private Inventory from_inventory_id;

    @ManyToOne // Many DailyOutStock records can be associated with one Inventory
    @JoinColumn(name = "in_inventory_id", referencedColumnName = "id") // Foreign key to Inventory table
    private Inventory in_inventory_id;

    @ManyToOne // Many DailyOutStock records can be associated with one Ingredient
    @JoinColumn(name = "to_ingredients_id", referencedColumnName = "id") // Foreign key to Ingredient table
    private Ingredient to_ingredients_id;
}
