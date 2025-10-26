package com.power.frontend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Outage Model - Pure Java
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Outage {
    private Long id;
    private String location;
    private String description;
    private String status; // REPORTED, INVESTIGATING, RESOLVED
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private Long areaId;
    private String areaName;
    private Long reportedBy;
    private String reporterName;
    private String reportedAt;
    private String resolvedAt;
    private Integer affectedUsers;
}
