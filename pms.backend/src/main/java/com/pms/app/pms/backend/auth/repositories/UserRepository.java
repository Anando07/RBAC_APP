package com.pms.app.pms.backend.auth.repositories;

import com.pms.app.pms.backend.auth.entities.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Override
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findById(UUID id);

    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}