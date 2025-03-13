
package com.skincare.application.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "skin_type")
    private String skinType;

    @Column(name = "skin_concerns")
    private String skinConcerns;

    @Column(name = "allergies")
    private String allergies;

    @Column(name = "medical_history")
    private String medicalHistory;

    @OneToMany(mappedBy = "customer")
    @Builder.Default
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @Builder.Default
    private Set<CustomerQuizResult> quizResults = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
