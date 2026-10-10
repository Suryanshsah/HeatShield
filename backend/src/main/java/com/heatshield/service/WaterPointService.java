package com.heatshield.service;

import com.heatshield.dto.CreateWaterPointRequest;
import com.heatshield.dto.WaterPointResponse;
import com.heatshield.entity.WaterPoint;
import com.heatshield.exception.ResourceNotFoundException;
import com.heatshield.repository.WaterPointRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WaterPointService {

    private final WaterPointRepository waterPointRepository;

    public WaterPointService(WaterPointRepository waterPointRepository) {
        this.waterPointRepository = waterPointRepository;
    }

    public List<WaterPointResponse> findAll() {
        return waterPointRepository.findAllByOrderByNameAsc()
                .stream().map(WaterPointResponse::from).toList();
    }

    public WaterPointResponse create(CreateWaterPointRequest request) {
        WaterPoint point = new WaterPoint();
        point.setName(request.name().trim());
        point.setLatitude(request.lat());
        point.setLongitude(request.lng());
        point.setType(request.type().trim());
        point.setStatus(request.status());
        point.setAddress(request.address());
        return WaterPointResponse.from(waterPointRepository.save(point));
    }

    public WaterPointResponse update(UUID id, CreateWaterPointRequest request) {
        WaterPoint point = waterPointRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Water point not found: " + id));
        point.setName(request.name().trim());
        point.setLatitude(request.lat());
        point.setLongitude(request.lng());
        point.setType(request.type().trim());
        point.setStatus(request.status());
        point.setAddress(request.address());
        return WaterPointResponse.from(waterPointRepository.save(point));
    }
}
