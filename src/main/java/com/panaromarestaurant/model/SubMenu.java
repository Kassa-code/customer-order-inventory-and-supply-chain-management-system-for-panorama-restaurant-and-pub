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

@Entity // Marks this class as a JPA entity, meaning it will be mapped to a database table
@Table(name = "submenu") // Specifies the name of the database table as "submenu"

@Data // Lombok annotation that generates boilerplate code like getters, setters, toString, equals, and hashCode methods

@AllArgsConstructor // Lombok annotation to generate a constructor with all fields as parameters

@NoArgsConstructor // Lombok annotation to generate a no-argument constructor

@JsonInclude(value = Include.NON_NULL) // Ensures that during JSON serialization, fields with null values are not included in the output

public class SubMenu {

    @Id // Marks the field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies that the primary key will be generated automatically by the database (auto-increment)
    private Integer id;

    @NotNull
    private String name; // Name of the submenu item

    @NotNull
    private BigDecimal submenu_price; // Price of the submenu item stored as BigDecimal for precision in monetary values

    private byte[] submenu_photo; // Stores the submenu photo as a byte array (likely a BLOB in the database)

    @NotNull
    private LocalDateTime added_datetime; // Timestamp indicating when this record was created

    private LocalDateTime updated_datetime; // Timestamp indicating when this record was last updated

    private LocalDateTime deleted_datetime; // Timestamp indicating when this record was soft-deleted (if applicable)

    @NotNull
    private Integer added_user_id; // ID of the user who created this record

    private Integer updated_user_id; // ID of the user who last updated this record

    private Integer deleted_user_id; // ID of the user who performed a soft delete on this record

    // --- Many-to-One Relationships (Foreign Keys) ---

    @ManyToOne // Indicates a many-to-one relationship to another entity
    @JoinColumn(name = "submenu_status_id", referencedColumnName = "id") // Maps this field to the "submenu_status_id" column which references "id" in the related table
    private SubMenuStatus submenu_status_id; // Reference to submenu status (e.g., Active, Inactive)

    @ManyToOne
    @JoinColumn(name = "submenu_sub_category_id", referencedColumnName = "id") // Maps to "submenu_category_id" which references "id" in the category table
    private SubMenuSubCategory submenu_sub_category_id; // Reference to the category this submenu belongs to

    @ManyToOne
    @JoinColumn(name = "submenu_subcategory_type_id", referencedColumnName = "id") // Maps to "submenu_subcategory_type_id" referencing "id" in the subcategory type table
    private SubMennuSubCategoryType submenu_subcategory_type_id; // Reference to the subcategory type(regular,medium,large)

    // Submenu and submenu_has_ingredient has one to many relationship
    @OneToMany(mappedBy = "submenu_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmenuHasIngredients> submenuHasIngredientList;

}
