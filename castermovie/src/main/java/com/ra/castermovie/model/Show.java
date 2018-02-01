package com.ra.castermovie.model;

import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.common.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "show")
public class Show {
    @Id
    private String id;
    @NotNull(message = "Show::condition must not be null")
    private Condition condition;
    @NotNull(message = "Show::name must not be null")
    private String name;
    @NotNull(message = "Show::genre must not be null")
    private Genre genre;
    // second
    @NotNull(message = "Show::duration must not be null")
    private Integer duration;

    public Show(String name, Genre genre, Integer duration) {
        this.id = UUID.randomUUID().toString();
        this.condition = Condition.EXISTING;
        this.name = name;
        this.genre = genre;
        this.duration = duration;
    }
}
