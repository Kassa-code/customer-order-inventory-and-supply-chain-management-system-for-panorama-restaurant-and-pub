package com.panaromarestaurant.model;

import java.time.LocalDateTime;
import java.util.Set;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, creating a corresponding table in the
        // database
@Table(name = "supplier") // Maps this entity to the "supplier" table

@Data // Generates getters, setters, toString, equals, and hashCode methods using
      // Lombok
@AllArgsConstructor // Generates a constructor with all fields as arguments
@NoArgsConstructor // Generates a default constructor with no arguments
public class Supplier {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for the primary key
    private Integer id;

    @Column(name = "sup_no", unique = true) // Maps to the "sup_no" column and enforces uniqueness
    @Length(max = 8) // Sets a maximum length of 8 characters
    @NotNull // Ensures this field is not null
    private String sup_no;

    @NotNull // Ensures this field is not null
    private String suppliername; // Name of the supplier

    @Length(max = 10) // Limits to 10 characters
    @NotNull // Field must not be null
    private String mobileno; // Supplier's mobile number

    @Length(max = 10) // Limits to 10 characters
    private String landno; // Supplier's landline number (optional)

    @Column(name = "email", unique = true) // Maps to "email" column and enforces uniqueness
    @NotNull // Field must not be null
    private String email; // Supplier's email address

    @Length(max = 12) // Max 12 characters
    private String brn; // Business registration number

    @NotNull
    private String bank_name; // Name of the bank

    @NotNull
    private String branch_name; // Name of the bank branch

    @NotNull
    private String holder_name; // Name of the account holder

    @Column(name = "account_no", unique = true) // Maps to "account_no" column and enforces uniqueness
    @Length(min = 5, max = 12) // Limits length between 5 and 12 characters
    @NotNull // Field must not be null
    private String account_no; // Supplier's bank account number

    @NotNull
    private String address; // Supplier's address

    private String note; // Optional notes about the supplier

    @NotNull
    private LocalDateTime added_datetime; // Timestamp when the record was added

    private LocalDateTime updated_datetime; // Timestamp when the record was last updated

    private LocalDateTime deleted_datetime; // Timestamp when the record was marked as deleted

    @NotNull
    private Integer added_user_id; // ID of the user who added the record

    private Integer updated_user_id; // ID of the user who last updated the record

    private Integer deleted_user_id; // ID of the user who deleted the record

    @ManyToOne // Specifies a many-to-one relationship
    @JoinColumn(name = "supplier_status_id", referencedColumnName = "id") // Foreign key to the supplier status table
    private SupplierStatus supplier_status_id; // Status of the supplier 

    @ManyToMany(cascade = CascadeType.MERGE) // Defines a many-to-many relationship with Ingredient, using MERGE cascade
    @JoinTable(name = "supplier_has_ingredients", // Table name for the many-to-many relationship
            joinColumns = @JoinColumn(name = "supplier_id"), // Foreign key column for supplier
            inverseJoinColumns = @JoinColumn(name = "ingredients_id") // Foreign key column for ingredient
    )
    private Set<Ingredient> supplyIngredients; // Set of ingredients this supplier provides
}
