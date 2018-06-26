package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.PublicInfo;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.repo.PublicInfoRepository;
import com.ra.castermovie.service.PublicInfoService;
import com.ra.castermovie.service.util.Filters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PublicInfoServiceImpl implements PublicInfoService {
    @Autowired
    private PublicInfoRepository publicInfoRepository;

    @Override
    public Flux<PublicInfo> findAllByTheaterId(String theaterId) {
        return Filters.filterDeleted(publicInfoRepository.findAllByTheaterId(theaterId), PublicInfo.class);
    }

    @Override
    public Flux<PublicInfo> findAllByShowId(String showId) {
        return Filters.filterDeleted(publicInfoRepository.findAllByShowId(showId), PublicInfo.class);
    }

    @Override
    public Flux<PublicInfo> findAllBySchedule(Long localDateTime) {
        return Filters.filterDeleted(publicInfoRepository.findAllBySchedule(localDateTime), PublicInfo.class);
    }

    @Override
    public Flux<PublicInfo> findAll() {
        return Filters.filterDeleted(publicInfoRepository.findAll(), PublicInfo.class);
    }

    @Override
    public Mono<PublicInfo> findById(String id) {
        return Filters.filterDeleted(publicInfoRepository.findById(id), PublicInfo.class);
    }

    @Override
    public Mono<PublicInfo> save(PublicInfo publicInfo) {
        return publicInfoRepository.save(publicInfo);
    }

    @Override
    public Flux<PublicInfo> saveAll(Flux<PublicInfo> ts) {
        return publicInfoRepository.saveAll(ts);
    }

    @Override
    public Mono<PublicInfo> update(String id, PublicInfo publicInfo) {
        publicInfo.setId(id);
        return publicInfoRepository.deleteById(id)
                .then(publicInfoRepository.save(publicInfo));
    }

    @Override
    public Mono<PublicInfo> deleteById(String id) {
        return findById(id).flatMap(u -> {
            u.setCondition(Condition.DELETED);
            return update(id, u);
        });
    }

    @Override
    public Flux<PublicInfo> deleteAllById(Flux<String> ids) {
        return ids.flatMap(this::deleteById);
    }
}
