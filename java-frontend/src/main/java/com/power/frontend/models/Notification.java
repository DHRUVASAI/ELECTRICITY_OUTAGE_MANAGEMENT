package com.power.frontend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Notification Model - Pure Java
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long id;
    private String title;
    private String message;
    private String type; // INFO, WARNING, ALERT
    private Boolean isRead;
    private String createdAt;
}
