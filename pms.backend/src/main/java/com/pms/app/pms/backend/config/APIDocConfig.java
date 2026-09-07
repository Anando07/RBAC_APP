package com.pms.app.pms.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Auth Application build by Anando Kumar Biswas.",
                description = "Generic auth app that can be used with any application.",
                contact = @Contact(
                        name = "Anando Kumar Biswas",
                        url = "https://ird.gov.bd/",
                        email = "abku07@gmail.com"
                ),
                version = "1.0",
                summary = "This application is very useful to reuse as RBAC."



        )
        ,
        security = {
                @SecurityRequirement(
                        name="bearerAuth"
                )
        }


)

@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer", //Authorization: Bearer htokenaswga,
        bearerFormat = "JWT"

)
public class APIDocConfig {


}
