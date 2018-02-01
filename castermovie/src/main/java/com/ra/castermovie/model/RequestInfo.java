package com.ra.castermovie.model;

import com.ra.castermovie.model.requestinfo.State;
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
    @NotNull(message = "RequestInfo::timestamp must not be null")
    private Long timestamp;
    @NotNull(message = "RequestInfo::theaterId must not be null")
    private String theaterId;
    @NotNull(message = "RequestInfo::theaterInfo must not be null")
    private String theaterInfo;

    public RequestInfo(String theaterId, String theaterInfo) {
        this.id = UUID.randomUUID().toString();
        this.state = State.WAITING;
        this.timestamp = System.currentTimeMillis();
        this.theaterId = theaterId;
        this.theaterInfo = theaterInfo;
    }
}
