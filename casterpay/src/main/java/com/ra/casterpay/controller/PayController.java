package com.ra.casterpay.controller;

import com.ra.casterpay.controller.vo.GiveMoneyToTheaterVO;
import com.ra.casterpay.controller.vo.PayOrderVO;
import com.ra.casterpay.controller.vo.RechargeVO;
import com.ra.casterpay.controller.vo.RetrieveVO;
import com.ra.casterpay.logic.PayLogic;
import com.ra.casterpay.logic.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("api/casterpay/pay")
public class PayController {
    @Autowired
    private PayLogic payLogic;

    @PostMapping(value = "payorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> payOrder(@RequestBody PayOrderVO payOrderVO) {
        Result<String> result = payLogic.payOrder(payOrderVO.getUserId(), payOrderVO.getTheaterId(), payOrderVO.getOrderId(), payOrderVO.getMoney());
        log.info("payOrder ===> {}", result);
        return result;
    }

    @PostMapping(value = "retrieveorder", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> retrieveOrder(@RequestBody RetrieveVO retrieveVO) {
        log.info("RetrieveVO ===> {}", retrieveVO);
        Result<String> result = payLogic.retrieveOrder(retrieveVO.getOrderId(), retrieveVO.getDiscount());
        log.info("retrieveOrder ===> {}", result);
        return result;
    }

    @PostMapping(value = "recharge", consumes = MediaType.APPLICATION_JSON_VALUE)
    Result<String> recharge(@RequestBody RechargeVO rechargeVO) {
        Result<String> result = payLogic.recharge(rechargeVO.getUserId(), rechargeVO.getMoney());
        log.info("recharge ===> {}", result);
        return result;
    }

    @PostMapping(value = "giveMoneyToTheater", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    Result<String> giveMoneyToTheater(@RequestBody GiveMoneyToTheaterVO vo) {
        return payLogic.giveMoneyToTheater(vo.getTheaterId(), vo.getMoney());
    }

}
