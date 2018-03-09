const HTTP_HEADER = 'http://localhost:8080/api/castermovie';

export const Api = {
    user: {
        register: `${HTTP_HEADER}/user/register`,
        validate: `${HTTP_HEADER}/user/validate`,
        validateCheck: `${HTTP_HEADER}/user/validateCheck`,
        cancelUser: `${HTTP_HEADER}/user/cancelUser`,
        update: `${HTTP_HEADER}/user/update`,
        getByJwt: `${HTTP_HEADER}/user/getByJwt`,
        login: `${HTTP_HEADER}/user/login`,
        findById: `${HTTP_HEADER}/user/findById`,
        recharge: `${HTTP_HEADER}/user/recharge`,
    },
    ticketsManager: {
        userRegisterNumberMonthly: `${HTTP_HEADER}/tickets/userRegisterNumberMonthly`,
        userCancelNumberMonthly: `${HTTP_HEADER}/tickets/userCancelNumberMonthly`,
        userExistingNumber: `${HTTP_HEADER}/tickets/userExistingNumber`,
        ticketsGrossIncomeMonthly: `${HTTP_HEADER}/tickets/ticketsGrossIncomeMonthly`,
        giveMoneyToTheater: `${HTTP_HEADER}/tickets/giveMoneyToTheater`,
    },
    theater: {
        register: `${HTTP_HEADER}/theater/register`,
        update: `${HTTP_HEADER}/theater/update`,
        newPublicInfo: `${HTTP_HEADER}/theater/newPublicInfo`,
        findAllShowPlaying: `${HTTP_HEADER}/theater/findAllShowPlaying`,
        findAllTheater: `${HTTP_HEADER}/theater/findAllTheater`,
        findById: `${HTTP_HEADER}/theater/findById`,
        bigFiveTotal: `${HTTP_HEADER}/theater/bigFiveTotal`,
        orderStatesTotal: `${HTTP_HEADER}/theater/orderStatesTotal`,
        grossIncomeMonthly: `${HTTP_HEADER}/theater/grossIncomeMonthly`,
        grossIncomeMonthlyRange: `${HTTP_HEADER}/theater/grossIncomeMonthlyRange`,
    },
    show: {
        newShow: `${HTTP_HEADER}/show/newShow`,
        findAllByGenreIn: `${HTTP_HEADER}/show/findAllByGenreIn`,
        findAllByGenreInAndStartTime: `${HTTP_HEADER}/show/findAllByGenreInAndStartTime`,
        findById: `${HTTP_HEADER}/show/findById`,
    },
    order: {
        newOrder: `${HTTP_HEADER}/order/newOrder`,
        checkIn: `${HTTP_HEADER}/order/checkIn`,
        payOrder: `${HTTP_HEADER}/order/payOrder`,
        retrieveOrder: `${HTTP_HEADER}/order/retrieveOrder`,
        findAllByUserId: `${HTTP_HEADER}/order/findAllByUserId`,
        findById: `${HTTP_HEADER}/order/findById`,
        orderOffline: `${HTTP_HEADER}/order/orderOffline`,
        findAllByTheaterId: `${HTTP_HEADER}/order/findAllByTheaterId`,
    },
    publicInfo: {
        findAllByShowId: `${HTTP_HEADER}/publicInfo/findAllByShowId`,
        findById: `${HTTP_HEADER}/publicInfo/findById`,
        findAllByTheaterId: `${HTTP_HEADER}/publicInfo/findAllByTheaterId`,
    },
    couponInfo: {
        getCoupon: `${HTTP_HEADER}/couponInfo/getCoupon`,
        findAllByUserId: `${HTTP_HEADER}/couponInfo/findAllByUserId`,
    },
    coupon: {
        newCoupon: `${HTTP_HEADER}/coupon/newCoupon`,
        update: `${HTTP_HEADER}/coupon/update`,
        findAllByTheaterId: `${HTTP_HEADER}/coupon/findAllByTheaterId`,
        findAllByTheaterIdAndName: `${HTTP_HEADER}/coupon/findAllByTheaterIdAndName`,
    },
    requestInfo: {
        handle: `${HTTP_HEADER}/requestInfo/handle`,
        findAllRequestInfo: `${HTTP_HEADER}/requestInfo/findAllRequestInfo`,
    },
};