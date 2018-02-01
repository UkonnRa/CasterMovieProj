package com.ra.castermovie;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CastermovieApplication {
    private static final Logger log = LoggerFactory.getLogger(CastermovieApplication.class);
//    private final RegionRepository regionRepository;
//    private final TicketsManagerLogic ticketsManagerLogic;
//    private final TheaterLogic theaterLogic;
//    private final ShowRepository showRepository;
//    private final ShowService showService;
//    private final OrderLogic orderLogic;
//    private final CouponInfoLogic couponInfoLogic;
//    private final CouponLogic couponLogic;

//    @Autowired
//    public CastermovieApplication(RegionRepository regionRepository, TicketsManagerLogic ticketsManagerLogic, TheaterLogic theaterLogic, UserRepository userRepository, ShowRepository showRepository, ShowService showService, OrderLogic orderLogic, CouponInfoLogic couponInfoLogic, CouponLogic couponLogic) {
//        this.regionRepository = regionRepository;
//        this.ticketsManagerLogic = ticketsManagerLogic;
//        this.theaterLogic = theaterLogic;
//        this.showRepository = showRepository;
//        this.showService = showService;
//        this.orderLogic = orderLogic;
//        this.couponInfoLogic = couponInfoLogic;
//        this.couponLogic = couponLogic;
//    }

    public static void main(String[] args) {
        SpringApplication.run(CastermovieApplication.class, args);
    }

//    @Override
//    public void run(String... args) throws MessagingException {
//        Result<Theater> t = theaterLogic.register("password1", "name1", 100001, "loc1", 200);
//        if (t.isFailed()) {
//            System.out.println(t.getMessage());
//        } else {
//            Theater theater = t.getValue();
//            theaterLogic.validate(theater.getId());
//            theaterLogic.newPublicInfo(theater.getId(), "show1", Arrays.asList(ZonedDateTime.of(2018, 2, 17, 0, 0, 0, 0, ZoneId.systemDefault()).toInstant(), ZonedDateTime.of(2017, 1, 1, 0, 0, 0, 0, ZoneId.systemDefault()).toInstant()), 1000,Collections.emptyMap());
//            theaterLogic.newPublicInfo(theater.getId(), "show2", Arrays.asList(ZonedDateTime.of(2018, 6, 1, 0, 0, 0, 0, ZoneId.systemDefault()).toInstant(), ZonedDateTime.of(2017, 6, 1, 0, 0, 0, 0, ZoneId.systemDefault()).toInstant()), 1200,Collections.emptyMap());
//            PublicInfo info = theaterLogic.findAllShowPlaying(theater.getId(), Pair.of(ZonedDateTime.of(2018, 2, 16, 0, 0, 0, 0, ZoneId.systemDefault()).toInstant(), ZonedDateTime.of(2018, 2, 18, 0, 0, 0, 0, ZoneId.systemDefault()).toInstant()), null).getValue().get(0);
//
//            Integer[] ints = new Integer[20];
//            Arrays.fill(ints, null);
//            List<Integer> seats = Arrays.asList(ints);
//            System.out.println("SEAT ==> " + seats);
//            List<Order> os = IntStream.range(0, 15).mapToObj(i -> {
//                Result<Order> result = orderLogic.newOrder("d6bd3974-d07e-434f-b28d-d2ebb5c944fb", info.getId(), null, seats);
//                System.out.println("NEW ===> " + result);
//                return result.getValue();
//            }).collect(Collectors.toList());
//            os.forEach(o -> System.out.println("OK ===> " + orderLogic.receivePayInfo(new PayInfo(o.getId(), true, null))));
//
//            try {
//                Thread.sleep(70000);
//                os.forEach(o -> System.out.println(orderLogic.checkIn(theater.getId(), o.getId())));
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//        }
//    }
}
