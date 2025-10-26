package com.electricity.controller;

import com.electricity.model.User;
import com.electricity.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userService.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            if (userService.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", registeredUser.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        var user = userService.findByUsername(username);
        if (user.isPresent() && userService.validatePassword(password, user.get().getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", user.get().getUserId());
            response.put("username", user.get().getUsername());
            response.put("userType", user.get().getUserType());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }
}
