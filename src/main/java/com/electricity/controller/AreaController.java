package com.electricity.controller;

import com.electricity.model.Area;
import com.electricity.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*")
public class AreaController {
    @Autowired
    private AreaService areaService;

    @PostMapping("/create")
    public ResponseEntity<?> createArea(@RequestBody Area area) {
        Area createdArea = areaService.createArea(area);
        return ResponseEntity.ok(Map.of("message", "Area created successfully", "areaId", createdArea.getAreaId()));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAreas() {
        List<Area> areas = areaService.getAllAreas();
        return ResponseEntity.ok(areas);
    }

    @GetMapping("/{areaId}")
    public ResponseEntity<?> getAreaById(@PathVariable Integer areaId) {
        Area area = areaService.getAreaById(areaId);
        if (area != null) {
            return ResponseEntity.ok(area);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{areaId}")
    public ResponseEntity<?> updateArea(@PathVariable Integer areaId, @RequestBody Area area) {
        area.setAreaId(areaId);
        Area updatedArea = areaService.updateArea(area);
        return ResponseEntity.ok(Map.of("message", "Area updated successfully", "area", updatedArea));
    }

    @DeleteMapping("/{areaId}")
    public ResponseEntity<?> deleteArea(@PathVariable Integer areaId) {
        areaService.deleteArea(areaId);
        return ResponseEntity.ok(Map.of("message", "Area deleted successfully"));
    }
}
