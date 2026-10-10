package com.heatshield.config;

import com.heatshield.entity.WaterPoint;
import com.heatshield.entity.WaterPointStatus;
import com.heatshield.entity.HeatRiskLevel;
import com.heatshield.entity.HeatRiskSnapshot;
import com.heatshield.entity.HeatRiskZone;
import com.heatshield.repository.HeatRiskSnapshotRepository;
import com.heatshield.repository.HeatRiskZoneRepository;
import com.heatshield.repository.WaterPointRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.Instant;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedWaterPoints(WaterPointRepository repository,
                                      HeatRiskSnapshotRepository snapshotRepository,
                                      HeatRiskZoneRepository zoneRepository) {
        return args -> {
            if (repository.count() == 0) {
                add(repository, "Nehru Place Community Tap", "28.5494", "77.2510", "Community Tap", WaterPointStatus.OPERATIONAL);
                add(repository, "Saket Water Kiosk", "28.5200", "77.2100", "Water Kiosk", WaterPointStatus.LOW_SUPPLY);
                add(repository, "Lajpat Nagar Public Tap", "28.5700", "77.2400", "Public Tap", WaterPointStatus.BROKEN);
                add(repository, "Connaught Place Fountain", "28.6315", "77.2167", "Fountain", WaterPointStatus.OPERATIONAL);
                add(repository, "Karol Bagh Tanker Point", "28.6520", "77.1900", "Tanker Point", WaterPointStatus.OPERATIONAL);
                add(repository, "Chandni Chowk Water Booth", "28.6560", "77.2310", "Water Booth", WaterPointStatus.LOW_SUPPLY);
                add(repository, "Dwarka Sec-10 Tap", "28.5730", "77.0550", "Community Tap", WaterPointStatus.OPERATIONAL);
                add(repository, "Rohini Sector 3 Kiosk", "28.7380", "77.0740", "Water Kiosk", WaterPointStatus.BROKEN);
            }
            if (snapshotRepository.count() == 0) {
                HeatRiskSnapshot snapshot = new HeatRiskSnapshot();
                snapshot.setRiskLevel(HeatRiskLevel.HIGH);
                snapshot.setTemperature(new BigDecimal("39.0"));
                snapshot.setFeelsLike(new BigDecimal("42.0"));
                snapshot.setAdvisory("Limit outdoor activity between 11 am and 5 pm. Carry water at all times.");
                snapshot.setSource("demo-seed");
                snapshot.setObservedAt(Instant.now());
                snapshotRepository.save(snapshot);
            }
            if (zoneRepository.count() == 0) {
                addZone(zoneRepository, "Central Delhi", HeatRiskLevel.SEVERE, "#d62828", "28.62", "77.17", "28.67", "77.27");
                addZone(zoneRepository, "South Delhi", HeatRiskLevel.HIGH, "#e76f51", "28.50", "77.18", "28.60", "77.28");
                addZone(zoneRepository, "West Delhi", HeatRiskLevel.MODERATE, "#f4a261", "28.60", "77.05", "28.68", "77.15");
                addZone(zoneRepository, "North-East Delhi", HeatRiskLevel.HIGH, "#e76f51", "28.68", "77.25", "28.76", "77.35");
                addZone(zoneRepository, "Dwarka / South-West", HeatRiskLevel.LOW, "#52b788", "28.54", "77.02", "28.61", "77.10");
            }
        };
    }

    private void add(WaterPointRepository repository, String name, String lat, String lng,
                     String type, WaterPointStatus status) {
        WaterPoint point = new WaterPoint();
        point.setName(name);
        point.setLatitude(new BigDecimal(lat));
        point.setLongitude(new BigDecimal(lng));
        point.setType(type);
        point.setStatus(status);
        repository.save(point);
    }

    private void addZone(HeatRiskZoneRepository repository, String name, HeatRiskLevel risk,
                         String color, String minLat, String minLng, String maxLat, String maxLng) {
        HeatRiskZone zone = new HeatRiskZone();
        zone.setName(name);
        zone.setRisk(risk);
        zone.setColor(color);
        zone.setMinLatitude(new BigDecimal(minLat));
        zone.setMinLongitude(new BigDecimal(minLng));
        zone.setMaxLatitude(new BigDecimal(maxLat));
        zone.setMaxLongitude(new BigDecimal(maxLng));
        repository.save(zone);
    }
}
