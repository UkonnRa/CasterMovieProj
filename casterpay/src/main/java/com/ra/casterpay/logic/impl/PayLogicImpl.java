package com.ra.casterpay.logic.impl;

import com.ra.casterpay.logic.PayLogic;
import com.ra.casterpay.logic.common.Result;
import com.ra.casterpay.model.PayInfo;
import com.ra.casterpay.model.User;
import com.ra.casterpay.model.payinfo.State;
import com.ra.casterpay.model.user.Role;
import com.ra.casterpay.service.PayInfoService;
import com.ra.casterpay.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Component
public class PayLogicImpl implements PayLogic {
    private final UserService userService;
    private final PayInfoService payInfoService;

    @Autowired
    public PayLogicImpl(UserService userService, PayInfoService payInfoService) {
        this.userService = userService;
        this.payInfoService = payInfoService;
    }

    @Override
    public synchronized Result<String> payOrder(String userId, String theaterId, String orderId, Integer money) {
        User user = userService.findById(userId).block();
        User theater = userService.findById(theaterId).block();
        User tickets = userService.findById("tickets@tickets.com").block();
        if (user == null) return Result.fail("付款用户不存在");
        if (theater == null) return Result.fail("所选剧院不存在");
        if (tickets == null) return Result.fail("Tickets 官方账户错误");
        if (user.getMoney() < money) {
            PayInfo info = payInfoService.save(new PayInfo(userId, theaterId, orderId, money, State.PAY_FAILED)).block();
            return info == null ? Result.fail("数据库异常，无法记录转账信息") : Result.fail("用户余额不足");
        }

//        Result<User> theaterResult = giveMoney(user, theater, orderId, money, State.PAY_OK);
//        if (theaterResult.ifSuccessful()) return Result.succeed(orderId);
//        else return Result.fail(theaterResult.getMessage());
        Result<User> theaterResult = giveMoney(user, theater, orderId, (int) (money * PayLogic.theaterGainRate), State.PAY_OK);
        Result<User> ticketsResult = giveMoney(user, tickets, orderId, (int) (money * (1 - PayLogic.theaterGainRate)), State.PAY_OK);

        if (theaterResult.ifSuccessful() && ticketsResult.ifSuccessful()) return Result.succeed(orderId);
        else
            return Result.fail(Stream.of(theaterResult.getMessage(), ticketsResult.getMessage()).filter(s -> !s.equals("")).reduce((u, v) -> u + "&&" + v).get());
    }

    @Override
    public synchronized Result<String> retrieveOrder(String orderId, double discount) {
        List<PayInfo> payInfos = payInfoService.findAllByStateAndOrderId(State.PAY_OK, orderId).collectList().block();
        if (payInfos.isEmpty()) return Result.fail("该订单信息不存在");
        List<Result> errorList = payInfos.stream().map(info -> {
            User official = userService.findById(info.getToUserId()).block();
            User customer = userService.findById(info.getFromUserId()).block();
            if (customer == null) return Result.fail("付款用户不存在");
            if (official == null) return Result.fail("所选剧院不存在");
            int discountedMoney = (int) (info.getCost() * discount);

            if (official.getMoney() < discountedMoney) {
                PayInfo failedInfo = payInfoService.save(new PayInfo(official.getId(), customer.getId(), orderId, discountedMoney, State.RETRIEVE_FAILED)).block();
                return failedInfo == null ? Result.fail("数据库异常，无法记录转账信息") : Result.succeed(failedInfo);
            } else {
                official.setMoney(official.getMoney() - discountedMoney);
                customer.setMoney(customer.getMoney() + discountedMoney);
                Arrays.asList(official, customer).forEach(i -> userService.update(i.getId(), i).block());
                PayInfo successfulInfo = payInfoService.save(new PayInfo(official.getId(), customer.getId(), orderId, discountedMoney, State.RETRIEVE_OK)).block();
                return successfulInfo == null ? Result.fail("数据库异常，无法记录转账信息") : Result.succeed(successfulInfo);
            }
        }).filter(Result::ifFailed).collect(Collectors.toList());
        String errorInfo = errorList.stream().map(Result::getMessage)
                .reduce((u, v) -> u + " && " + v).orElse(null);

        return errorList.isEmpty() ? Result.succeed(orderId) : Result.fail(errorInfo);
    }

    @Override
    public Result<String> recharge(String userId, Integer money) {
        User user = userService.findById(userId).block();
        User tickets = userService.findById("tickets@tickets.com").block();
        if (user == null) return Result.fail("用户不存在");
        if (money <= 0) return Result.fail("充值金额应为正数");
        if (tickets == null) return Result.fail("管理员失效，请稍后重试");

        tickets.setMoney(tickets.getMoney() + money);
        userService.update(tickets.getId(), tickets).block();
        payInfoService.save(new PayInfo("", tickets.getId(), "", money, State.RECHARGE_OK)).block();

        Result<User> giveResult = giveMoney(tickets, user, "", money, State.RETRIEVE_OK);

        return giveResult.ifSuccessful() ? Result.succeed(userService.findById(userId).block().getId()) : Result.fail(giveResult.getMessage());
    }

    @Override
    public Result<String> giveMoneyToTheater(String theaterId, Integer money) {
        User ticket = userService.findAllByRole(Role.TICKETS).blockFirst();
        User theater = userService.findById(theaterId).block();

       Result<User> userResult = giveMoney(ticket, theater, "", money, State.GIVE_TO_THEATER_OK);
       if (userResult.ifSuccessful()) return Result.succeed(theaterId);
       else return Result.fail(userResult.getMessage());
    }

    private synchronized Result<User> giveMoney(User fromUser, User toUser, String orderId, Integer money, State state) {
        if (fromUser.getMoney() < money) return Result.fail("用户余额不足");

        fromUser.setMoney(fromUser.getMoney() - money);
        toUser.setMoney(toUser.getMoney() + money);
        User result = userService.update(toUser.getId(), toUser)
                .then(userService.update(fromUser.getId(), fromUser))
                .block();

        PayInfo payInfo = payInfoService.save(new PayInfo(fromUser.getId(), toUser.getId(), orderId, money, state)).block();
        return payInfo == null ? Result.fail("数据库异常，无法记录转账信息") : Result.succeed(result);
    }
}
