package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, creating a corresponding table in the database
@Table(name = "supplierpurchaseorder") // Maps this entity to the "supplierpurchaseorder" table
@Data // Generates getters, setters, toString, equals, and hashCode methods using Lombok
@AllArgsConstructor // Generates a constructor with all fields as arguments
@NoArgsConstructor // Generates a default constructor with no arguments
public class PurchaseOrder {
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for the primary key
    private Integer id;

    @Column(name = "order_code", unique = true) // Maps to the "order_code" column and ensures uniqueness
    @Length(max = 8) // Sets a maximum length of 8 characters
    @NotNull // Ensures this field cannot be null
    private String order_code;

    @NotNull // Ensures this field cannot be null
    private LocalDate delivery_date; // Stores the delivery date of the purchase order

    @NotNull // Ensures this field cannot be null
    private BigDecimal total_amount; // Stores the total amount of the purchase order

    private String note; // Stores additional notes related to the purchase order

    @NotNull // Ensures this field cannot be null
    private LocalDateTime added_datetime; // Stores the timestamp of when the purchase order was added

    private LocalDateTime updated_datetime; // Stores the timestamp of when the purchase order was last updated

    private LocalDateTime deleted_datetime; // Stores the timestamp of when the purchase order was deleted (if applicable)

    @NotNull // Ensures this field cannot be null
    private Integer added_user_id; // Stores the ID of the user who added the purchase order

    private Integer updated_user_id; // Stores the ID of the user who last updated the purchase order

    private Integer deleted_user_id; // Stores the ID of the user who deleted the purchase order (if applicable)

    @ManyToOne // Establishes a many-to-one relationship with the PurchaseOrderStatus entity
    @JoinColumn(name = "supplierpurchaseorder_status_id", referencedColumnName = "id") // Foreign key linking to PurchaseOrderStatus
    private PurchaseOrderStatus supplierpurchaseorder_status_id; // Stores the current status of the purchase order

    @ManyToOne // Establishes a many-to-one relationship with the Supplier entity
    @JoinColumn(name = "supplier_id", referencedColumnName = "id") // Foreign key linking to Supplier
    private Supplier supplier_id; // Stores the supplier associated with the purchase order

    @OneToMany(mappedBy = "supplierpurchaseorder_id" ,cascade = CascadeType.ALL, orphanRemoval=true) // Defines one-to-many relationship to PurchaseOrderHasIngredients, mapped by 'supplierpurchaseorder_id' field in that class
    private List<PurchaseOrderHasIngredients> purchaseOrderHasItemList; // List of ingredient items associated with this purchase order
}
