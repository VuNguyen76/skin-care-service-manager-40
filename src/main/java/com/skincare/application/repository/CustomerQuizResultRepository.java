
package com.skincare.application.repository;

import com.skincare.application.model.Customer;
import com.skincare.application.model.CustomerQuizResult;
import com.skincare.application.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerQuizResultRepository extends JpaRepository<CustomerQuizResult, Long> {
    List<CustomerQuizResult> findByCustomer(Customer customer);
    List<CustomerQuizResult> findByCustomerAndQuestion(Customer customer, QuizQuestion question);
}
