package com.ra.castermovie.model;

import com.ra.castermovie.model.common.Condition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "public_info")
public class PublicInfo {
    @Id
    private String id;
    @NotNull(message = "PublicInfo::condition must not be null")
    private Condition condition;
    @NotNull(message = "PublicInfo::timestamp must not be null")
    private Long timestamp;
    @NotNull(message = "PublicInfo::timestamp must not be null")
    private String theaterId;
    @NotNull(message = "PublicInfo::showId must not be null")
    private String showId;
    @NotNull(message = "PublicInfo::schedule must not be null")
    private Long schedule;
    @NotNull(message = "PublicInfo::basePrice must not be null")
    private Integer basePrice;
    @NotNull(message = "PublicInfo::priceTable must not be null")
    private Map<Integer, Double> priceTable;
    @NotNull(message = "PublicInfo::priceTable must not be null")
    private List<Boolean> seatDistribution;
    private Boolean hasBeenDistributed;

    public PublicInfo(String theaterId, String showId, Long schedule, Integer basePrice, Map<Integer, Double> priceTable, List<Boolean> seatDistribution) {
        this.id = UUID.randomUUID().toString();
        this.condition = Condition.EXISTING;
        this.timestamp = System.currentTimeMillis();
        this.theaterId = theaterId;
        this.showId = showId;
        this.schedule = schedule;
        this.basePrice = basePrice;
        this.priceTable = priceTable;
        this.seatDistribution = seatDistribution;
        this.hasBeenDistributed = false;
    }

}
