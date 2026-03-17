package com.prabhas.service;

import com.prabhas.models.entity.Transactions;
import com.prabhas.models.entity.User;
import com.prabhas.repositories.TransactionsRepository;
import com.prabhas.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionsService {

    @Autowired
    private TransactionsRepository transactionsRepository;

    @Autowired
    private UserService userService; // Use UserService for user operations

    public Transactions createTransaction(Long userId, String purpose, Double amount, String type) {
        if (!type.equalsIgnoreCase("CREDIT") && !type.equalsIgnoreCase("DEBIT")) {
            throw new RuntimeException("Invalid transaction type. Must be CREDIT or DEBIT");
        }
        if (amount == null || amount <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        User user = userService.getUserById(userId);

        // For debit transactions, check sufficient funds
        if (type.equalsIgnoreCase("DEBIT")) {
            if (!userService.canWithdraw(user.getUsername(), amount)) {
                throw new RuntimeException("Insufficient balance for debit transaction");
            }
            user.setBalance(user.getBalance() - amount);
        } else { // CREDIT
            user.setBalance(user.getBalance() + amount);
        }

        Transactions transaction = new Transactions();
        transaction.setUser(user);
        transaction.setPurpose(purpose);
        transaction.setAmount(amount);
        transaction.setType(type.toUpperCase());

        // Save transaction and update user balance atomically
        transactionsRepository.save(transaction);
        userService.saveUser(user);
        return transaction;
    }

    public List<Transactions> getTransactionsForUser(Long userId) {
        User user = userService.getUserById(userId);
        return transactionsRepository.findUserTransactionsByIdOrderByRecent(userId);
    }

    public Optional<Transactions> getTransactionById(Long transactionId) {
        return transactionsRepository.findById(transactionId);
    }

    public List<Transactions> getTransactionsByType(Long userId, String type) {
        User user = userService.getUserById(userId);
        return transactionsRepository.findUserTransactionsByType(userId, type.toUpperCase());
    }

    public Double getBalance(Long userId) {
        User user = userService.getUserById(userId);
        return user.getBalance();
    }

    public boolean canWithdraw(Long username, Double amount) {
        Double balance = userService.getUserById(username).getBalance();
        return balance != null && balance >= amount;
    }

    @Transactional
    public Transactions updateTransaction(Long transactionId, Transactions updatedTransaction) {
        return transactionsRepository.findById(transactionId).map(existingTransaction -> {
            // Validate the transaction and update balance accordingly
            if (!updatedTransaction.getType().equalsIgnoreCase("CREDIT") && !updatedTransaction.getType().equalsIgnoreCase("DEBIT")) {
                throw new RuntimeException("Invalid transaction type. Must be CREDIT or DEBIT");
            }
            if (updatedTransaction.getAmount() == null || updatedTransaction.getAmount() <= 0) {
                throw new RuntimeException("Amount must be greater than 0");
            }

            User user = existingTransaction.getUser();

            // Reverse old transaction effect on balance
            if (existingTransaction.getType().equalsIgnoreCase("CREDIT")) {
                user.setBalance(user.getBalance() - existingTransaction.getAmount());
            } else if (existingTransaction.getType().equalsIgnoreCase("DEBIT")) {
                user.setBalance(user.getBalance() + existingTransaction.getAmount());
            }

            // Apply new transaction effect
            if (updatedTransaction.getType().equalsIgnoreCase("DEBIT")) {
                if (user.getBalance() < updatedTransaction.getAmount()) {
                    throw new RuntimeException("Insufficient balance for updated debit transaction");
                }
                user.setBalance(user.getBalance() - updatedTransaction.getAmount());
            } else { // CREDIT
                user.setBalance(user.getBalance() + updatedTransaction.getAmount());
            }

            // Update transaction fields
            existingTransaction.setAmount(updatedTransaction.getAmount());
            existingTransaction.setPurpose(updatedTransaction.getPurpose());
            existingTransaction.setType(updatedTransaction.getType().toUpperCase());

            userService.saveUser(user);
            return transactionsRepository.save(existingTransaction);
        }).orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));
    }

    @Transactional
    public void deleteTransaction(Long transactionId) {
        Transactions transaction = transactionsRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));

        User user = transaction.getUser();

        // Reverse transaction effect on balance
        if (transaction.getType().equalsIgnoreCase("CREDIT")) {
            user.setBalance(user.getBalance() - transaction.getAmount());
        } else if (transaction.getType().equalsIgnoreCase("DEBIT")) {
            user.setBalance(user.getBalance() + transaction.getAmount());
        }

        // Save user after balance update
        userService.saveUser(user);

        // Delete transaction
        transactionsRepository.deleteById(transactionId);
    }
}