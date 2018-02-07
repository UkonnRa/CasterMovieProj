package com.ra.castermovie.auth.model;

import org.json.JSONObject;

public class JSONResult {
    public static String fillResultString(String message, Object result) {
        JSONObject jsonObject = new JSONObject() {{
            put("message", message);
            put("value", result);
        }};
        return jsonObject.toString();
    }
}