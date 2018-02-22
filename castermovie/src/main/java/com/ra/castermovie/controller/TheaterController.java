package com.ra.castermovie.controller;

import com.ra.castermovie.controller.vo.theater.*;
import com.ra.castermovie.logic.TheaterLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.Theater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("api/castermovie/theater")
public class TheaterController {
    @Autowired
    private TheaterLogic theaterLogic;

    @PostMapping(value = "register", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> register(@RequestBody RegisterVO vo) {
        return theaterLogic.register(vo.getPassword(), vo.getName(), vo.getRegionId(), vo.getLocation(), vo.getSeatNumber(), vo.getSeatPerLine());
    }

    @PostMapping(value = "validate", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> validate(@RequestBody ValidateVO vo) {
        return theaterLogic.validate(vo.getTheaterId(), vo.getInitMoney());
    }

    @PostMapping(value = "update", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> update(@RequestBody UpdateVO vo) {
        return theaterLogic.update(vo.getId(), vo.getTheater());
    }

    @PostMapping(value = "newPublicInfo", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> newPublicInfo(@RequestBody NewPublicInfoVO vo) {
        return theaterLogic.newPublicInfo(vo.getTheaterId(), vo.getShowId(), vo.getSchedules(), vo.getBasePrice(), vo.getPriceTable());
    }

    @GetMapping(value = "findAllShowPlaying", consumes = MediaType.ALL_VALUE)
    Result<List<PublicInfo>> findAllShowPlaying(@ModelAttribute FindAllShowPlayingVO vo) {
        Instant from = vo.getTimeFrom() == null ? Instant.MIN : Instant.ofEpochMilli(vo.getTimeFrom());
        Instant to = vo.getTimeTo() == null ? Instant.MAX : Instant.ofEpochMilli(vo.getTimeTo());
        Pair<Instant, Instant> timePair = Pair.of(from, to);
        return theaterLogic.findAllShowPlaying(vo.getTheaterId(), timePair, vo.getGenreList());
    }

    @GetMapping(value = "findAllTheater", consumes = MediaType.ALL_VALUE)
    Result<List<Theater>> findAllTheater(@RequestParam int regionId) {
        return theaterLogic.findAllTheater(regionId);
    }

    @GetMapping(value = "findById", consumes = MediaType.ALL_VALUE)
    Result<Theater> findById(@RequestParam String id) {
        return theaterLogic.findById(id);
    }

}
