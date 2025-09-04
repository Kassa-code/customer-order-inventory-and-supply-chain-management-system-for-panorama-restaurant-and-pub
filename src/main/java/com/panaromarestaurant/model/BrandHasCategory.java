package com.panaromarestaurant.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity  // Marks this class as a JPA entity, so Hibernate will map it to a database table
@Table(name = "brand_has_ingredient_category")  // Specifies the exact table name in the database

@Data  // Lombok annotation to automatically generate getters, setters, toString, equals, and hashCode
@AllArgsConstructor  // Lombok annotation to generate a constructor with parameters for all fields
@NoArgsConstructor   // Lombok annotation to generate a default no-argument constructor
public class BrandHasCategory {

    @Id  // Marks this field as part of the primary key
    @ManyToOne  // Indicates a many-to-one relationship: many BrandHasCategory entries can reference one Brand
    @JoinColumn(name = "brand_id",referencedColumnName = "id")
        // The foreign key column in this table
        // The primary key column in the Brand table that this FK refers to
        private Brand brand_id;  // The Brand entity referenced by this relationship


    @Id  // Also part of the composite primary key (brand_id + ingredient_category_id)
    @ManyToOne  // Indicates a many-to-one relationship: many BrandHasCategory entries can reference one IngredientCategory
    @JoinColumn(name = "ingredient_category_id",referencedColumnName = "id")  
        // The foreign key column in this table
        // The primary key column in the IngredientCategory table
    private IngredientCategory ingredient_category_id;  // The IngredientCategory entity referenced by this relationship
}
