package com.prabhas.controller;

import com.prabhas.dto.TransactionRequest;
import com.prabhas.models.entity.Transactions;
import com.prabhas.service.TransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionsController {

    @Autowired
    private TransactionsService transactionsService;

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        try {
            Transactions transaction = transactionsService.createTransaction(
                request.getUserId(),
                request.getPurpose(),
                request.getAmount(),
                request.getType()
            );
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserTransactions(@PathVariable Long userId) {
        try {
            List<Transactions> transactions = transactionsService.getTransactionsForUser(userId);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long transactionId) {
        return transactionsService.getTransactionById(transactionId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<?> getTransactionsByType(@PathVariable Long userId, @PathVariable String type) {
        try {
            List<Transactions> transactions = transactionsService.getTransactionsByType(userId, type);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/balance/{userId}")
    public ResponseEntity<?> getBalance(@PathVariable Long userId) {
        try {
            Double balance = transactionsService.getBalance(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("balance", balance);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/verify-withdrawal")
    public ResponseEntity<?> verifyWithdrawal(@RequestParam Long userId, @RequestParam Double amount) {
        try {
            boolean canWithdraw = transactionsService.canWithdraw(userId, amount);
            Double currentBalance = transactionsService.getBalance(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("requestedAmount", amount);
            response.put("currentBalance", currentBalance);
            response.put("canWithdraw", canWithdraw);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestParam Long userId, @RequestParam Double amount) {
        try {
            if (!transactionsService.canWithdraw(userId, amount)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Insufficient balance");
                return ResponseEntity.badRequest().body(error);
            }
            Transactions withdrawal = transactionsService.createTransaction(
                userId,
                "ATM Withdrawal",
                amount,
                "DEBIT"
            );
            return ResponseEntity.ok(withdrawal);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestParam Long userId, @RequestParam Double amount) {
        try {
            Transactions deposit = transactionsService.createTransaction(
                userId,
                "ATM Deposit",
                amount,
                "CREDIT"
            );
            return ResponseEntity.ok(deposit);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/{transactionId}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long transactionId, @RequestBody Transactions updatedTransaction) {
        try {
            Transactions transaction = transactionsService.updateTransaction(transactionId, updatedTransaction);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long transactionId) {
        try {
            transactionsService.deleteTransaction(transactionId);
            return ResponseEntity.ok("Transaction deleted successfully");
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
