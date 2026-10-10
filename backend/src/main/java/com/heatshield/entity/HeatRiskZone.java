package com.heatshield.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "heat_risk_zones")
public class HeatRiskZone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HeatRiskLevel risk;

    @Column(nullable = false, length = 20)
    private String color;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal minLatitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal minLongitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal maxLatitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal maxLongitude;

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public HeatRiskLevel getRisk() { return risk; }
    public void setRisk(HeatRiskLevel risk) { this.risk = risk; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public BigDecimal getMinLatitude() { return minLatitude; }
    public void setMinLatitude(BigDecimal minLatitude) { this.minLatitude = minLatitude; }
    public BigDecimal getMinLongitude() { return minLongitude; }
    public void setMinLongitude(BigDecimal minLongitude) { this.minLongitude = minLongitude; }
    public BigDecimal getMaxLatitude() { return maxLatitude; }
    public void setMaxLatitude(BigDecimal maxLatitude) { this.maxLatitude = maxLatitude; }
    public BigDecimal getMaxLongitude() { return maxLongitude; }
    public void setMaxLongitude(BigDecimal maxLongitude) { this.maxLongitude = maxLongitude; }
}
