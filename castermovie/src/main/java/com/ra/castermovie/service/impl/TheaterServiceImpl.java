package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.Theater;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.repo.TheaterRepository;
import com.ra.castermovie.service.TheaterService;
import com.ra.castermovie.service.util.Filters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class TheaterServiceImpl implements TheaterService {
    @Autowired
    private TheaterRepository theaterRepository;

    @Override
    public Flux<Theater> findAllByName(String name) {
        return Filters.filterDeleted(theaterRepository.findAllByName(name), Theater.class);
    }

    @Override
    public Flux<Theater> findAllByRegionId(Integer regionId) {
        return Filters.filterDeleted(theaterRepository.findAllByRegionId(regionId), Theater.class);
    }

    @Override
    public Flux<Theater> findAll() {
        return Filters.filterDeleted(theaterRepository.findAll(), Theater.class);
    }

    @Override
    public Mono<Theater> findById(String id) {
        return Filters.filterDeleted(theaterRepository.findById(id), Theater.class);
    }

    @Override
    public Mono<Theater> save(Theater theater) {
        return theaterRepository.save(theater);
    }

    @Override
    public Flux<Theater> saveAll(Flux<Theater> ts) {
        return theaterRepository.saveAll(ts);
    }

    @Override
    public Mono<Theater> update(String id, Theater theater) {
        theater.setId(id);
        return theaterRepository.deleteById(id)
                .then(theaterRepository.save(theater));
    }

    @Override
    public Mono<Theater> deleteById(String id) {
        return findById(id).flatMap(u -> {
            u.setCondition(Condition.DELETED);
            return update(id, u);
        });
    }

    @Override
    public Flux<Theater> deleteAllById(Flux<String> ids) {
        return ids.flatMap(this::deleteById);
    }

}
