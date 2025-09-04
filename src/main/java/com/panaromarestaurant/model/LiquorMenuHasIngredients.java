package com.panaromarestaurant.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks as JPA entity
@Table(name = "liquormenu_has_ingredients") // Maps to liquormenu_has_ingredients table

@Data // Lombok: Getters, setters, toString, equals, hashCode
@AllArgsConstructor // Lombok: Constructor with all fields
@NoArgsConstructor // Lombok: No-args constructor

public class LiquorMenuHasIngredients {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Integer id;

    @NotNull // Field must not be null
    private BigDecimal qty; // Quantity of the ingredient used

    @ManyToOne // Many-to-one relation with LiquorMenu
    @JoinColumn(name = "liquormenu_id", referencedColumnName = "id")
    @JsonIgnore // Prevent infinite recursion in JSON
    private LiquorMenu liquormenu_id;

    @ManyToOne // Many-to-one relation with Ingredient
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id")
    private Ingredient ingredients_id;
}
