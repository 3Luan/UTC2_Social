package com.project1.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing // Bật auditing để sử dụng @CreatedDate
public class MongoConfig {

}
