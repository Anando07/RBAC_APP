package com.pms.app.pms.backend.auth.services.impl;

import com.pms.app.pms.backend.auth.config.AppConstants;
import com.pms.app.pms.backend.auth.entities.Provider;
import com.pms.app.pms.backend.auth.entities.Role;
import com.pms.app.pms.backend.auth.entities.User;
import com.pms.app.pms.backend.auth.helpers.UserHelper;
import com.pms.app.pms.backend.auth.payload.RoleDto;
import com.pms.app.pms.backend.auth.payload.UserDto;
import com.pms.app.pms.backend.auth.repositories.RoleRepository;
import com.pms.app.pms.backend.auth.repositories.UserRepository;
import com.pms.app.pms.backend.auth.services.UserService;
import com.pms.app.pms.backend.exceptions.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    // =========================================================
    // CREATE USER
    // =========================================================

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {

        // -----------------------------------------------------
        // Validate email
        // -----------------------------------------------------

        if (userDto.getEmail() == null ||
                userDto.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }


        // -----------------------------------------------------
        // Check duplicate email
        // -----------------------------------------------------

        if (userRepository.existsByEmail(
                userDto.getEmail()
        )) {

            throw new IllegalArgumentException(
                    "User with given email already exists"
            );
        }


        // -----------------------------------------------------
        // Create User
        // -----------------------------------------------------

        User user = new User();

        user.setEmail(userDto.getEmail());

        user.setName(userDto.getName());

        user.setImage(userDto.getImage());

        user.setEnable(true);


        // -----------------------------------------------------
        // Provider
        // -----------------------------------------------------

        user.setProvider(
                userDto.getProvider() != null
                        ? userDto.getProvider()
                        : Provider.LOCAL
        );


        // -----------------------------------------------------
        // Password
        // -----------------------------------------------------

        if (userDto.getPassword() == null ||
                userDto.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        userDto.getPassword()
                )
        );


        // -----------------------------------------------------
        // Determine Role
        // -----------------------------------------------------

        String roleName =
                "ROLE_" + AppConstants.GUEST_ROLE;


        if (userDto.getRoles() != null &&
                !userDto.getRoles().isEmpty()) {

            RoleDto roleDto =
                    userDto.getRoles()
                            .iterator()
                            .next();

            if (roleDto != null &&
                    roleDto.getName() != null &&
                    !roleDto.getName().isBlank()) {

                roleName = roleDto.getName();
            }
        }


        // -----------------------------------------------------
        // Find Role
        // -----------------------------------------------------

        final String finalRoleName = roleName;

        Role role = roleRepository
                .findByName(finalRoleName)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role " +
                                        finalRoleName +
                                        " not found"
                        )
                );


        // -----------------------------------------------------
        // Assign Role
        // -----------------------------------------------------

        user.getRoles().add(role);


        // -----------------------------------------------------
        // Save User
        // -----------------------------------------------------

        User savedUser =
                userRepository.save(user);


        // -----------------------------------------------------
        // Return DTO
        // -----------------------------------------------------

        return modelMapper.map(
                savedUser,
                UserDto.class
        );
    }


    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    @Override
    public UserDto getUserByEmail(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with given email id"
                        )
                );

        return modelMapper.map(
                user,
                UserDto.class
        );
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    @Override
    public UserDto updateUser(
            UserDto userDto,
            String userId
    ) {

        UUID uId =
                UserHelper.parseUUID(userId);

        User existingUser =
                userRepository
                        .findById(uId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with given id"
                                )
                        );


        if (userDto.getName() != null) {
            existingUser.setName(
                    userDto.getName()
            );
        }


        if (userDto.getImage() != null) {
            existingUser.setImage(
                    userDto.getImage()
            );
        }


        if (userDto.getProvider() != null) {
            existingUser.setProvider(
                    userDto.getProvider()
            );
        }


        // -----------------------------------------------------
        // Encode password when updating
        // -----------------------------------------------------

        if (userDto.getPassword() != null &&
                !userDto.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            userDto.getPassword()
                    )
            );
        }


        existingUser.setEnable(
                userDto.isEnable()
        );

        existingUser.setUpdatedAt(
                Instant.now()
        );


        User updatedUser =
                userRepository.save(existingUser);


        return modelMapper.map(
                updatedUser,
                UserDto.class
        );
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    @Override
    public void deleteUser(String userId) {

        UUID uId =
                UserHelper.parseUUID(userId);

        User user =
                userRepository
                        .findById(uId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with given id"
                                )
                        );

        userRepository.delete(user);
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    @Override
    public UserDto getUserById(String userId) {

        User user =
                userRepository
                        .findById(
                                UserHelper.parseUUID(userId)
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found with given id"
                                )
                        );

        return modelMapper.map(
                user,
                UserDto.class
        );
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    @Override
    @Transactional
    public Iterable<UserDto> getAllUsers() {

        return userRepository
                .findAll()
                .stream()
                .map(user ->
                        modelMapper.map(
                                user,
                                UserDto.class
                        )
                )
                .toList();
    }
}