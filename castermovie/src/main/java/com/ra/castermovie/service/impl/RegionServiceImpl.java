package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.Region;
import com.ra.castermovie.repo.RegionRepository;
import com.ra.castermovie.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RegionServiceImpl implements RegionService {
    @Autowired
    private RegionRepository regionRepository;

    @Override
    public Mono<Region> findById(int id) {
        return regionRepository.findById(id);
    }

    @Override
    public Flux<Region> findAllByName(String name) {
        return regionRepository.findAllByName(name);
    }

    @Override
    public Flux<Region> findAllByParent(int parent) {
        return regionRepository.findAllByParent(parent);
    }
}
