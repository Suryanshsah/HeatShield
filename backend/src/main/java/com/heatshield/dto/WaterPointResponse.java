package com.heatshield.dto;

import com.heatshield.entity.WaterPoint;
import com.heatshield.entity.WaterPointStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record WaterPointResponse(
        UUID id,
        String name,
        BigDecimal lat,
        BigDecimal lng,
        WaterPointStatus status,
        String type,
        String address,
        Instant updatedAt
) {
    public static WaterPointResponse from(WaterPoint waterPoint) {
        return new WaterPointResponse(
                waterPoint.getId(), waterPoint.getName(), waterPoint.getLatitude(),
                waterPoint.getLongitude(), waterPoint.getStatus(), waterPoint.getType(),
                waterPoint.getAddress(), waterPoint.getUpdatedAt()
        );
    }
}
