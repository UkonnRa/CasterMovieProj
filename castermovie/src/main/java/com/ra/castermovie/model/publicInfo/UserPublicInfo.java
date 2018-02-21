package com.ra.castermovie.model.publicInfo;

import com.ra.castermovie.model.common.Condition;

import java.util.List;
import java.util.Map;

public class UserPublicInfo {
    private String id;
    private String theaterName;
    private String showId;
    private Long schedule;
    private Integer basePrice;
    private Map<Integer, Double> priceTable;
    private List<Boolean> seatDistribution;
}
