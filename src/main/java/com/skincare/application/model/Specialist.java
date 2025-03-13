
package com.skincare.application.model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "specialists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Specialist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String specialization;
    
    private String bio;
    
    private String experience;
    
    private String certifications;

    @Column(name = "rating_average")
    private Double ratingAverage = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @ManyToMany
    @JoinTable(
        name = "specialist_services",
        joinColumns = @JoinColumn(name = "specialist_id"),
        inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<Service> services = new HashSet<>();

    @OneToMany(mappedBy = "specialist")
    private Set<Booking> bookings = new HashSet<>();

    @OneToMany(mappedBy = "specialist")
    private Set<SpecialistSchedule> schedules = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
