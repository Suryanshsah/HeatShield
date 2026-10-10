package com.heatshield.controller;

import com.heatshield.dto.CreateWaterPointRequest;
import com.heatshield.dto.WaterPointResponse;
import com.heatshield.service.WaterPointService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/water-points")
public class WaterPointController {

    private final WaterPointService waterPointService;

    public WaterPointController(WaterPointService waterPointService) {
        this.waterPointService = waterPointService;
    }

    @GetMapping
    public List<WaterPointResponse> getWaterPoints() {
        return waterPointService.findAll();
    }

    @PostMapping
    public ResponseEntity<WaterPointResponse> create(@Valid @RequestBody CreateWaterPointRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(waterPointService.create(request));
    }

    @PutMapping("/{id}")
    public WaterPointResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody CreateWaterPointRequest request) {
        return waterPointService.update(id, request);
    }
}
