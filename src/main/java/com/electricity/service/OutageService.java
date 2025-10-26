package com.electricity.service;

import com.electricity.model.Outage;
import com.electricity.model.Area;
import com.electricity.repository.OutageRepository;
import com.electricity.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OutageService {
    @Autowired
    private OutageRepository outageRepository;

    @Autowired
    private AreaRepository areaRepository;

    public Outage reportOutage(Outage outage) {
        return outageRepository.save(outage);
    }

    public List<Outage> getOutagesByArea(Integer areaId) {
        return outageRepository.findByAreaId(areaId);
    }

    public List<Outage> getOutagesByStatus(String status) {
        return outageRepository.findByStatus(status);
    }

    public List<Outage> getOutagesByUser(Integer userId) {
        return outageRepository.findByUserId(userId);
    }

    public Outage updateOutageStatus(Integer outageId, String status) {
        Outage outage = outageRepository.findById(outageId).orElse(null);
        if (outage != null) {
            outage.setStatus(status);
            if ("RESOLVED".equals(status)) {
                outage.setRestorationTime(LocalDateTime.now());
            }
            return outageRepository.save(outage);
        }
        return null;
    }

    public List<Outage> getAllOutages() {
        return outageRepository.findAll();
    }

    public Outage getOutageById(Integer outageId) {
        return outageRepository.findById(outageId).orElse(null);
    }

    public void deleteOutage(Integer outageId) {
        outageRepository.deleteById(outageId);
    }
}
