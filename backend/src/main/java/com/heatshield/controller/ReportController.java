package com.heatshield.controller;

import com.heatshield.dto.CreateReportRequest;
import com.heatshield.dto.ReportResponse;
import com.heatshield.dto.UpdateReportStatusRequest;
import com.heatshield.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportResponse> getReports() {
        return reportService.findAll();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ReportResponse> createJsonReport(
            @Valid @RequestBody CreateReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.create(request, null));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportResponse> createMultipartReport(
            @RequestParam String issueType,
            @RequestParam String description,
            @RequestParam java.math.BigDecimal lat,
            @RequestParam java.math.BigDecimal lng,
            @RequestPart(required = false) MultipartFile photo) {
        CreateReportRequest request = new CreateReportRequest(
                com.heatshield.entity.IssueType.fromValue(issueType), description, lat, lng);
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.create(request, photo));
    }

    @PatchMapping("/{id}/status")
    public ReportResponse updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        return reportService.updateStatus(id, request.status());
    }
}
