package com.panaromarestaurant.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity (mapped to a database table)
@Table(name = "menu_has_submenu") // Maps the entity to the "menu_has_submenu" table

@Data // Lombok: Generates getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok: Generates a constructor with all fields
@NoArgsConstructor // Lombok: Generates a no-argument constructor

public class MenuHasSubMenu {

    @Id // Specifies the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the ID value
    private Integer id;

    @NotNull // Field must not be null
    private BigDecimal qty; // Quantity of the submenu item used in the menu

    @NotNull // Field must not be null
    private BigDecimal price; // Price of the quantity used 
    
    @NotNull // Field must not be null
    private BigDecimal line_price; //Line Price of the quantity 

    @ManyToOne // Defines a many-to-one relationship to the Menu entity
    @JoinColumn(name = "menu_id", referencedColumnName = "id") // Foreign key column in the table
    @JsonIgnore // Prevents circular reference during JSON serialization
    private Menu menu_id; // Reference to the parent menu

    @ManyToOne // Defines a many-to-one relationship to the SubMenu entity
    @JoinColumn(name = "submenu_id", referencedColumnName = "id") // Foreign key column in the table
    private SubMenu submenu_id; // Reference to the submenu (ingredient) used in the menu
}
