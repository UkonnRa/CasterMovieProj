package com.ra.castermovie.controller.vo.theater;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewPublicInfoVO {
    private String theaterId;
    private String showId;
    private List<Long> schedules;
    private Integer basePrice;
    private Map<Integer, Double> priceTable;

    public List<Instant> getSchedules() {
        return schedules.stream().map(Instant::ofEpochMilli).collect(Collectors.toList());
    }
}
