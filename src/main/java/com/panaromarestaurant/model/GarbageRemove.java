package com.panaromarestaurant.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a JPA entity, mapping it to a database table
@Table(name = "garbage_remove") // Specifies the database table name for this entity

@Data // Automatically generates getters, setters, toString, equals, and hashCode methods
@AllArgsConstructor // Generates a constructor with all fields as arguments
@NoArgsConstructor // Generates a no-argument constructor

@JsonInclude(value = Include.NON_NULL) // Only include non-null fields when converting to JSON
public class GarbageRemove {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Primary key will auto-increment
    private Integer id;

    @NotNull // Field must not be null (validation constraint)
    private BigDecimal removed_qty;

    @NotNull // Field must not be null (validation constraint)
    private LocalDate removed_date;

    @NotNull // Field must not be null (validation constraint)
    private String removed_reason;

    @ManyToOne // Many garbage removal records can reference one Inventory
    @JoinColumn(name = "inventory_id", referencedColumnName = "id") // Foreign key reference to Inventory table
    private Inventory inventory_id;
}
