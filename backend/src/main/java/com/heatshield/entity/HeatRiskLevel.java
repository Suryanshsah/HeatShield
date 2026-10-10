package com.heatshield.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum HeatRiskLevel {
    LOW("low"),
    MODERATE("moderate"),
    HIGH("high"),
    SEVERE("severe");

    private final String value;

    HeatRiskLevel(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
