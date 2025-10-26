package com.electricity.service;

import com.electricity.model.Area;
import com.electricity.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AreaService {
    @Autowired
    private AreaRepository areaRepository;

    public Area createArea(Area area) {
        return areaRepository.save(area);
    }

    public List<Area> getAllAreas() {
        return areaRepository.findAll();
    }

    public Area getAreaById(Integer areaId) {
        return areaRepository.findById(areaId).orElse(null);
    }

    public Area updateArea(Area area) {
        return areaRepository.save(area);
    }

    public void deleteArea(Integer areaId) {
        areaRepository.deleteById(areaId);
    }
}
