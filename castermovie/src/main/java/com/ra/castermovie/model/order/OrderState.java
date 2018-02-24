package com.ra.castermovie.model.order;

public enum OrderState {
    UNPAID, READY, FINISHED, CANCELLED, WAITING_DISTRI/* cancelled by self, paid but expired, unpaid and expired */
}
