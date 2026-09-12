package com.pms.app.pms.backend.auth.controllers;

import com.pms.app.pms.backend.auth.config.AppConstants;
import com.pms.app.pms.backend.auth.payload.UserDto;
import com.pms.app.pms.backend.auth.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    //create user api
    @PreAuthorize("hasAnyRole('"+ AppConstants.ADMIN_ROLE +"','"+ AppConstants.ADMINISTRATOR_ROLE +"')")
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDto));
    }

    // get all user api
    @PreAuthorize("hasAnyRole('"+ AppConstants.ADMIN_ROLE +"','"+ AppConstants.ADMINISTRATOR_ROLE +"')")
    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // get user by email
    @PreAuthorize("hasAnyRole('"+ AppConstants.ADMIN_ROLE +"','"+ AppConstants.ADMINISTRATOR_ROLE +"')")
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    //delete user
    //api/v1/users/{userId}
    @PreAuthorize("hasAnyRole('"+ AppConstants.ADMIN_ROLE +"','"+ AppConstants.ADMINISTRATOR_ROLE +"')")
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
    }

    //update user
    //api/v1/users/{userId}
    @PreAuthorize("hasAnyRole('"+ AppConstants.ADMIN_ROLE +"','"+ AppConstants.ADMINISTRATOR_ROLE +"')")
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto, @PathVariable("userId") String userId) {
        return ResponseEntity.ok(userService.updateUser(userDto, userId));
    }

    //get user by id
    //api/v1/users/{userId}
    @PreAuthorize("hasAnyRole('"+ AppConstants.ADMIN_ROLE +"','"+ AppConstants.ADMINISTRATOR_ROLE +"')")
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") String userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

}
