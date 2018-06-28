package com.ra.castermovie.service.impl;

import com.ra.castermovie.model.Order;
import com.ra.castermovie.model.common.Condition;
import com.ra.castermovie.model.order.OrderState;
import com.ra.castermovie.repo.OrderRepository;
import com.ra.castermovie.repo.PublicInfoRepository;
import com.ra.castermovie.service.OrderService;
import com.ra.castermovie.service.util.Filters;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PublicInfoRepository publicInfoRepository;


    @Override
    public Flux<Order> findAllByUserId(String userId) {
        return Filters.filterDeleted(orderRepository.findAllByUserId(userId), Order.class).doOnError((err) -> log.info("err in OrderServiceImpl.findAllByUserId: {}", err));
    }

    @Override
    public Flux<Order> findAllByPublicInfoId(String publicInfoId) {
        return Filters.filterDeleted(orderRepository.findAllByPublicInfoId(publicInfoId), Order.class);
    }

    @Override
    public Flux<Order> findAllByOrderState(OrderState orderState) {
        return Filters.filterDeleted(orderRepository.findAllByOrderState(orderState), Order.class);
    }

    @Override
    public Flux<Order> findAllByTheaterId(String theaterId) {
        return Filters.filterDeleted(publicInfoRepository.findAllByTheaterId(theaterId).flatMap(pi -> orderRepository.findAllByPublicInfoId(pi.getId())), Order.class);
    }

    @Override
    public Flux<Order> findAll() {
        return Filters.filterDeleted(orderRepository.findAll(), Order.class);
    }

    @Override
    public Mono<Order> findById(String id) {
        return Filters.filterDeleted(orderRepository.findById(id), Order.class);
    }

    @Override
    public Mono<Order> save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Flux<Order> saveAll(Flux<Order> ts) {
        return orderRepository.saveAll(ts);
    }

    @Override
    public Mono<Order> update(String id, Order order) {
        order.setId(id);
        return orderRepository.deleteById(id)
                .then(orderRepository.save(order));
    }

    @Override
    public Mono<Order> deleteById(String id) {
        return findById(id).flatMap(u -> {
            u.setCondition(Condition.DELETED);
            return update(id, u);
        });
    }

    @Override
    public Flux<Order> deleteAllById(Flux<String> ids) {
        return ids.flatMap(this::deleteById);
    }
}
