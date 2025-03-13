
package com.skincare.application.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "specialist_notes", columnDefinition = "TEXT")
    private String specialistNotes;

    @Column(name = "recommended_followup", columnDefinition = "TEXT")
    private String recommendedFollowup;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
