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

@Entity // Marks this class as a JPA entity, meaning it maps to a table in the database
@Table(name = "grn") // Maps this entity to the "grn" table

@Data // Lombok: auto-generates getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok: generates a constructor with all fields
@NoArgsConstructor // Lombok: generates a no-args constructor
public class GoodReceiveNote {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment strategy for ID
    private Integer id;

    @Column(name = "code", unique = true) // Column named "code", must be unique
    @Length(max = 8) // Maximum 8 characters allowed
    @NotNull // Cannot be null
    private String code;

    @NotNull // Cannot be null
    private LocalDate date_of_receipt; // Date when goods were received

    @Column(name = "supplier_bill_no", unique = true) // Unique supplier bill number
    @NotNull // Cannot be null
    private String supplier_bill_no;

    private BigDecimal total_amount; // Gross total before any discount

    @NotNull // Cannot be null
    private BigDecimal discount_amount; // Total discount applied

    private BigDecimal paid_amount; // Total paid amount applied

    @NotNull // Cannot be null
    private BigDecimal net_amount; // Final net amount = total - discount

    private String note; // Optional notes

     // Who added this record
@NotNull // Cannot be null
    private LocalDateTime added_datetime; // When this GRN was created


    @NotNull // Cannot be null
    private Integer added_user_id;

    @ManyToOne // Many GRNs can have the same status
    @JoinColumn(name = "grn_status_id", referencedColumnName = "id") // FK to grn_status table
    private GoodReceiveNoteStatus grn_status_id; // Status of this GRN (e.g. Pending, Completed)

    // Explanation:
    // - This sets up a foreign key column named "grn_status_id" in the "grn" table.
    // - The value refers to "id" in the PurchaseOrderStatus table.
    // - Many GRNs can share the same status.

    @ManyToOne // Many GRNs can be linked to the same Supplier Purchase Order
    @JoinColumn(name = "supplierpurchaseorder_id", referencedColumnName = "id") // FK to PO
    private PurchaseOrder supplierpurchaseorder_id; // Purchase Order this GRN is linked to

    // Explanation:
    // - Foreign key "supplierpurchaseorder_id" refers to a Supplier.
    // - This represents the PO against which the goods were received.
    // - Many GRNs may belong to one PO.

    @ManyToOne // Many GRNs can come from the same Supplier
    @JoinColumn(name = "supplier_id", referencedColumnName = "id") // FK to Supplier
    private Supplier supplier_id; // Supplier who delivered the goods

    // Explanation:
    // - This is the actual supplier who delivered the goods.
    // - "supplier_id" is a foreign key pointing to the Supplier entity.
    // - One supplier can have many GRNs.

    @OneToMany(mappedBy = "grn_id", cascade = CascadeType.ALL, orphanRemoval = true) // GRN has many items
    private List<GrnHasIngredients> grnHasItemList; // List of ingredient items received

    // Explanation:
    // - One GRN can have multiple GrnHasIngredients (line items).
    // - "mappedBy = grn_id" links this to the GrnHasIngredients entity.
    // - CascadeType.ALL means if a GRN is saved/deleted, its items are also
    // saved/deleted.
    // - orphanRemoval = true means if an item is removed from the list, it will
    // also be deleted from the DB.
}
