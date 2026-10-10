package com.heatshield.repository;

import com.heatshield.entity.Report;
import com.heatshield.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findAllByOrderByCreatedAtDesc();
    long countByStatus(ReportStatus status);
}
