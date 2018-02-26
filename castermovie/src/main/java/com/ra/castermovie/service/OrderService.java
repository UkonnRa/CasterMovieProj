package com.ra.castermovie.service;

import com.ra.castermovie.model.Order;
import com.ra.castermovie.model.order.OrderState;
import reactor.core.publisher.Flux;

public interface OrderService extends BaseService<Order> {
    Flux<Order> findAllByUserId(String userId);

    Flux<Order> findAllByPublicInfoId(String publicInfoId);

    Flux<Order> findAllByOrderState(OrderState orderState);

    Flux<Order> findAllByTheaterId(String theaterId);
}
