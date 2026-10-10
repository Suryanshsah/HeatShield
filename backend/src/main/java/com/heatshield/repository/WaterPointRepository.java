package com.heatshield.repository;

import com.heatshield.entity.WaterPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WaterPointRepository extends JpaRepository<WaterPoint, UUID> {
    List<WaterPoint> findAllByOrderByNameAsc();
}
