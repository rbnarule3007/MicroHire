package com.freelancerconnect.dto;

import lombok.Data;

@Data
public class ApplicationRequest {
    private Long jobId;
    private Long freelancerId;
    private String coverMessage;
}
