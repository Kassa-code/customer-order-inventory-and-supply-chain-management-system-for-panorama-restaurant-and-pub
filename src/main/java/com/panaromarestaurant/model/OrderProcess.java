package com.panaromarestaurant.model;

import java.util.List;
import org.hibernate.validator.constraints.Length;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity
@Table(name = "order_process") // Specifies the table name as "order" in the database
@Data // Lombok: Generates getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok: Generates a constructor with all fields
@NoArgsConstructor // Lombok: Generates a no-argument constructor
@JsonInclude(value = Include.NON_NULL) // Ignores null fields during JSON serialization
public class OrderProcess {

    @Id // Declares primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the primary key value
    private Integer id;

    @Column(name = "order_code", unique = true) // Maps to column "order_code", must be unique
    @Length(max = 8) // Validation: limits string length to 8
    @NotNull // Validation: must not be null
    private String order_code;

    @NotNull
    private LocalDate date; // Date when the order was placed

    
    private String delivery_address; // Address where delivery is to be made

    
    private String city; // City of the delivery address

    @NotNull
    private BigDecimal total_amount; // Total amount of the order (before charges)


    @NotNull
    private BigDecimal service_charge; // Service charge added to the bill

    @NotNull
    private BigDecimal delivery_charge; // Delivery fee for the order

    @NotNull
    private BigDecimal net_charge; // Final total after all calculations

    private String note; // Optional note field

    @NotNull
    private LocalDateTime added_datetime; // Timestamp when the order was added

    private LocalDateTime updated_datetime; // Timestamp when the order was last updated

    private LocalDateTime deleted_datetime; // Timestamp for soft delete (if deleted)

    @NotNull
    private Integer added_user_id; // ID of user who created the order

    private Integer updated_user_id; // ID of user who last updated the order

    private Integer deleted_user_id; // ID of user who soft deleted the order

    // ====================== Entity Relationships ======================

    @ManyToOne
    @JoinColumn(name = "order_type_id", referencedColumnName = "id") // FK to order_type table
    private OrderType order_type_id; // Type of order (e.g., dine-in, takeaway)

    @ManyToOne
    @JoinColumn(name = "order_status_id", referencedColumnName = "id") // FK to order_status table
    private OrderStatus order_status_id; // Current status of the order

    @ManyToOne
    @JoinColumn(name = "kitchen_status_id", referencedColumnName = "id") // FK to kitchen_status table
    private KitchenStatus kitchen_status_id; // Kitchen preparation status

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id") // FK to customer table
    private Customer customer_id; // Associated customer (nullable for walk-ins)


    @ManyToOne
    @JoinColumn(name = "dinein_table_id", referencedColumnName = "id") // FK to dinein_table table
    private DineInTable dinein_table_id; // Table number, if dine-in order

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id") // FK to employee table
    private Employee employee_id; // Linked payment record

    // ====================== One-to-Many: Order Line Items ======================

    @OneToMany(mappedBy = "order_process_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderHasitemList; // List of submenu items for this order

    @OneToMany(mappedBy = "order_process_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderHasIngredients> orderHasIngredientList; // List of ingredients used in the order

}
