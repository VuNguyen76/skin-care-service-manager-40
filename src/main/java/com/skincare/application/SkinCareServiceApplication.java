
package com.skincare.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SkinCareServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkinCareServiceApplication.class, args);
    }
}
