package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "supplierpayment") // Specifies the table name in the database as "supplierpayment"

@Data // Lombok: generates getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok: generates a constructor with all fields
@NoArgsConstructor // Lombok: generates a no-argument constructor
@JsonInclude(value = Include.NON_NULL) // During JSON serialization, include only non-null fields @JsonInclude(Include.NON_NULL) tells Jackson (the JSON processor) to exclude any fields that are null when serializing the object to JSON.

public class SupplierPayment {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the primary key value
    private Integer id; // Unique identifier for the supplier payment

    @Column(name = "bill_no") // Column named "code"
    @Length(max = 8) // Maximum 8 characters allowed
    @NotNull // Cannot be null
    private String bill_no; // Supplier bill number

    @NotNull
    private BigDecimal total_amount; // The total bill amount

    @NotNull
    private BigDecimal payment_amount; // The amount being paid now

    @NotNull
    private BigDecimal balance_amount; // The remaining amount yet to be paid


    private String check_no; // Check number (used if payment is by check)

    private LocalDate check_date; // Date of the check

    private String transfer_id; // Transaction ID (for online transfers)

    private LocalDate transfer_date_time; // Date of the online transfer

    @NotNull
    private Integer added_user_id; // ID of the user who added this record

    @NotNull
    private LocalDateTime added_datetime; // Timestamp when the payment record was added


    // ---------- RELATIONSHIPS ----------

    @ManyToOne // Many payments can be made using one payment method
    @JoinColumn(name = "supplierpaymentmethod_id", referencedColumnName = "id") 
    // Foreign key referencing SupplierPaymentMethod entity
    private SupplierPaymentMethod supplierpaymentmethod_id;

    @ManyToOne // Many payments can have one common status
    @JoinColumn(name = "supplierpaymentstatus_id", referencedColumnName = "id") 
    // Foreign key referencing SupplierPaymentStatus entity
    private SupplierPaymentStatus supplierpaymentstatus_id;

    @ManyToOne // Each payment is linked to one GRN
    @JoinColumn(name = "grn_id", referencedColumnName = "id") 
    // Foreign key referencing GoodReceiveNote entity
    private GoodReceiveNote grn_id;

    @ManyToOne // Each payment is linked to one supplier
    @JoinColumn(name = "supplier_id", referencedColumnName = "id") 
    // Foreign key referencing Supplier entity
    private Supplier supplier_id;

}
