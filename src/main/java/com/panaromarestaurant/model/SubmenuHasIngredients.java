package com.panaromarestaurant.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, meaning it will be mapped to a table in the database
@Table(name = "submenu_has_ingredients") // Specifies the actual table name in the database

@Data // Lombok: Auto-generates getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok: Generates constructor with all fields
@NoArgsConstructor // Lombok: Generates a no-argument constructor
public class SubmenuHasIngredients {

    @Id // Declares this field as the primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates primary key values using auto-increment strategy
    private Integer id;

    @NotNull // Ensures the qty field must not be null (validation constraint)
    private BigDecimal qty; // The quantity of the ingredient used in the submenu item

    @ManyToOne // Defines a many-to-one relationship with the SubMenu entity
    @JoinColumn(name = "submenu_id", referencedColumnName = "id") // Maps submenu_id in this table to id in SubMenu table
    @JsonIgnore // Prevents serialization issues (e.g., infinite loop) during JSON conversion
    private SubMenu submenu_id; // Reference to the parent submenu that this ingredient belongs to

    // Notes:
    // - Each submenu can contain many ingredients (submenu_has_ingredients).
    // - But each ingredient line here belongs to one submenu (grn_id).

    @ManyToOne // Defines a many-to-one relationship with the Ingredient entity
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id") // Maps ingredients_id in this table to id in Ingredient table
    private Ingredient ingredients_id; // The ingredient used in the submenu item

    // Notes:
    // - One ingredient can appear in many submenu ingredient lines.
    // - But each entry here refers to one specific ingredient.
}
