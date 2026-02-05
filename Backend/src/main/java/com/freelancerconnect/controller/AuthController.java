package com.freelancerconnect.controller;

import com.freelancerconnect.dto.LoginRequest;
import com.freelancerconnect.dto.LoginResponse;
import com.freelancerconnect.dto.SignupRequest;
import com.freelancerconnect.dto.VerifyRequest;
import com.freelancerconnect.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestBody SignupRequest request) {
        if (!request.isTermsAccepted()) {
            return "You must accept the Terms & Conditions to sign up.";
        }
        return authService.initiateRegistration(
                request.getFullName(),
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getMobileNo(),
                request.getRole(),
                request.isTermsAccepted());
    }

    @PostMapping("/direct-signup")
    public String directSignup(@RequestBody SignupRequest request) {
        if (!request.isTermsAccepted()) {
            return "You must accept the Terms & Conditions to sign up.";
        }
        return authService.directRegister(
                request.getFullName(),
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getMobileNo(),
                request.getRole(),
                request.isTermsAccepted());
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyRequest request) {
        return authService.verifyOtpAndRegister(request.getEmail(), request.getOtp());
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }
}
