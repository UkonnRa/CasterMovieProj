package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.TheaterLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.*;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.model.theater.UserTheater;
import com.ra.castermovie.service.*;
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
    private final RequestInfoService requestInfoService;

    @Value("${casterpay.new-user}")
    private String newUserUrl;

    @Autowired
    public TheaterLogicImpl(TheaterService theaterService, PublicInfoService publicInfoService, ShowService showService, RegionService regionService, RequestInfoService requestInfoService) {
        this.theaterService = theaterService;
        this.publicInfoService = publicInfoService;
        this.showService = showService;
        this.regionService = regionService;
        this.requestInfoService = requestInfoService;
    }

    @Override
    public synchronized Result<RequestInfo> register(UserTheater theater) {
        Region region = regionService.findById(theater.getRegionId()).block();
        if (region == null) return Result.fail("地区信息不存在");
        Theater t;
        String id;
        do {
            id = UUID.randomUUID().toString().toLowerCase();
            id = id.substring(id.length() - 7);
            t = theaterService.findById(id).block();
        } while (t != null);

        RequestInfo info = requestInfoService.save(new RequestInfo(id, com.ra.castermovie.model.requestinfo.State.CREATING, theater)).block();
        if (info == null) return Result.fail("无法发布请求信息");
        else return Result.succeed(info);
    }

    @Override
    public Result<RequestInfo> update(String id, UserTheater userTheater) {
        Theater theater = theaterService.findById(id).block();
        if (theater == null) return Result.fail("剧院不存在");
        Theater afterUpdate = userTheater.toTheater(theater);
        RequestInfo info = requestInfoService.save(new RequestInfo(id, com.ra.castermovie.model.requestinfo.State.UPDATING, userTheater)).block();
        return info == null ? Result.fail("无法发布请求信息") : Result.succeed(info);
    }

    @Override
    public Result<Theater> newPublicInfo(String theaterId, String showId, List<Instant> schedules, Integer basePrice, Map<Integer, Double> priceTable) {
        Theater t = theaterService.findById(theaterId).block();
        Show show = showService.findById(showId).block();
        if (show == null) return Result.fail("该电影不存在");
        List<String> publicInfos = t.getPublicInfos();
        if (publicInfos == null) publicInfos = new ArrayList<>();
        Boolean[] booleans = new Boolean[t.getSeatNumber()];
        Arrays.fill(booleans, true);
        List<PublicInfo> saveResult = schedules.stream().map(s -> publicInfoService.save(new PublicInfo(theaterId, showId, s.toEpochMilli(), basePrice, priceTable, Arrays.asList(booleans))).block()).collect(Collectors.toList());
        publicInfos.addAll(saveResult.stream().map(PublicInfo::getId).collect(Collectors.toList()));
        t.setPublicInfos(publicInfos);
        Theater result = theaterService.update(theaterId, t).block();
        return result == null ? Result.fail("剧院信息无法保存") : Result.succeed(result);
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
        return Result.succeed(theaterService.findAllByRegionId(regionId).collectList().block());
    }

    @Override
    public Result<Theater> findById(String id) {
        Theater t = theaterService.findById(id).block();
        return t == null ? Result.fail("剧院不存在") : Result.succeed(t);
    }
}
