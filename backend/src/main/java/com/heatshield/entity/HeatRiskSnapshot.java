package com.heatshield.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "heat_risk_snapshots")
public class HeatRiskSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HeatRiskLevel riskLevel;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperature;

    @Column(precision = 5, scale = 2)
    private BigDecimal feelsLike;

    @Column(nullable = false, length = 500)
    private String advisory;

    @Column(nullable = false, length = 100)
    private String source;

    @Column(nullable = false)
    private Instant observedAt;

    public UUID getId() { return id; }
    public HeatRiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(HeatRiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public BigDecimal getTemperature() { return temperature; }
    public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }
    public BigDecimal getFeelsLike() { return feelsLike; }
    public void setFeelsLike(BigDecimal feelsLike) { this.feelsLike = feelsLike; }
    public String getAdvisory() { return advisory; }
    public void setAdvisory(String advisory) { this.advisory = advisory; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Instant getObservedAt() { return observedAt; }
    public void setObservedAt(Instant observedAt) { this.observedAt = observedAt; }
}
