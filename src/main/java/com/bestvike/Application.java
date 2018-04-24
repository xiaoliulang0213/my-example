package com.bestvike;

import com.bestvike.commons.properties.RestProfileProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@ComponentScan(basePackages = {"com.bestvike"})
@ServletComponentScan(basePackages = {"com.bestvike"})
@EnableConfigurationProperties({RestProfileProperties.class})
public class Application {
    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
