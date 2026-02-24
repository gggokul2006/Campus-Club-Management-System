package com.examly.springapp.controller;

import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "https://8081-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "username", savedUser.getUsername(),
                    "role", savedUser.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email"); // ✅ using email
        String password = loginData.get("password");

        Optional<Role> role = userService.validateLogin(email, password);

        if (role.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "email", email,
                    "role", role.get().name()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}

}
