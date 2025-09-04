package com.panaromarestaurant.model;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity (maps to a database table)
@Table(name = "menu") // Maps this entity to the "menu" table in the database

@Data // Lombok annotation to generate getters, setters, equals, hashCode, and toString
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields
@NoArgsConstructor // Lombok annotation to generate a no-args constructor
@JsonInclude(value = Include.NON_NULL) // Excludes null values from JSON serialization

public class Menu {

    @Id // Specifies the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the ID (typically auto-increment)
    private Integer id;

    @NotNull // Name cannot be null
    private String name; // Name of the menu item

    @NotNull // Price cannot be null
    private BigDecimal price; // Price of the menu item

    // Stores menu photo image data as a byte array (optional)
    private byte[] menu_photo;

    @NotNull // Date and time when the menu item was added (cannot be null)
    private LocalDateTime added_datetime;

    // Date and time when the menu item was last updated (nullable)
    private LocalDateTime updated_datetime;

    // Date and time when the menu item was soft deleted (nullable)
    private LocalDateTime deleted_datetime;

    @NotNull // ID of the user who added this menu item (cannot be null)
    private Integer added_user_id;

    // ID of the user who last updated the menu item (nullable)
    private Integer updated_user_id;

    // ID of the user who soft deleted the menu item (nullable)
    private Integer deleted_user_id;

    // --- Relationships ---

    @ManyToOne // Many Menu items can share the same MenuStatus
    @JoinColumn(name = "menu_status_id", referencedColumnName = "id") // Foreign key column for MenuStatus
    private MenuStatus menu_status_id; // Reference to the menu status entity

    @OneToMany(mappedBy = "menu_id", cascade = CascadeType.ALL, orphanRemoval = true)
    // One Menu entity can have many associated MenuHasSubMenu entities
    private List<MenuHasSubMenu> menuHasSubMenuList; // List of submenu associations for this menu

    @OneToMany(mappedBy = "menu_id", cascade = CascadeType.ALL, orphanRemoval = true)
    // One Menu entity can have many associated MenuHasLiquorMenu entities
    private List<MenuHasLiquorMenu> menuHasLiquorMenuList; // List of liquor menu associations for this menu
}
