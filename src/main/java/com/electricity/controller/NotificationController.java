package com.electricity.controller;

import com.electricity.model.Notification;
import com.electricity.model.Outage;
import com.electricity.service.NotificationService;
import com.electricity.service.OutageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OutageService outageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestBody Map<String, Object> request) {
        try {
            Integer outageId = (Integer) request.get("outageId");
            String message = (String) request.get("message");

            Outage outage = outageService.getOutageById(outageId);
            if (outage == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Outage not found"));
            }

            Notification notification = new Notification();
            notification.setOutage(outage);
            notification.setMessage(message);

            Notification savedNotification = notificationService.sendNotification(notification);
            return ResponseEntity.ok(Map.of("message", "Notification sent", "notificationId", savedNotification.getNotificationId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/outage/{outageId}")
    public ResponseEntity<?> getNotificationsByOutage(@PathVariable Integer outageId) {
        List<Notification> notifications = notificationService.getNotificationsByOutage(outageId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }
}
