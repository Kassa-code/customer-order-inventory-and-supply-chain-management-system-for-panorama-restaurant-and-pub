// Package declaration specifying this class belongs to the 'model' package of the Panaroma Restaurant project.
package com.panaromarestaurant.model;

// Lombok annotation to automatically generate getters, setters, toString, equals, and hashCode methods.
import lombok.AllArgsConstructor;

// Lombok annotation to generate a constructor with all arguments (all fields).
import lombok.Data;

// Lombok annotation to generate a no-argument constructor.
import lombok.NoArgsConstructor;

// Lombok's @Data combines @Getter, @Setter, @ToString, @EqualsAndHashCode, and @RequiredArgsConstructor.
@Data

// Lombok annotation to generate a constructor with parameters for all fields in
// this class.
@AllArgsConstructor

// Lombok annotation to generate a default constructor without any parameters.
@NoArgsConstructor

// This class is a Plain Old Java Object (POJO) that holds data for changing
// user details.
public class ChangeUser {

    // The new username to be updated to.
    private String username;

    // The old (current) username of the user (used for lookup).
    private String oldusername;

    // The new password the user wants to set.
    private String newpassword;

    // The current (old) password for validation.
    private String oldpassword;

    // The new email address to be updated.
    private String email;

    // The user's photo stored as a byte array (to handle image data).
    private byte[] userphoto;
}
