package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.show.NewShowVO;
import com.ra.castermovie.logic.ShowLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/castermovie/show")
public class ShowController {
    @Autowired
    private ShowLogic showLogic;

    @PostMapping(value = "newShow", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Show> newShow(@RequestBody NewShowVO vo) {
        return showLogic.newShow(vo.getName(), vo.getGenre(), vo.getDuration());
    }

    @GetMapping(value = "findAllByGenreIn", consumes = MediaType.ALL_VALUE)
    Result<List<Show>> findAllByGenreIn(@RequestParam(required = false) List<Genre> genreList) {
        return showLogic.findAllByGenreIn(genreList);
    }

    @GetMapping(value = "findAllByGenreInAndStartTime", consumes = MediaType.ALL_VALUE)
    Result<List<Show>> findAllByGenreInAndStartTime(@RequestParam(required = false) List<Genre> genreList, @RequestParam Long startTime) {
        return showLogic.findAllByGenreInAndStartTime(genreList, startTime);
    }

    @GetMapping(value = "findById", consumes = MediaType.ALL_VALUE)
    Result<Show> findById(@RequestParam String id) {
        return showLogic.findById(id);
    }

}
