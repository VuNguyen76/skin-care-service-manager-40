
package com.skincare.application.repository;

import com.skincare.application.model.Specialist;
import com.skincare.application.model.SpecialistSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface SpecialistScheduleRepository extends JpaRepository<SpecialistSchedule, Long> {
    List<SpecialistSchedule> findBySpecialist(Specialist specialist);
    List<SpecialistSchedule> findBySpecialistAndDayOfWeek(Specialist specialist, DayOfWeek dayOfWeek);
    List<SpecialistSchedule> findBySpecialistAndIsAvailableTrue(Specialist specialist);
}
