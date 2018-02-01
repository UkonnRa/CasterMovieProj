package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.RequestInfo;
import com.ra.castermovie.repo.RequestInfoRepository;
import com.ra.castermovie.service.RequestInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class RequestInfoServiceImpl implements RequestInfoService {
    @Autowired
    private RequestInfoRepository requestInfoRepository;

    @Override
    public Flux<RequestInfo> findAllByTheaterId(String theaterId) {
        return requestInfoRepository.findAllByTheaterId(theaterId);
    }

    @Override
    public Flux<RequestInfo> findAll() {
        return requestInfoRepository.findAll();
    }

    @Override
    public Mono<RequestInfo> findById(String id) {
        return requestInfoRepository.findById(id);
    }

    @Override
    public Mono<RequestInfo> save(RequestInfo requestInfo) {
        return requestInfoRepository.save(requestInfo);
    }

    @Override
    public Flux<RequestInfo> saveAll(Flux<RequestInfo> ts) {
        return requestInfoRepository.saveAll(ts);
    }

    @Override
    public Mono<RequestInfo> update(String id, RequestInfo requestInfo) {
        requestInfo.setId(id);
        return requestInfoRepository.deleteById(id)
                .then(requestInfoRepository.save(requestInfo));
    }

    @Override

    public Mono<RequestInfo> deleteById(String id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Flux<RequestInfo> deleteAllById(Flux<String> ids) {
        throw new UnsupportedOperationException();
    }
}
