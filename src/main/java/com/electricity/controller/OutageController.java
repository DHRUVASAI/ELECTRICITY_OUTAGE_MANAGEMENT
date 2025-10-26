package com.electricity.controller;

import com.electricity.model.Outage;
import com.electricity.model.User;
import com.electricity.model.Area;
import com.electricity.service.OutageService;
import com.electricity.service.UserService;
import com.electricity.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/outages")
@CrossOrigin(origins = "*")
public class OutageController {
    @Autowired
    private OutageService outageService;

    @Autowired
    private UserService userService;

    @Autowired
    private AreaService areaService;

    @PostMapping("/report")
    public ResponseEntity<?> reportOutage(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = (Integer) request.get("userId");
            Integer areaId = (Integer) request.get("areaId");
            String location = (String) request.get("location");
            String description = (String) request.get("description");

            User user = userService.getUserById(userId);
            Area area = areaService.getAreaById(areaId);

            if (user == null || area == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user or area"));
            }

            Outage outage = new Outage();
            outage.setUser(user);
            outage.setArea(area);
            outage.setLocation(location);
            outage.setDescription(description);

            Outage savedOutage = outageService.reportOutage(outage);
            return ResponseEntity.ok(Map.of("message", "Outage reported successfully", "outageId", savedOutage.getOutageId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/area/{areaId}")
    public ResponseEntity<?> getOutagesByArea(@PathVariable Integer areaId) {
        List<Outage> outages = outageService.getOutagesByArea(areaId);
        return ResponseEntity.ok(outages);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOutagesByStatus(@PathVariable String status) {
        List<Outage> outages = outageService.getOutagesByStatus(status);
        return ResponseEntity.ok(outages);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOutagesByUser(@PathVariable Integer userId) {
        List<Outage> outages = outageService.getOutagesByUser(userId);
        return ResponseEntity.ok(outages);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOutages() {
        List<Outage> outages = outageService.getAllOutages();
        return ResponseEntity.ok(outages);
    }

    @GetMapping("/{outageId}")
    public ResponseEntity<?> getOutageById(@PathVariable Integer outageId) {
        Outage outage = outageService.getOutageById(outageId);
        if (outage != null) {
            return ResponseEntity.ok(outage);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{outageId}/status")
    public ResponseEntity<?> updateOutageStatus(@PathVariable Integer outageId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Outage updatedOutage = outageService.updateOutageStatus(outageId, status);
        if (updatedOutage != null) {
            return ResponseEntity.ok(Map.of("message", "Outage status updated", "outage", updatedOutage));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{outageId}")
    public ResponseEntity<?> deleteOutage(@PathVariable Integer outageId) {
        outageService.deleteOutage(outageId);
        return ResponseEntity.ok(Map.of("message", "Outage deleted successfully"));
    }
}
