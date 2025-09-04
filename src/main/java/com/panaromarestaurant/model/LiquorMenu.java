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

@Entity // JPA entity: maps to a database table
@Table(name = "liquormenu") // Maps to "liquormenu" table

@Data // Lombok: generates getters, setters, etc.
@AllArgsConstructor // Lombok: all-args constructor
@NoArgsConstructor // Lombok: no-args constructor
@JsonInclude(value = Include.NON_NULL) // Exclude null fields in JSON

public class LiquorMenu {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Integer id;

    @NotNull
    private String name; // Liquor menu item name

    @NotNull
    private BigDecimal liquormenuprice; // Item price

    private byte[] liquormenuphoto; // Photo stored as byte array

    @NotNull
    private LocalDateTime added_datetime; // Created timestamp

    private LocalDateTime updated_datetime; // Last update timestamp
    private LocalDateTime deleted_datetime; // Soft delete timestamp

    @NotNull
    private Integer added_user_id; // Created by user ID

    private Integer updated_user_id; // Last updated by user ID
    private Integer deleted_user_id; // Soft deleted by user ID

    // --- Foreign Key Relationships ---

    @ManyToOne
    @JoinColumn(name = "liquormenu_status_id", referencedColumnName = "id")
    private LiquorMenuStatus liquormenu_status_id; // Status 

    @ManyToOne
    @JoinColumn(name = "liquormenu_sub_category_id", referencedColumnName = "id")
    private LiquorMenuSubCategory liquormenu_sub_category_id; // Subcategory

    @ManyToOne
    @JoinColumn(name = "liquormenu_type_id", referencedColumnName = "id")
    private LiquorMenuType liquormenu_type_id; // Type 

    @OneToMany(mappedBy = "liquormenu_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LiquorMenuHasIngredients> liquorMenuHasIngredientList; // Ingredient list
}
