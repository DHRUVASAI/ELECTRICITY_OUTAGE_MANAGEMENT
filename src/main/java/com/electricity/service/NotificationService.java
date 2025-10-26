package com.electricity.service;

import com.electricity.model.Notification;
import com.electricity.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByOutage(Integer outageId) {
        return notificationRepository.findByOutageId(outageId);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
