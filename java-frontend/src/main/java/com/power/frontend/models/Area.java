package com.power.frontend.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Service Area Model - Pure Java
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Area {
    private Long id;
    private String name;
    private String description;
    private String coverageCities;
    private Integer totalUsers;
    private Integer activeOutages;
}
