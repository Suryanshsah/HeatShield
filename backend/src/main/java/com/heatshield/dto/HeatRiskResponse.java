package com.heatshield.dto;

import com.heatshield.entity.HeatRiskSnapshot;
import com.heatshield.entity.HeatRiskLevel;

import java.math.BigDecimal;
import java.time.Instant;

public record HeatRiskResponse(
        HeatRiskLevel level,
        BigDecimal temperature,
        BigDecimal feelsLike,
        String advisory,
        Instant observedAt,
        String source
) {
    public static HeatRiskResponse from(HeatRiskSnapshot snapshot) {
        return new HeatRiskResponse(snapshot.getRiskLevel(), snapshot.getTemperature(),
                snapshot.getFeelsLike(), snapshot.getAdvisory(), snapshot.getObservedAt(),
                snapshot.getSource());
    }
}
