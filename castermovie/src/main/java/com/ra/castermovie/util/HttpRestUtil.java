package com.ra.castermovie.util;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

@Slf4j
public class HttpRestUtil {
    public static <T> T httpPost(String url, Map<String, Object> bodyMap, Class<T> tClass) {
        String reqBody = new Gson().toJson(bodyMap, new TypeToken<Map<String, Object>>() {
        }.getType());
        RestTemplate template = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.setAccept(Collections.singletonList(MediaType.ALL));
        HttpEntity<String> entity = new HttpEntity<>(reqBody, headers);
        URI uri = URI.create(url);
        ResponseEntity<T> r = template.exchange(uri, HttpMethod.POST, entity, tClass);
        log.info("castermovie ResponseEntity ===> {}", r.getBody());
        return r.getBody();
    }
}
