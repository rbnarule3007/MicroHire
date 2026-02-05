package com.freelancerconnect.controller;

import com.freelancerconnect.entity.Message;
import com.freelancerconnect.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/job/{jobId}")
    public List<Message> getMessagesByJob(@PathVariable Long jobId) {
        return messageRepository.findByJobIdOrderByTimestampAsc(jobId);
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        return ResponseEntity.ok(messageRepository.save(message));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return messageRepository.findById(id).map(m -> {
            m.setRead(true);
            messageRepository.save(m);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/unread/{userId}")
    public List<Message> getUnreadMessages(@PathVariable Long userId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(userId);
    }
}
