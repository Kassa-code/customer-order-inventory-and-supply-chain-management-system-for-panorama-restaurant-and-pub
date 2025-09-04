package com.panaromarestaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.panaromarestaurant.model.SubMenuStatus;

// This interface serves as the Data Access Layer (DAO) for the SubMenuStatus entity.
// By extending JpaRepository, it inherits several built-in methods for performing CRUD operations 
// (Create, Read, Update, Delete) without the need to define them manually.
public interface SubMenuStatusDao extends JpaRepository<SubMenuStatus, Integer> {

    // JpaRepository<SubMenuStatus, Integer>:
    // - SubMenuStatus: the entity class this repository handles
    // - Integer: the type of the primary key (id field) of the entity

    // Example methods inherited from JpaRepository:
    // - findAll(): List<SubMenuStatus>
    // - findById(Integer id): Optional<SubMenuStatus>
    // - save(SubMenuStatus entity): SubMenuStatus
    // - deleteById(Integer id): void

    // Custom query methods can be added here using Spring Data JPA method naming
    // conventions or @Query annotations
}
