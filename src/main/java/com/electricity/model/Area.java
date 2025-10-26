package com.electricity.model;

import jakarta.persistence.*;

@Entity
@Table(name = "areas")
public class Area {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer areaId;

    @Column(nullable = false)
    private String areaName;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private Integer totalUsers;

    // Getters and Setters
    public Integer getAreaId() { return areaId; }
    public void setAreaId(Integer areaId) { this.areaId = areaId; }

    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Integer getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Integer totalUsers) { this.totalUsers = totalUsers; }
}
