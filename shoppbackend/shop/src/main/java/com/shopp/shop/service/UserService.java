package com.shopp.shop.service;

import com.shopp.shop.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.shopp.shop.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(User user) {
        String email = user.getEmail();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email Already Registered");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        System.out.println("User added successfully");
        return userRepository.save(user);
    }

    public User editUser(User user, MultipartFile profilePicture) throws IOException {
        if (profilePicture != null && !profilePicture.isEmpty()){
            user.setProfilePicture(profilePicture.getBytes());
        }
        return userRepository.save(user);
    }

    public User saveUserNoException(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User user) {

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        System.out.println("User updated successfully");
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    // Fungsi untuk menemukan user berdasarkan ID
    public User findUserById(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.orElse(null);
    }

    // Fungsi untuk menghapus user
    public void deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(String.valueOf(userId) + "not found"));
        userRepository.delete(user);
    }


}
