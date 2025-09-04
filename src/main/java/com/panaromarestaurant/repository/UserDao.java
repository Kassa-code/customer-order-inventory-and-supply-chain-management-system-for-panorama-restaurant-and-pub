package com.panaromarestaurant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.panaromarestaurant.model.User;

// Repository interface for User entity.
// Extends JpaRepository to provide CRUD operations and custom queries.

public interface UserDao extends JpaRepository<User, Integer> {

    // Custom query to find a User by username.
    // Uses JPQL (Java Persistence Query Language) to retrieve a user based on
    // username.
    @Query(value = "select u from User as u where u.username = ?1")
    User getByUsername(String username);

    // Custom query to retrieve all users except:
    // 1. The user with the given username (passed as a parameter), and
    // 2. The user with username 'Admin'
    // Results are sorted in descending order by user ID
    @Query("select u from User u where u.username <> ?1 and u.username <> 'Admin' order by u.id desc")
    List<User> findAllExceptUsername(String username);

    // JpaRepository already provides common CRUD methods such as:
    // save(), findById(), findAll(), delete(), etc.
    // Additional custom queries can be added here if needed.
}
