package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDate;

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

@Entity // Marks this class as a JPA entity, meaning it maps to a table in the database
@Table(name = "grn_has_ingredients") // Specifies the table name in the database

@Data // Lombok annotation to generate getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Generates a constructor with all fields
@NoArgsConstructor // Generates a default constructor with no arguments
public class GrnHasIngredients {

    @Id // Declares this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates values using identity strategy (auto-increment)
    private Integer id;

    @NotNull // This field must not be null
    private BigDecimal grn_quantity; // Quantity of ingredients received

    @NotNull // This field must not be null
    private BigDecimal purchase_price; // Purchase price per unit

    @NotNull // This field must not be null
    private BigDecimal line_price; // Total cost for this line (grn_quantity * purchase_price)

    private String batchno; // Batch no field

    private LocalDate expdate; // expire date
    
    private LocalDate mfcdate; // expire date

    @ManyToOne // Many GrnHasIngredients entries can be linked to one GoodReceiveNote
    @JoinColumn(name = "grn_id", referencedColumnName = "id") // Creates a foreign key column (grn_id) referencing GoodReceiveNote.
    @JsonIgnore // Prevents infinite loop during JSON serialization caused by bi-directional relationships
    private GoodReceiveNote grn_id; // The GRN (Good Receive Note) this ingredient line is linked to

    // Explanation:
    // - This is a many-to-one relationship.
    // - One GRN can contain multiple ingredient lines (GrnHasIngredients entries).
    // - But each ingredient line refers to exactly one GRN.

    @ManyToOne // Many GrnHasIngredients entries can refer to one Ingredient
    @JoinColumn(name = "ingredients_id", referencedColumnName = "id") // Creates a foreign key column (ingredients_id) referencing Ingredient.id
    private Ingredient ingredients_id; // The specific ingredient used in this line item

    // Explanation:
    // - This is also a many-to-one relationship.
    // - One ingredient can appear in many GRN lines.
    // - But each line item is associated with exactly one ingredient.
}
