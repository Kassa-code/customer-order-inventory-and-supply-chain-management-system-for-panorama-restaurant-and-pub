package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity
@Table(name = "order_item") // Maps this entity to the "order_item" table in the database
@Data // Lombok: generates getters, setters, toString, equals, and hashCode
@AllArgsConstructor // Lombok: generates a constructor with all fields
@NoArgsConstructor // Lombok: generates a no-argument constructor
@JsonInclude(value = Include.NON_NULL) // Exclude null fields during JSON serialization
public class OrderItem {

    @Id // Declares primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates the primary key (auto-increment)
    private Integer id;

    @NotNull
    private String name; // Name of the item

    @NotNull
    private BigDecimal price; // Price per unit/item

    @NotNull
    private BigDecimal line_price; // Price per unit/item

    @NotNull
    private String item_type; // Item type (e.g., menu, submenu, liquor)

    @NotNull
    private BigDecimal qty; // Quantity ordered
    
    private BigDecimal completed_qty; // Quantity ordered

    private Boolean is_confirm; // Flag to indicate if item is confirmed

    private LocalDateTime confrim_datetime; // Timestamp when the item was confirmed

    private Integer confirm_user; // ID of user who confirmed the item

    private Boolean is_complete; // Flag to indicate if item is completed/prepared

    private Integer complete_user; // ID of user who completed/prepared the item

    private LocalDateTime complete_datetime; // Timestamp when the item was completed

    private byte[] photo;

    @ManyToOne
    @JoinColumn(name = "order_process_id", referencedColumnName = "id") // Foreign key to Order table
    @JsonIgnore
    private OrderProcess order_process_id; // Associated order for this item

}
