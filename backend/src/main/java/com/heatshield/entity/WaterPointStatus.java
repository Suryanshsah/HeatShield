package com.heatshield.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum WaterPointStatus {
    OPERATIONAL("operational"),
    LOW_SUPPLY("low-supply"),
    BROKEN("broken");

    private final String value;

    WaterPointStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static WaterPointStatus fromValue(String value) {
        return Arrays.stream(values())
                .filter(status -> status.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported water-point status: " + value));
    }
}
