package com.heatshield.controller;

import com.heatshield.dto.HeatRiskResponse;
import com.heatshield.dto.HeatRiskZoneResponse;
import com.heatshield.service.HeatRiskService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/heat-risk")
public class HeatRiskController {

    private final HeatRiskService heatRiskService;

    public HeatRiskController(HeatRiskService heatRiskService) {
        this.heatRiskService = heatRiskService;
    }

    @GetMapping("/current")
    public HeatRiskResponse current() {
        return heatRiskService.current();
    }

    @GetMapping("/zones")
    public List<HeatRiskZoneResponse> zones() {
        return heatRiskService.zones();
    }
}
