package com.examly.springapp.service;

import com.examly.springapp.model.Role;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Static admin
    private final String ADMIN_EMAIL = "gokul12@gmail.com";
    private final String ADMIN_PASSWORD = "gokul123"; // plain password
    private final String ADMIN_USERNAME = "Gokul";

    // Register normal user
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER); 
        return userRepository.save(user);
    }

    // Login validation by email
    public Optional<Role> validateLogin(String email, String password) {
        // Check static admin first
        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            return Optional.of(Role.ADMIN);
        }

        // Check normal users from DB
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(User::getRole);
    }
    public List<User> getAllUsers() {
    return userRepository.findAll();
}

}
