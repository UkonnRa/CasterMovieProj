package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.Show;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.repo.PublicInfoRepository;
import com.ra.castermovie.repo.ShowRepository;
import com.ra.castermovie.service.ShowService;
import com.ra.castermovie.service.util.Filters;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ShowServiceImpl implements ShowService {
    @Autowired
    private ShowRepository showRepository;
    @Autowired
    private PublicInfoRepository publicInfoRepository;

    @Override
    public Flux<Show> findAllByGenreIn(List<Genre> genreList) {
        return Filters.filterDeleted(showRepository.findAllByGenreIn(genreList), Show.class);
    }

    @Override
    public Flux<Show> findAllByGenreInAndStartTime(List<Genre> genreList, Long startTime) {
        List<Show> shows1 = showRepository.findAllByGenreIn(genreList).collectList().block();
        List<Show> shows2 = shows1.stream().filter(show -> {
            Long maxTime = publicInfoRepository.findAllByShowId(show.getId()).map(PublicInfo::getSchedule).sort().blockLast();
            maxTime = maxTime == null ? Long.MIN_VALUE : maxTime;
            return startTime < maxTime;
        }).collect(Collectors.toList());


        return Flux.fromIterable(shows2);
    }

    @Override
    public Flux<Show> findAll() {
        return Filters.filterDeleted(showRepository.findAll(), Show.class);
    }

    @Override
    public Mono<Show> findById(String id) {
        return Filters.filterDeleted(showRepository.findById(id), Show.class);
    }

    @Override
    public Mono<Show> save(Show show) {
        return showRepository.save(show);
    }

    @Override
    public Flux<Show> saveAll(Flux<Show> ts) {
        return showRepository.saveAll(ts);
    }

    @Override
    public Mono<Show> update(String id, Show show) {
        show.setId(id);
        return showRepository.deleteById(id)
                .then(showRepository.save(show));
    }

    @Override
    public Mono<Show> deleteById(String id) {
        return findById(id).flatMap(u -> {
            u.setCondition(Condition.DELETED);
            return update(id, u);
        });
    }

    @Override
    public Flux<Show> deleteAllById(Flux<String> ids) {
        return ids.flatMap(this::deleteById);
    }

}
