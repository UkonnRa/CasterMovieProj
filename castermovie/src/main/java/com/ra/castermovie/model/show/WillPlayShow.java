package com.ra.castermovie.model.show;

import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WillPlayShow {
    private String id;
    private String name;
    private Genre genre;
    private Integer duration;
    private String poster;
    private Long startDate;

    public WillPlayShow(Show show, Long startDate) {
        this.id = show.getId();
        this.name = show.getName();
        this.genre = show.getGenre();
        this.duration = show.getDuration();
        this.poster = show.getPoster();
        this.startDate = startDate;
    }
}
