package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, mapping it to a database table
@Table(name = "ingredients") // Specifies the table name as "ingredients"

@Data //Automatically generates getters, setters, toString, equals, and hashCode methods for all fields in the class

@AllArgsConstructor // Automatically generates a constructor with one parameter for each field in the class

@NoArgsConstructor //Automatically generates a no-argument constructor (default constructor)

@JsonInclude(value = Include.NON_NULL) //Ensures that during JSON serialization, only non-null fields are included in the output

public class Ingredient {

    @Id // Specifies the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Primary key is auto-incremented by the database
    private Integer id;

    @Column(name = "itemcode", unique = true) // Maps to column "itemcode" and ensures uniqueness
    @Length(max = 6) // Limits the maximum length of the item code to 6 characters
    @NotNull // Ensures this field cannot be null
    private String itemcode;

    @NotNull
    private String itemname;

    @NotNull
    private BigDecimal unitsize;

    @NotNull
    private BigDecimal rop; // Reorder Point

    @NotNull
    private BigDecimal roq; // Reorder Quantity

    @NotNull
    private BigDecimal purchasesprice;

    @NotNull
    private BigDecimal profitratio;

    @NotNull
    private BigDecimal salesprice;

    @NotNull
    private BigDecimal discountratio;

    private String note;

    @NotNull
    private LocalDateTime added_datetime; // Timestamp when the ingredient was added

    private LocalDateTime updated_datetime; // Timestamp of last update

    private LocalDateTime deleted_datetime; // Timestamp when the record was marked deleted (soft delete)

    @NotNull
    private Integer added_user_id; // ID of the user who added the record

    private Integer updated_user_id; // ID of the user who last updated the record

    private Integer deleted_user_id; // ID of the user who deleted the record

    // Many-to-One Relationships

    @ManyToOne
    @JoinColumn(name = "status_id", referencedColumnName = "id") // Foreign key to IngredientStatus table
    private IngredientStatus status_id;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id") // Foreign key to Brand table
    private Brand brand_id;

    @ManyToOne
    @JoinColumn(name = "unit_type_id", referencedColumnName = "id") // Foreign key to UnitType table
    private UnitType unit_type_id;

    @ManyToOne
    @JoinColumn(name = "package_type_id", referencedColumnName = "id") // Foreign key to PackageType table
    private PackageType package_type_id;

    @ManyToOne
    @JoinColumn(name = "ingredient_subcategory_id", referencedColumnName = "id") // Foreign key to IngredientSubCategory
    private IngredientSubCategory ingredient_subcategory_id;

    // --------------------------------------------------------------------------------------------
    // Custom Constructor: Used when only a partial set of fields is needed (e.g., for DTOs or views)
    // This constructor does NOT replace the Lombok-generated constructors; it exists *in addition*.
    // It allows instantiating an Ingredient with only a few selected fields, 
    // typically for lightweight transfer or UI display (e.g., table views).
    // This avoids unnecessary database fetches for relationships or large objects.

    public Ingredient(
        Integer id,
        String itemcode,
        String itemname,
        BigDecimal rop,
        BigDecimal roq,
        BigDecimal purchasesprice,
        BigDecimal salesprice,
        IngredientStatus status_id
    ) {
        this.id = id;
        this.itemcode = itemcode;
        this.itemname = itemname;
        this.rop = rop;
        this.roq = roq;
        this.purchasesprice = purchasesprice;
        this.salesprice = salesprice;
        this.status_id = status_id;
    }
    // --------------------------------------------------------------------------------------------
    // Constructor to initialize selected fields of the Ingredient entity
    // This is typically used in JPQL projections to improve performance
    // by fetching only the required fields instead of the entire entity
    public Ingredient(Integer id, String itemcode, String itemname, BigDecimal purchasesprice) {
        this.id = id; // Set the ingredient ID
        this.itemcode = itemcode; // Set the item code (e.g., I00001)
        this.itemname = itemname; // Set the name of the ingredient
        this.purchasesprice = purchasesprice; // Set the purchase price of the ingredient
    }

}
