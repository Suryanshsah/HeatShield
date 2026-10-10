package com.heatshield.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;

public enum IssueType {
    BROKEN_TAP("broken-tap"),
    WATER_UNAVAILABLE("water-unavailable"),
    LEAKING_PIPE("leaking-pipe"),
    COOLING_UNAVAILABLE("cooling-unavailable");

    private final String value;

    IssueType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static IssueType fromValue(String value) {
        return Arrays.stream(values())
                .filter(type -> type.value.equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported issue type: " + value));
    }
}
