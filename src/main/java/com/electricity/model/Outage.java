package com.electricity.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "outages")
public class Outage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer outageId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime reportedTime;

    @Column
    private LocalDateTime restorationTime;

    @Column(nullable = false)
    private String status; // "REPORTED", "IN_PROGRESS", "RESOLVED"

    @PrePersist
    protected void onCreate() {
        reportedTime = LocalDateTime.now();
        if (status == null) {
            status = "REPORTED";
        }
    }

    // Getters and Setters
    public Integer getOutageId() { return outageId; }
    public void setOutageId(Integer outageId) { this.outageId = outageId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Area getArea() { return area; }
    public void setArea(Area area) { this.area = area; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getReportedTime() { return reportedTime; }

    public LocalDateTime getRestorationTime() { return restorationTime; }
    public void setRestorationTime(LocalDateTime restorationTime) { this.restorationTime = restorationTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
