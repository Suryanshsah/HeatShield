package com.heatshield.repository;

import com.heatshield.entity.HeatRiskSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HeatRiskSnapshotRepository extends JpaRepository<HeatRiskSnapshot, UUID> {
    Optional<HeatRiskSnapshot> findFirstByOrderByObservedAtDesc();
}
