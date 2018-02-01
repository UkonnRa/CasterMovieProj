package com.ra.castermovie.model.user;

public enum State {
    UNCHECKED("待验证"), REGISTERED("已验证"), REMOVED("已取消");
    public String tip;

    State(String tip) {
        this.tip = tip;
    }
}
