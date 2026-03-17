package com.prabhas.repositories;

import com.prabhas.models.entity.Transactions;
import com.prabhas.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionsRepository extends JpaRepository<Transactions, Long> {
    
    List<Transactions> findByUser(User user);
    
    @Query("SELECT t FROM Transactions t WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<Transactions> findUserTransactionsByIdOrderByRecent(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Transactions t WHERE t.user.id = :userId AND t.type = :type ORDER BY t.createdAt DESC")
    List<Transactions> findUserTransactionsByType(@Param("userId") Long userId, @Param("type") String type);
}