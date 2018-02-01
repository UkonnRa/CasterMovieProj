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
        return theaterLogic.register(vo.getPassword(), vo.getName(), vo.getRegionId(), vo.getLocation(), vo.getSeatNumber());
    }

    @PostMapping(value = "validate", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> validate(@RequestBody ValidateVO vo) {
        return theaterLogic.validate(vo.getTheaterId(), vo.getInitMoney());
    }

    @PostMapping(value = "update", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> update(@RequestBody UpdateVO vo) {
        return theaterLogic.update(vo.getId(), vo.getTheater());
    }

    @PostMapping(value = "newpublicinfo", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<Theater> newPublicInfo(@RequestBody NewPublicInfoVO vo) {
        return theaterLogic.newPublicInfo(vo.getTheaterId(), vo.getShowId(), vo.getSchedules(), vo.getBasePrice(), vo.getPriceTable());
    }

    @GetMapping(value = "findallshowplaying", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<PublicInfo>> findAllShowPlaying(@RequestBody FindAllShowPlayingVO vo) {
        Pair<Instant, Instant> timePair = Pair.of(Instant.ofEpochMilli(vo.getTimeFrom()), Instant.ofEpochMilli(vo.getTimeTo()));
        return theaterLogic.findAllShowPlaying(vo.getTheaterId(), timePair, vo.getGenreList());
    }

    @GetMapping(value = "findalltheater/{regionId:\\d{6}}", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<List<Theater>> findAllTheater(@PathVariable int regionId) {
        return theaterLogic.findAllTheater(regionId);
    }

}
