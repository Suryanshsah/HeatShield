package com.heatshield.dto;

import com.heatshield.entity.WaterPointStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateWaterPointRequest(
        @NotBlank @Size(max = 150) String name,
        @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal lat,
        @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal lng,
        @NotBlank @Size(max = 80) String type,
        @NotNull WaterPointStatus status,
        @Size(max = 300) String address
) {}
