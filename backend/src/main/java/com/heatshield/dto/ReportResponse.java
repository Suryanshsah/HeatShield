package com.heatshield.dto;

import com.heatshield.entity.IssueType;
import com.heatshield.entity.Report;
import com.heatshield.entity.ReportStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ReportResponse(
        UUID id,
        IssueType issueType,
        String description,
        BigDecimal lat,
        BigDecimal lng,
        ReportStatus status,
        Instant timestamp,
        String photoUrl
) {
    public static ReportResponse from(Report report) {
        return new ReportResponse(
                report.getId(), report.getIssueType(), report.getDescription(),
                report.getLatitude(), report.getLongitude(), report.getStatus(),
                report.getCreatedAt(), report.getPhotoUrl()
        );
    }
}
