package com.heatshield.dto;

import com.heatshield.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateReportStatusRequest(@NotNull ReportStatus status) {}
