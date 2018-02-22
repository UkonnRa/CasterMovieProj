package com.ra.castermovie.model;


import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.theater.State;
import com.ra.castermovie.model.user.Level;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "theater")
// id is a seven-digit string
public class Theater {
    @Id
    private String id;
    @NotNull(message = "Theater::condition must not be null")
    private Condition condition;
    @NotNull(message = "Theater::condition must not be null")
    private State state;
    @NotNull(message = "Theater::password must not be null")
    private String password;
    @NotNull(message = "Theater::name must not be null")
    private String name;
    @NotNull(message = "Theater::regionId must not be null")
    private Integer regionId;
    @NotNull(message = "Theater::location must not be null")
    private String location;
    @NotNull(message = "Theater::seatNumber must not be null")
    private Integer seatNumber;
    @NotNull(message = "Theater::seatPerLine must not be null")
    private Integer seatPerLine;
    private List<String> publicInfos;
    private Map<Level, Double> discounts;

    public Theater(String id, String password, String name, Integer regionId, String location, Integer seatNumber, Integer seatPerLine) {
        this.id = id;
        this.condition = Condition.EXISTING;
        this.state = State.WAITING;
        this.password = password;
        this.name = name;
        this.regionId = regionId;
        this.location = location;
        this.seatNumber = seatNumber;
        this.seatPerLine = seatPerLine;
        this.publicInfos = Collections.emptyList();
        this.discounts = Collections.emptyMap();
    }
}
