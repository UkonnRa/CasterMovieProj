package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.ShowLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ShowLogicImpl implements ShowLogic {
    private final ShowService showService;

    @Autowired
    public ShowLogicImpl(ShowService showService) {
        this.showService = showService;
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
        return show == null? Result.fail("代码失效"): Result.succeed(show);
    }
}
