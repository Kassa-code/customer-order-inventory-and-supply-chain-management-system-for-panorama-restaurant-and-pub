package com.panaromarestaurant.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Declares this class as a JPA entity, mapped to a database table
@Table(name = "order_process_has_ingredients") // Maps to the "order_has_ingredients" table in the database
@Data // Lombok annotation to generate getters, setters, equals, hashCode, toString methods
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields
@NoArgsConstructor // Lombok annotation to generate a no-argument constructor
public class OrderHasIngredients {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented primary key
    private Integer id;

    @NotNull // Field must not be null
    private BigDecimal required_qty; // Quantity of ingredient required for the order

    @NotNull // Field must not be null
    private BigDecimal available_qty; // Quantity of ingredient available (stock)

    @ManyToOne // Many order ingredient lines belong to one order
    @JoinColumn(name = "order_process_id", referencedColumnName = "id") // Foreign key to Order table
    @JsonIgnore // Prevents infinite JSON recursion during serialization
    private OrderProcess order_process_id;

    @ManyToOne // Many order ingredient lines relate to one ingredient
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id") // Foreign key to Ingredient table
    private Ingredient ingredients_id;
}
