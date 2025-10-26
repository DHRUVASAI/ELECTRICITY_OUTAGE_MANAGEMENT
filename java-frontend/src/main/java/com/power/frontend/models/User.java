package com.power.frontend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * User Model - Pure Java
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String role; // USER or ADMIN
    private String createdAt;
}
