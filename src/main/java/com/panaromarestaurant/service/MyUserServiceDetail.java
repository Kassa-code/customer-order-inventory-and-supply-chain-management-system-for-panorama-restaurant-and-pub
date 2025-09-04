package com.panaromarestaurant.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.panaromarestaurant.model.Role;
import com.panaromarestaurant.model.User;
import com.panaromarestaurant.repository.UserDao;

import jakarta.transaction.Transactional;

// Marks this class as a Spring service component
@Service
public class MyUserServiceDetail implements UserDetailsService {

    // Injects the UserDao dependency
    @Autowired
    private UserDao userDao;

    // Loads the user-specific data for authentication
    @Override
    // Marks the method or class as transactional — all operations within will be
    // executed in a single transaction.
    // If any exception occurs, all changes will be rolled back automatically.
    @Transactional

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Prints the username for debugging purposes
        System.out.println(username);

        // Retrieves the user from the database using the provided username
        User extUser = userDao.getByUsername(username);

        // Stores the authorities (roles) granted to the user
        Set<GrantedAuthority> authority = new HashSet<GrantedAuthority>();

        // Converts each role of the user into a GrantedAuthority
        for (Role userRole : extUser.getRoles()) {
            authority.add(new SimpleGrantedAuthority(userRole.getName()));
        }

        // Returns a Spring Security User object containing user credentials and
        // authorities
        return new org.springframework.security.core.userdetails.User(
                extUser.getUsername(),
                extUser.getPassword(),
                extUser.getStatus(), // Whether the user is enabled
                true, // Account non-expired
                true, // Credentials non-expired
                true, // Account non-locked
                authority // Granted authorities
        );
    }
}
