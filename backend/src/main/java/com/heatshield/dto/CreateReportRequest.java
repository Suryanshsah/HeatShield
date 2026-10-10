package com.heatshield.dto;

import com.heatshield.entity.IssueType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CreateReportRequest(
        @NotNull IssueType issueType,
        @NotBlank @Size(max = 2000) String description,
        @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal lat,
        @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal lng
) {}
