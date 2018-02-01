package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.show.NewShowVO;
import com.ra.castermovie.logic.ShowLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/castermovie/show")
public class ShowController {
    @Autowired
    private ShowLogic showLogic;

    @PostMapping(value = "newshow", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Show> newShow(@RequestBody NewShowVO vo) {
        return showLogic.newShow(vo.getName(), vo.getGenre(), vo.getDuration());
    }

    @GetMapping(value = "findallbygenrein", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<Show>> findAllByGenreIn(@RequestParam List<Genre> genreList) {
        return showLogic.findAllByGenreIn(genreList);
    }

}
