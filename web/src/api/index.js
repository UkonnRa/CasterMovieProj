const HTTP_HEADER = 'http://localhost:8080/api/castermovie';

export const Api = {
    user: {
        register: `${HTTP_HEADER}/user/register`,
        validate: `${HTTP_HEADER}/user/validate`,
        validateCheck: `${HTTP_HEADER}/user/validateCheck`,
        cancelUser: `${HTTP_HEADER}/user/cancelUser`,
        update: `${HTTP_HEADER}/user/update`,
        getByJwt: `${HTTP_HEADER}/user/getByJwt`,
        login: `${HTTP_HEADER}/user/login`
    },
    ticketManager: {
        findAllRequestInfo: `${HTTP_HEADER}/ticket/findAllRequestInfo`,
        recharge: `${HTTP_HEADER}/ticket/recharge`,
    },
    theater: {
        register: `${HTTP_HEADER}/theater/register`,
        validate: `${HTTP_HEADER}/theater/validate`,
        update: `${HTTP_HEADER}/theater/update`,
        newPublicInfo: `${HTTP_HEADER}/theater/newPublicInfo`,
        findAllShowPlaying: `${HTTP_HEADER}/theater/findAllShowPlaying`,
        findAllTheater: `${HTTP_HEADER}/theater/findAllTheater`,
        findById: `${HTTP_HEADER}/theater/findById`,
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
    },
    publicInfo: {
        findAllByShowId: `${HTTP_HEADER}/publicInfo/findAllByShowId`,
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
    }
};