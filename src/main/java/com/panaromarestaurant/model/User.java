package com.panaromarestaurant.model;

import java.time.LocalDateTime;
import java.util.Set;

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

@Entity // Marks this class as a JPA entity
@Table(name = "user") // Maps this entity to the "user" table in the database
@Data // Lombok annotation to automatically generate getters, setters, and other
      // methods
@AllArgsConstructor // Lombok annotation to generate a constructor with all arguments
@NoArgsConstructor // Lombok annotation to generate a no-arguments constructor
public class User {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate the ID with a database identity strategy
    private Integer id; // Field to store the user's ID

    @NotNull // Ensures that the username cannot be null
    @Column(name = "username", unique = true) // Maps the username field to the database column with unique constraint
    private String username; // Field to store the user's username

    @NotNull // Ensures that the password cannot be null
    private String password; // Field to store the user's password

    @NotNull // Ensures that the email cannot be null
    @Column(name = "email", unique = true) // Maps the email field to the database column with unique constraint
    private String email; // Field to store the user's email

    @NotNull // Ensures that the status cannot be null
    private Boolean status; // Field to store the user's status (active or inactive)

    @NotNull // Ensures that the added_datetime cannot be null
    private LocalDateTime added_datetime; // Field to store when the user was added

    private LocalDateTime updated_datetime; // Field to store the last updated timestamp of the user

    private LocalDateTime deleted_datetime; // Field to store when the user was deleted

    private String note; // Field to store any additional notes about the user

    private byte[] userphoto; // Field to store the user's profile picture in byte array format

    @ManyToOne(optional = true) // Defines a many-to-one relationship with Employee
    @JoinColumn(name = "employee_id", referencedColumnName = "id") // Specifies the foreign key column for employee_id
    private Employee employee_id; // Field to store the associated Employee object

    @ManyToMany(cascade = CascadeType.MERGE) // Defines a many-to-many relationship with Role, using MERGE cascade
    @JoinTable(name = "user_has_role", // Junction table name for the many-to-many relationship
            joinColumns = @JoinColumn(name = "user_id"), // Specifies the foreign key column for user_id
            inverseJoinColumns = @JoinColumn(name = "role_id") // Specifies the foreign key column for role_id
    )
    private Set<Role> roles; // Field to store the set of roles associated with the user
}
