package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.ShowLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.service.PublicInfoService;
import com.ra.castermovie.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ShowLogicImpl implements ShowLogic {
    private final ShowService showService;
    private final PublicInfoService publicInfoService;

    @Autowired
    public ShowLogicImpl(ShowService showService, PublicInfoService publicInfoService) {
        this.showService = showService;
        this.publicInfoService = publicInfoService;
    }

    @Override
    public Result<Show> newShow(String name, Genre genre, int duration, String poster) {
        Show show = showService.save(new Show(name, genre, duration, poster)).block();
        return show == null ? Result.fail("影剧信息保存失败") : Result.succeed(show);
    }

    @Override
    public Result<List<Show>> findAllByGenreIn(List<Genre> genreList) {
        return Result.succeed(showService.findAllByGenreIn(genreList).collectList().block());
    }

    @Override
    public Result<List<Show>> findAllByGenreInAndStartTime(List<Genre> genreList, Long startTime) {
        return Result.succeed(showService.findAllByGenreInAndStartTime(genreList, startTime).collectList().block());
    }

    @Override
    public Result<Show> findById(String id) {
        Show show = showService.findById(id).block();
        return show == null ? Result.fail("代码失效") : Result.succeed(show);
    }

    @Override
    public Result<List<Show>> findAllPlayingNow() {
        long now = System.currentTimeMillis();
        long endOfToday = (((now / 86_400_000) + 1) * (86_400_000)) - 1;

        List<PublicInfo> piThisDay = publicInfoService.findAllByScheduleBetween(now, endOfToday).collectList().block();
        return Result.succeed(piThisDay.stream().map(PublicInfo::getShowId).distinct().map(id -> showService.findById(id).block()).collect(Collectors.toList()));
    }

    @Override
    public Result<List<Show>> findAllWillPlay() {
        long now = System.currentTimeMillis();
        long tomorrow = ((now / 86_400_000) + 1) * (86_400_000);
        long twoWeeks = ((now / 86_400_000) + 15) * (86_400_000);

        List<PublicInfo> publicInfoTwoWeeks = publicInfoService.findAllByScheduleBetween(tomorrow, twoWeeks).collectList().block();
        List<Show> showTwoWeeks = publicInfoTwoWeeks.stream().map(PublicInfo::getShowId).distinct().filter(showId -> {
            List<PublicInfo> publicInfos = publicInfoService.findAllByShowId(showId).collectList().block();
            long min = publicInfos.stream().map(PublicInfo::getSchedule).min(Long::compareTo).orElse(Long.MAX_VALUE);
            return tomorrow <= min && min <= twoWeeks;
        }).map(id -> showService.findById(id).block()).collect(Collectors.toList());
        return Result.succeed(showTwoWeeks);
    }
}
