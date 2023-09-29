package com.shopp.shop.controller;

import com.shopp.shop.model.User;
import com.shopp.shop.repository.UserRepository;
import com.shopp.shop.requestBody.UserLoginRequestBody;
import com.shopp.shop.response.CustomErrorResponse;
import com.shopp.shop.response.SuccessLoginResponse;
import com.shopp.shop.service.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    ResponseEntity<Object> loginEmailAndPassword(@RequestBody UserLoginRequestBody user) {

        Optional<User> findByEmail = userRepository.findByEmail(user.getEmail());

        if (findByEmail.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } else {
            User userFromDb = findByEmail.get();
            if(!userFromDb.isActive()){
                CustomErrorResponse error = new CustomErrorResponse("User suspended.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            if (!passwordEncoder.matches(user.getPassword(), userFromDb.getPassword())) {
                CustomErrorResponse error = new CustomErrorResponse("Invalid password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            String generatedToken = jwtUtil.generateToken(userFromDb.getEmail());
            SuccessLoginResponse tokenResponse = new SuccessLoginResponse(generatedToken,
                    userFromDb.getEmail(),
                    userFromDb.getRole(),
                    userFromDb.getUserDetails(),
                    userFromDb.getJoinedDate(),
                    userFromDb.getBuyer(),
                    userFromDb.getSupplier(),
                    userFromDb.isActive()
                    );

            return ResponseEntity.ok(tokenResponse);
        }
    }



    @GetMapping("/needAuth")
    public String needAuth() {
        return "Hello P";
    }

    @GetMapping("/createToken")
    public String createToken() {
        return jwtUtil.generateToken("jwt@token.com");
    }

    @GetMapping("/getToken")
    public ResponseEntity<Object> whoAmI(@RequestParam("token") String token) {

        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.getUsernameFromToken(token);

            Optional<User> findByEmail = userRepository.findByEmail(email);
            if (findByEmail.isPresent()) {
                return ResponseEntity.ok(findByEmail.get());
            } else {
                CustomErrorResponse error = new CustomErrorResponse("Email not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } else {
            CustomErrorResponse error = new CustomErrorResponse("Token is not valid");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
