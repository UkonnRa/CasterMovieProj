package com.ra.castermovie.logic.impl;

import com.ra.castermovie.logic.TheaterLogic;
import com.ra.castermovie.logic.common.Result;
import com.ra.castermovie.model.*;
import com.ra.castermovie.model.common.Genre;
import com.ra.castermovie.model.order.OrderState;
import com.ra.castermovie.model.theater.UserTheater;
import com.ra.castermovie.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TheaterLogicImpl implements TheaterLogic {
    private final TheaterService theaterService;
    private final PublicInfoService publicInfoService;
    private final ShowService showService;
    private final RequestInfoService requestInfoService;
    private final OrderService orderService;

    @Value("${casterpay.new-user}")
    private String newUserUrl;

    @Autowired
    public TheaterLogicImpl(TheaterService theaterService, PublicInfoService publicInfoService, ShowService showService, RequestInfoService requestInfoService, OrderService orderService) {
        this.theaterService = theaterService;
        this.publicInfoService = publicInfoService;
        this.showService = showService;
        this.requestInfoService = requestInfoService;
        this.orderService = orderService;
    }

    @Override
    public synchronized Result<RequestInfo> register(UserTheater theater) {

        RequestInfo info = requestInfoService.save(new RequestInfo(theater.getId(), com.ra.castermovie.model.requestinfo.State.CREATING, theater)).block();
        if (info == null) return Result.fail("无法申请剧院");
        else return Result.succeed(info);
    }

    @Override
    public Result<RequestInfo> update(String id, UserTheater userTheater) {
        Theater theater = theaterService.findById(id).block();
        if (theater == null) return Result.fail("剧院不存在");
        RequestInfo info = requestInfoService.save(new RequestInfo(id, com.ra.castermovie.model.requestinfo.State.UPDATING, userTheater)).block();
        return info == null ? Result.fail("无法发布请求信息") : Result.succeed(info);
    }

    @Override
    public Result<Theater> newPublicInfo(String theaterId, String showId, List<Instant> schedules, Integer basePrice) {
        Theater t = theaterService.findById(theaterId).block();
        Show show = showService.findById(showId).block();
        if (show == null) return Result.fail("该电影不存在");
        List<String> publicInfos = t.getPublicInfos();
        if (publicInfos == null) publicInfos = new ArrayList<>();
        Boolean[] booleans = new Boolean[t.getSeatNumber()];
        Arrays.fill(booleans, true);
        List<PublicInfo> saveResult = schedules.stream().map(s -> publicInfoService.save(new PublicInfo(theaterId, showId, s.toEpochMilli(), basePrice, Arrays.asList(booleans))).block()).collect(Collectors.toList());
        publicInfos.addAll(saveResult.stream().map(PublicInfo::getId).collect(Collectors.toList()));
        t.setPublicInfos(publicInfos);
        Theater result = theaterService.update(theaterId, t).block();
        return result == null ? Result.fail("剧院信息无法保存") : Result.succeed(result);
    }

    @Override
    public Result<List<PublicInfo>> findAllShowPlaying(String theaterId, Pair<Instant, Instant> timePair, List<Genre> genreList) {
        List<PublicInfo> publicInfos = publicInfoService.findAllByTheaterId(theaterId).collectList().block();
        return Result.succeed(
                publicInfos.stream().filter(info -> {
                    Instant s = Instant.ofEpochMilli(info.getSchedule());
                    return s != null && s.isAfter(timePair.getFirst()) && s.isBefore(timePair.getSecond());
                }).filter(info -> {
                    Show s = showService.findById(info.getShowId()).block();
                    // genreList == null means select all genres
                    return s != null && (genreList == null || genreList.indexOf(s.getGenre()) != -1);
                }).collect(Collectors.toList())
        );
    }

    @Override
    public Result<List<Theater>> findAllTheater(int regionId) {
        return Result.succeed(theaterService.findAllByRegionId(regionId).collectList().block());
    }

    @Override
    public Result<Theater> findById(String id) {
        Theater t = theaterService.findById(id).block();
        return t == null ? Result.fail("剧院不存在") : Result.succeed(t);
    }

    @Override
    public Result<Map<String, Integer>> bigFiveTotal(String theaterId) {
        Map<String, Integer> result = orderService.findAll()
                .filter(o -> (o.getOrderState() == OrderState.READY || o.getOrderState() == OrderState.FINISHED) && o.getUserId() != null)
                .groupBy(Order::getUserId)
                .flatMap(g -> g.count().map(len -> Pair.of(g.key(), len.intValue())))
                .sort(Comparator.comparingInt(Pair::getSecond))
                .take(5).collectMap(Pair::getFirst, Pair::getSecond).block();
        return Result.succeed(result);
    }

    @Override
    public Result<Map<OrderState, Integer>> orderStatesTotal(String theaterId) {
        return Result.succeed(
                orderService.findAllByTheaterId(theaterId).groupBy(Order::getOrderState)
                        .flatMap(g -> g.count().map(len -> Pair.of(g.key(), len.intValue())))
                        .collectMap(Pair::getFirst, Pair::getSecond).block()
        );
    }

    private Result<Integer> _grossIncomeMonthly(YearMonth yearMonth, String theaterId) {
        try {
            return Result.succeed(orderService
                    .findAllByTheaterId(theaterId)
                    .filter(o -> (o.getOrderState() == OrderState.READY || o.getOrderState() == OrderState.FINISHED)
                            && YearMonth.from(Instant.ofEpochMilli(o.getCreateTime()).atZone(ZoneId.systemDefault()).toLocalDate()).equals(yearMonth))
                    .map(Order::getActualCost).reduce((i, j) -> i + j).blockOptional().orElse(0));
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail(e.getMessage());
        }
    }

    @Override
    public Result<Integer> grossIncomeMonthly(String yearMonthString, String theaterId) {
        YearMonth yearMonth = YearMonth.parse(yearMonthString);
        return _grossIncomeMonthly(yearMonth, theaterId);
    }

    @Override
    public Result<Map<String, Integer>> grossIncomeMonthlyRange(List<String> yearMonths, String theaterId) {
        if (yearMonths.size() != 2) return Result.fail("范围设定失败");
        YearMonth startDate = YearMonth.parse(yearMonths.get(0));
        YearMonth endDate = YearMonth.parse(yearMonths.get(1));
        if (!startDate.isBefore(endDate)) {
            YearMonth temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        List<YearMonth> list = new LinkedList<>();
        while (startDate.isBefore(endDate)) {
            list.add(startDate);
            startDate = startDate.plusMonths(1);
        }


        Map<String, Integer> map = new HashMap<>();

        for (YearMonth ym : list) {
            log.info("year month: {}", ym);
            Result<Integer> result = _grossIncomeMonthly(ym, theaterId);
            log.info("{}: {}", ym.format(DateTimeFormatter.ofPattern("yyyy-MM")), result.getValue());
            if (result.ifSuccessful()) {
                map.put(ym.format(DateTimeFormatter.ofPattern("yyyy-MM")), result.getValue());
            } else {
                return Result.fail(result.getMessage());
            }
        }

        return Result.succeed(map);
    }


}
