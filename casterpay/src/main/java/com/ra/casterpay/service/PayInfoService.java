package com.ra.casterpay.service;

import com.ra.casterpay.model.PayInfo;
import com.ra.casterpay.model.payinfo.State;
import reactor.core.publisher.Flux;

public interface PayInfoService extends BaseService<PayInfo> {
    Flux<PayInfo> findAllByFromUserId(String fromUserId);

    Flux<PayInfo> findAllByToUserId(String toUserId);

    Flux<PayInfo> findAllByStateAndOrderId(State state, String orderId);

    Flux<PayInfo> findAllByState(State state);
}
