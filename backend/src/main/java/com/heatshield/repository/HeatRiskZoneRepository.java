package com.heatshield.repository;

import com.heatshield.entity.HeatRiskZone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HeatRiskZoneRepository extends JpaRepository<HeatRiskZone, UUID> {
    List<HeatRiskZone> findAllByOrderByNameAsc();
}
