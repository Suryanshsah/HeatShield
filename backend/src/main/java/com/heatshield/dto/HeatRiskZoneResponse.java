package com.heatshield.dto;

import com.heatshield.entity.HeatRiskZone;
import com.heatshield.entity.HeatRiskLevel;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record HeatRiskZoneResponse(
        UUID id,
        String name,
        HeatRiskLevel risk,
        String color,
        List<List<BigDecimal>> bounds
) {
    public static HeatRiskZoneResponse from(HeatRiskZone zone) {
        return new HeatRiskZoneResponse(
                zone.getId(), zone.getName(), zone.getRisk(), zone.getColor(),
                List.of(
                        List.of(zone.getMinLatitude(), zone.getMinLongitude()),
                        List.of(zone.getMaxLatitude(), zone.getMaxLongitude())
                )
        );
    }
}
