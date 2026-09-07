package com.pms.app.pms.backend;

import com.pms.app.pms.backend.auth.config.AppConstants;
import com.pms.app.pms.backend.auth.entities.Provider;
import com.pms.app.pms.backend.auth.entities.Role;
import com.pms.app.pms.backend.auth.entities.User;
import com.pms.app.pms.backend.auth.repositories.RoleRepository;
import com.pms.app.pms.backend.auth.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class AuthBackend {

    public static void main(String[] args) {
        SpringApplication.run(AuthBackend.class, args);
    }

    @Bean
    CommandLineRunner initializeData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            // =====================================================
            // 1. CREATE ROLE: ROLE_ADMINISTRATOR
            // =====================================================

            Role administratorRole = roleRepository
                    .findByName(
                            "ROLE_" + AppConstants.ADMINISTRATOR_ROLE
                    )
                    .orElseGet(() -> {

                        Role role = new Role();

                        // DO NOT SET ID
                        // UUID will be generated automatically
                        role.setName(
                                "ROLE_" + AppConstants.ADMINISTRATOR_ROLE
                        );

                        return roleRepository.save(role);
                    });

            System.out.println(
                    "Administrator Role: "
                            + administratorRole.getName()
            );


            // =====================================================
            // 2. CREATE ROLE: ROLE_ADMIN
            // =====================================================

            Role adminRole = roleRepository
                    .findByName(
                            "ROLE_" + AppConstants.ADMIN_ROLE
                    )
                    .orElseGet(() -> {

                        Role role = new Role();

                        role.setName(
                                "ROLE_" + AppConstants.ADMIN_ROLE
                        );

                        return roleRepository.save(role);
                    });

            System.out.println(
                    "Admin Role: "
                            + adminRole.getName()
            );


            // =====================================================
            // 3. CREATE ROLE: ROLE_GUEST
            // =====================================================

            Role guestRole = roleRepository
                    .findByName(
                            "ROLE_" + AppConstants.GUEST_ROLE
                    )
                    .orElseGet(() -> {

                        Role role = new Role();

                        role.setName(
                                "ROLE_" + AppConstants.GUEST_ROLE
                        );

                        return roleRepository.save(role);
                    });

            System.out.println(
                    "Guest Role: "
                            + guestRole.getName()
            );


            // =====================================================
            // 4. CREATE INITIAL ADMINISTRATOR USER
            // =====================================================

            String adminEmail = "abku07@gmail.com";

            if (userRepository.existsByEmail(adminEmail)) {

                System.out.println(
                        "Administrator user already exists: "
                                + adminEmail
                );

            } else {

                User adminUser = new User();

                // IMPORTANT:
                // Do NOT set UUID manually.
                // Hibernate will generate it.

                adminUser.setEmail(adminEmail);

                adminUser.setName(
                        "System Administrator"
                );

                // IMPORTANT:
                // Password must be encoded.
                adminUser.setPassword(
                        passwordEncoder.encode("Ab@2007")
                );

                adminUser.setEnable(true);

                adminUser.setProvider(
                        Provider.LOCAL
                );

                // =================================================
                // ASSIGN ROLE_ADMINISTRATOR
                // =================================================

                Set<Role> roles = new HashSet<>();

                roles.add(administratorRole);

                adminUser.setRoles(roles);

                // Save user
                userRepository.save(adminUser);

                System.out.println(
                        "=========================================="
                );

                System.out.println(
                        "INITIAL ADMINISTRATOR CREATED"
                );

                System.out.println(
                        "Email    : " + adminEmail
                );

                System.out.println(
                        "Password : Akb@2007"
                );

                System.out.println(
                        "Role     : ROLE_ADMINISTRATOR"
                );

                System.out.println(
                        "=========================================="
                );
            }
        };
    }
}