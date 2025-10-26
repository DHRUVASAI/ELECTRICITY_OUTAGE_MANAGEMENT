package com.electricity.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notificationId;

    @ManyToOne
    @JoinColumn(name = "outage_id", nullable = false)
    private Outage outage;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime sentTime;

    @PrePersist
    protected void onCreate() {
        sentTime = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getNotificationId() { return notificationId; }
    public void setNotificationId(Integer notificationId) { this.notificationId = notificationId; }

    public Outage getOutage() { return outage; }
    public void setOutage(Outage outage) { this.outage = outage; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getSentTime() { return sentTime; }
}
