package com.heatshield.service;

import com.heatshield.dto.HeatRiskResponse;
import com.heatshield.dto.HeatRiskZoneResponse;
import com.heatshield.exception.ResourceNotFoundException;
import com.heatshield.repository.HeatRiskSnapshotRepository;
import com.heatshield.repository.HeatRiskZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HeatRiskService {

    private final HeatRiskSnapshotRepository snapshotRepository;
    private final HeatRiskZoneRepository zoneRepository;

    public HeatRiskService(HeatRiskSnapshotRepository snapshotRepository,
                           HeatRiskZoneRepository zoneRepository) {
        this.snapshotRepository = snapshotRepository;
        this.zoneRepository = zoneRepository;
    }

    public HeatRiskResponse current() {
        return snapshotRepository.findFirstByOrderByObservedAtDesc()
                .map(HeatRiskResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("No heat-risk snapshot is available"));
    }

    public List<HeatRiskZoneResponse> zones() {
        return zoneRepository.findAllByOrderByNameAsc()
                .stream().map(HeatRiskZoneResponse::from).toList();
    }
}
