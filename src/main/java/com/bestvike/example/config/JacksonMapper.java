package com.bestvike.example.config;

import com.bestvike.commons.json.CustomJacksonModule;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.text.SimpleDateFormat;

/**
 * Created by lihua on 2018/1/6.
 */
@Component
public class JacksonMapper extends ObjectMapper {
    @Value("${spring.jackson.date-format}")
    private String dateFormat;

    @PostConstruct
    public void configMapper () {
        // configure(JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN, true);
        if (!StringUtils.isEmpty(dateFormat)) {
            setDateFormat(new SimpleDateFormat(dateFormat));
        }
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        registerModule(new CustomJacksonModule());
    }
}
