package com.ra.castermovie.repo;

import com.ra.castermovie.model.Order;
import com.ra.castermovie.model.order.OrderState;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface OrderRepository extends ReactiveMongoRepository<Order, String> {
    Flux<Order> findAllByUserId(String userId);

    Flux<Order> findAllByPublicInfoId(String publicInfoId);

    Flux<Order> findAllByOrderState(OrderState orderState);
}
