package com.panaromarestaurant.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity (mapped to a database table)
@Table(name = "menu_has_liquormenu") // Maps this entity to the "menu_has_liquormenu" table

@Data // Lombok: Generates getters, setters, equals, hashCode, and toString methods
@AllArgsConstructor // Lombok: Generates a constructor with all class fields
@NoArgsConstructor // Lombok: Generates a no-arguments constructor

public class MenuHasLiquorMenu {

    @Id // Indicates this field is the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies auto-increment behavior for ID
    private Integer id;

    @NotNull // Field is mandatory (cannot be null)
    private BigDecimal qty; // Quantity of the liquor menu item used in the main menu

    @NotNull // Field is mandatory (cannot be null)
    private BigDecimal price; // Price for the specified quantity
    
    @NotNull // Field is mandatory (cannot be null)
    private BigDecimal line_price; // Price for the specified quantity

    @ManyToOne // Defines a many-to-one relationship with the Menu entity
    @JoinColumn(name = "menu_id", referencedColumnName = "id") // Foreign key to the Menu table
    @JsonIgnore // Excludes this field from JSON output to prevent infinite recursion
    private Menu menu_id; // Reference to the parent menu

    @ManyToOne // Defines a many-to-one relationship with the LiquorMenu entity
    @JoinColumn(name = "liquormenu_id", referencedColumnName = "id") // Foreign key to the LiquorMenu table
    private LiquorMenu liquormenu_id; // Reference to the liquor menu item used
}
