package com.heatshield.service;

import com.heatshield.dto.CreateReportRequest;
import com.heatshield.dto.ReportResponse;
import com.heatshield.entity.Report;
import com.heatshield.entity.ReportStatus;
import com.heatshield.exception.ResourceNotFoundException;
import com.heatshield.repository.ReportRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final PhotoStorageService photoStorageService;

    public ReportService(ReportRepository reportRepository, PhotoStorageService photoStorageService) {
        this.reportRepository = reportRepository;
        this.photoStorageService = photoStorageService;
    }

    public List<ReportResponse> findAll() {
        return reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream().map(ReportResponse::from).toList();
    }

    public ReportResponse create(CreateReportRequest request, MultipartFile photo) {
        Report report = new Report();
        report.setIssueType(request.issueType());
        report.setDescription(request.description().trim());
        report.setLatitude(request.lat());
        report.setLongitude(request.lng());
        report.setStatus(ReportStatus.OPEN);
        report.setPhotoUrl(photoStorageService.store(photo));
        return ReportResponse.from(reportRepository.save(report));
    }

    public ReportResponse updateStatus(UUID id, ReportStatus status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + id));
        report.setStatus(status);
        return ReportResponse.from(reportRepository.save(report));
    }
}
