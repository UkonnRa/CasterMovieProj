package com.ra.castermovie.model;

import com.ra.castermovie.model.requestinfo.State;
import com.ra.castermovie.model.theater.UserTheater;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "request_info")
public class RequestInfo {
    @Id
    private String id;
    @NotNull(message = "RequestInfo::state must not be null")
    private State state;
    @NotNull(message = "RequestInfo::theaterId must not be null")
    private String theaterId;
    @NotNull(message = "RequestInfo::timestamp must not be null")
    private Long timestamp;
    @NotNull(message = "RequestInfo::theaterInfo must not be null")
    private UserTheater theaterInfo;

    public RequestInfo(String theaterId, State state, UserTheater theaterInfo) {
        this.id = UUID.randomUUID().toString();
        this.state = state;
        this.theaterId = theaterId;
        this.timestamp = System.currentTimeMillis();
        this.theaterInfo = theaterInfo;
    }
}
