package com.electricity.repository;

import com.electricity.model.Outage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OutageRepository extends JpaRepository<Outage, Integer> {
    List<Outage> findByAreaId(Integer areaId);
    List<Outage> findByStatus(String status);
    List<Outage> findByUserId(Integer userId);
}
