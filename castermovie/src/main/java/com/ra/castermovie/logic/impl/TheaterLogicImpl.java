package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.TheaterLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.Region;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.Theater;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.model.theater.State;
import com.ra.castermovie.service.PublicInfoService;
import com.ra.castermovie.service.RegionService;
import com.ra.castermovie.service.ShowService;
import com.ra.castermovie.service.TheaterService;
import com.ra.castermovie.util.HttpRestUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class TheaterLogicImpl implements TheaterLogic {
    private final TheaterService theaterService;
    private final PublicInfoService publicInfoService;
    private final ShowService showService;
    private final RegionService regionService;

    @Value("${casterpay.new-user}")
    private String newUserUrl;

    @Autowired
    public TheaterLogicImpl(TheaterService theaterService, PublicInfoService publicInfoService, ShowService showService, RegionService regionService) {
        this.theaterService = theaterService;
        this.publicInfoService = publicInfoService;
        this.showService = showService;
        this.regionService = regionService;
    }

    @Override
    public synchronized Result<Theater> register(String password, String name, int regionId, String location, int seatNumber) {
        Region region = regionService.findById(regionId).block();
        if (region == null) return Result.fail("地区信息不存在");
        Theater t;
        String id;
        do {
            id = UUID.randomUUID().toString().toLowerCase();
            id = id.substring(id.length() - 7);
            t = theaterService.findById(id).block();
        } while (t != null);
        t = theaterService.save(new Theater(id, password, name, regionId, location, seatNumber)).block();
        return t == null ? Result.fail("数据库错误，剧院信息保存失败") : Result.succeed(t);
    }

    @Override
    public synchronized Result<Theater> validate(String theaterId, int initMoney) {
        Theater theater = theaterService.findById(theaterId).block();
        if (theater == null) return Result.fail("该剧院不存在");
        theater.setState(State.FINISHED);

        Map<String, Object> map = new HashMap<>();
        map.put("id", theaterId);
        map.put("role", "THEATER");
        map.put("initMoney", initMoney);
        HttpRestUtil.httpPost(newUserUrl, map, Result.class);

        return update(theaterId, theater);
    }

    @Override
    public Result<Theater> update(String id, Theater theater) {
        Theater t = theaterService.update(id, theater).block();
        return t == null ? Result.fail("数据库错误，剧院信息更新失败") : Result.succeed(t);
    }

    @Override
    public Result<Theater> newPublicInfo(String theaterId, String showId, List<Instant> schedules, Integer basePrice, Map<Integer, Double> priceTable) {
        Theater t = theaterService.findById(theaterId).block();
        if (t == null || t.getState() != State.FINISHED) return Result.fail("剧院不存在");
        Show show = showService.findById(showId).block();
        if (show == null) return Result.fail("该电影不存在");
        List<String> publicInfos = t.getPublicInfos();
        if (publicInfos == null) publicInfos = new ArrayList<>();
        Boolean[] booleans = new Boolean[t.getSeatNumber()];
        Arrays.fill(booleans, true);
        List<PublicInfo> saveResult = schedules.stream().map(s -> publicInfoService.save(new PublicInfo(theaterId, showId, s.toEpochMilli(), basePrice, priceTable, Arrays.asList(booleans))).block()).collect(Collectors.toList());
        publicInfos.addAll(saveResult.stream().map(PublicInfo::getId).collect(Collectors.toList()));
        t.setPublicInfos(publicInfos);
        return update(theaterId, t);
    }

    @Override
    public Result<List<PublicInfo>> findAllShowPlaying(String theaterId, Pair<Instant, Instant> timePair, List<Genre> genreList) {
        List<PublicInfo> publicInfos = publicInfoService.findAllByTheaterId(theaterId).collectList().block();
        return Result.succeed(
                publicInfos.stream().filter(info -> {
                    Instant s = Instant.ofEpochMilli(info.getSchedule());
                    return s != null && s.isAfter(timePair.getFirst()) && s.isBefore(timePair.getSecond());
                }).filter(info -> {
                    Show s = showService.findById(info.getShowId()).block();
                    // genreList == null means select all genres
                    return s != null && (genreList == null || genreList.indexOf(s.getGenre()) != -1);
                }).collect(Collectors.toList())
        );
    }

    @Override
    public Result<List<Theater>> findAllTheater(int regionId) {
        return Result.succeed(theaterService.findAllByRegionId(regionId).collectList().block().stream().filter(u -> u.getState() == State.FINISHED).collect(Collectors.toList()));
    }

    @Override
    public Result<Theater> findById(String id) {
        Theater t = theaterService.findById(id).block();
        return t == null? Result.fail("剧院不存在"): Result.succeed(t);
    }
}
