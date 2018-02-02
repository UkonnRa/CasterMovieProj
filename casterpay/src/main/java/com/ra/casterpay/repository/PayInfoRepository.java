package com.ra.casterpay.repository;

import com.ra.casterpay.model.PayInfo;
import com.ra.casterpay.model.payinfo.State;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface PayInfoRepository extends ReactiveMongoRepository<PayInfo, String> {
    Flux<PayInfo> findAllByFromUserId(String fromUserId);

    Flux<PayInfo> findAllByToUserId(String toUserId);

    Flux<PayInfo> findAllByStateAndOrderId(State state, String orderId);

    Flux<PayInfo> findAllByState(State state);
}
