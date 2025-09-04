package com.panaromarestaurant.model; 

import jakarta.persistence.Entity; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Id; 
import jakarta.persistence.Table; 
import lombok.AllArgsConstructor; 
import lombok.Data; 
import lombok.NoArgsConstructor; 

@Entity // Marks this class as a JPA entity, making it a table in the database
@Table(name = "designation") // Maps this entity to the "designation" table in the database

@Data // Lombok annotation to generate getter, setter, toString, equals, and hashCode methods
@AllArgsConstructor // Lombok annotation to generate a constructor with all fields as arguments
@NoArgsConstructor // Lombok annotation to generate a default constructor with no arguments

public class Designation {
    
    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Enables auto-increment for the primary key
    private Integer id; // Represents the primary key for the designation table

    // @Column(name = "designation") // Column mapping (Optional, if the column name differs from the field name)
    private String name; // Represents the designation name in the table

    private Integer roleid; // Represents the role ID associated with the designation
    private Boolean useraccount; // Indicates whether the designation is linked to a user account

}
