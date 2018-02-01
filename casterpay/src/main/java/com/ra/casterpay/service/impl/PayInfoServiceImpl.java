package com.ra.casterpay.service.impl;

import com.ra.casterpay.model.PayInfo;
import com.ra.casterpay.model.payinfo.State;
import com.ra.casterpay.repository.PayInfoRepository;
import com.ra.casterpay.service.PayInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PayInfoServiceImpl implements PayInfoService {
    @Autowired
    private PayInfoRepository payInfoRepository;

    @Override
    public Flux<PayInfo> findAllByFromUserId(String fromUserId) {
        return payInfoRepository.findAllByFromUserId(fromUserId);
    }

    @Override
    public Flux<PayInfo> findAllByToUserId(String toUserId) {
        return payInfoRepository.findAllByToUserId(toUserId);
    }

    @Override
    public Flux<PayInfo> findAllByStateAndOrderId(State state, String orderId) {
        return payInfoRepository.findAllByStateAndOrderId(state, orderId);
    }

    @Override
    public Flux<PayInfo> findAllByState(State state) {
        return payInfoRepository.findAllByState(state);
    }

    @Override
    public Flux<PayInfo> findAll() {
        return payInfoRepository.findAll();
    }

    @Override
    public Mono<PayInfo> findById(String id) {
        return payInfoRepository.findById(id);
    }

    @Override
    public Mono<PayInfo> save(PayInfo payInfo) {
        return payInfoRepository.save(payInfo);
    }

    @Override
    public Flux<PayInfo> saveAll(Flux<PayInfo> ts) {
        return payInfoRepository.saveAll(ts);
    }

    @Override
    public Mono<PayInfo> update(String id, PayInfo payInfo) {
        payInfo.setId(id);
        return payInfoRepository.deleteById(id)
                .then(payInfoRepository.save(payInfo));
    }
}
