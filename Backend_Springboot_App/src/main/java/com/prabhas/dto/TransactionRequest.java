package com.prabhas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRequest {
    private Long userId;
    private String purpose;
    private Double amount;
    private String type; // CREDIT or DEBIT
}
