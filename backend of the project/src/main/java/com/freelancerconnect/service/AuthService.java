package com.freelancerconnect.service;

import com.freelancerconnect.entity.Client;
import com.freelancerconnect.entity.Freelancer;
import com.freelancerconnect.entity.OtpVerification;
import com.freelancerconnect.repository.ClientRepository;
import com.freelancerconnect.repository.FreelancerRepository;
import com.freelancerconnect.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void sendEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("MicroHire Registration OTP");
        message.setText("Welcome to MicroHire!\n\nYour OTP for registration is: " + otp
                + "\nThis OTP will expire in 5 minutes.");
        mailSender.send(message);
    }

    @Transactional
    public String initiateRegistration(String fullName, String username, String email, String password, String mobileNo,
            String role, boolean termsAccepted) {
        // Check if user already exists
        if (clientRepository.findByEmail(email).isPresent() || freelancerRepository.findByEmail(email).isPresent() ||
                clientRepository.findByUsername(username).isPresent()
                || freelancerRepository.findByUsername(username).isPresent()) {
            return "Email or Username already registered!";
        }

        String otp = generateOtp();

        // Save temporary registration data
        otpRepository.deleteByEmail(email); // Clear any old OTPs for this email

        OtpVerification otpData = new OtpVerification();
        otpData.setEmail(email);
        otpData.setUsername(username);
        otpData.setOtp(otp);
        otpData.setFullName(fullName);
        otpData.setPassword(passwordEncoder.encode(password)); // Encrypt password!
        otpData.setMobileNo(mobileNo);
        otpData.setRole(role);
        otpData.setTermsAccepted(termsAccepted);
        otpData.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(otpData);

        try {
            sendEmail(email, otp);
            return "OTP sent successfully to " + email;
        } catch (Exception e) {
            return "Failed to send email: " + e.getMessage();
        }
    }

    @Transactional
    public String directRegister(String fullName, String username, String email, String password, String mobileNo,
            String role, boolean termsAccepted) {
        if (clientRepository.findByEmail(email).isPresent() || freelancerRepository.findByEmail(email).isPresent() ||
                clientRepository.findByUsername(username).isPresent()
                || freelancerRepository.findByUsername(username).isPresent()) {
            return "Email or Username already registered!";
        }

        String encodedPassword = passwordEncoder.encode(password);
        if ("CLIENT".equalsIgnoreCase(role)) {
            Client client = new Client();
            client.setFullName(fullName);
            client.setUsername(username);
            client.setEmail(email);
            client.setPassword(encodedPassword);
            client.setMobileNo(mobileNo);
            client.setVerified(true);
            client.setTermsAccepted(termsAccepted);
            clientRepository.save(client);
        } else if ("FREELANCER".equalsIgnoreCase(role)) {
            Freelancer freelancer = new Freelancer();
            freelancer.setFullName(fullName);
            freelancer.setUsername(username);
            freelancer.setEmail(email);
            freelancer.setPassword(encodedPassword);
            freelancer.setMobileNo(mobileNo);
            freelancer.setVerified(true);
            freelancer.setTermsAccepted(termsAccepted);
            freelancerRepository.save(freelancer);
        }
        return "Registration successful!";
    }

    @Transactional
    public String verifyOtpAndRegister(String email, String otp) {
        OtpVerification otpData = otpRepository.findByEmailAndOtp(email, otp)
                .orElse(null);

        if (otpData == null || otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Invalid or expired OTP!";
        }

        if ("CLIENT".equalsIgnoreCase(otpData.getRole())) {
            Client client = new Client();
            client.setFullName(otpData.getFullName());
            client.setUsername(otpData.getUsername());
            client.setEmail(otpData.getEmail());
            client.setPassword(otpData.getPassword());
            client.setMobileNo(otpData.getMobileNo());
            client.setVerified(true);
            client.setTermsAccepted(otpData.isTermsAccepted());
            clientRepository.save(client);
        } else if ("FREELANCER".equalsIgnoreCase(otpData.getRole())) {
            Freelancer freelancer = new Freelancer();
            freelancer.setFullName(otpData.getFullName());
            freelancer.setUsername(otpData.getUsername());
            freelancer.setEmail(otpData.getEmail());
            freelancer.setPassword(otpData.getPassword());
            freelancer.setMobileNo(otpData.getMobileNo());
            freelancer.setVerified(true);
            freelancer.setTermsAccepted(otpData.isTermsAccepted());
            freelancerRepository.save(freelancer);
        } else if ("ADMIN".equalsIgnoreCase(otpData.getRole())) {
            com.freelancerconnect.entity.Admin admin = new com.freelancerconnect.entity.Admin();
            admin.setFullName(otpData.getFullName());
            admin.setEmail(otpData.getEmail());
            admin.setPassword(otpData.getPassword());
            admin.setMobileNo(otpData.getMobileNo());
            adminRepository.save(admin);
        }

        otpRepository.delete(otpData);
        return "Registration successful!";
    }

    @Autowired
    private com.freelancerconnect.repository.AdminRepository adminRepository;

    public com.freelancerconnect.dto.LoginResponse login(String identifier, String password) {
        System.out.println("Login attempt for: " + identifier);

        // --- Admin Login ---
        var adminOpt = adminRepository.findByEmail(identifier);
        if (adminOpt.isEmpty()) {
            // Try matching by "System Admin" or "admin" username as a fallback
            if (identifier.equalsIgnoreCase("admin") || identifier.equalsIgnoreCase("admin@microhire.com")) {
                adminOpt = adminRepository.findByEmail("admin@microhire.com");
            }
        }

        if (adminOpt.isPresent()) {
            var admin = adminOpt.get();
            System.out.println("Admin found! Checking password...");
            if (checkPassword(password, admin.getPassword())) {
                upgradeAdminPassword(admin, password);
                return new com.freelancerconnect.dto.LoginResponse("Login successful as Admin!", admin.getId(), "ADMIN",
                        admin.getFullName(), admin.getEmail(), 100);
            } else {
                System.out.println("Admin password check failed.");
            }
        }

        // --- Client Login ---
        var clientOpt = clientRepository.findByEmail(identifier);
        if (clientOpt.isEmpty())
            clientOpt = clientRepository.findByUsername(identifier);

        if (clientOpt.isPresent()) {
            var client = clientOpt.get();
            if (checkPassword(password, client.getPassword())) {
                upgradeClientPassword(client, password);
                return new com.freelancerconnect.dto.LoginResponse("Login successful as Client!", client.getId(),
                        "CLIENT", client.getFullName(), client.getEmail(), 100);
            }
        }

        // --- Freelancer Login ---
        var freelancerOpt = freelancerRepository.findByEmail(identifier);
        if (freelancerOpt.isEmpty())
            freelancerOpt = freelancerRepository.findByUsername(identifier);

        if (freelancerOpt.isPresent()) {
            var freelancer = freelancerOpt.get();
            if (checkPassword(password, freelancer.getPassword())) {
                upgradeFreelancerPassword(freelancer, password);
                return new com.freelancerconnect.dto.LoginResponse("Login successful as Freelancer!",
                        freelancer.getId(), "FREELANCER", freelancer.getFullName(), freelancer.getEmail(),
                        freelancer.getProfileCompleteness());
            }
        }

        return new com.freelancerconnect.dto.LoginResponse("Invalid identifier or password!", null, null, null, null,
                0);
    }

    private boolean checkPassword(String rawPassword, String storedPassword) {
        if (storedPassword == null)
            return false;
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return rawPassword.equals(storedPassword);
    }

    private void upgradeAdminPassword(com.freelancerconnect.entity.Admin admin, String rawPassword) {
        if (!admin.getPassword().startsWith("$2a$")) {
            admin.setPassword(passwordEncoder.encode(rawPassword));
            adminRepository.save(admin);
        }
    }

    private void upgradeClientPassword(Client client, String rawPassword) {
        if (!client.getPassword().startsWith("$2a$")) {
            client.setPassword(passwordEncoder.encode(rawPassword));
            clientRepository.save(client);
        }
    }

    private void upgradeFreelancerPassword(Freelancer freelancer, String rawPassword) {
        if (!freelancer.getPassword().startsWith("$2a$")) {
            freelancer.setPassword(passwordEncoder.encode(rawPassword));
            freelancerRepository.save(freelancer);
        }
    }
}
