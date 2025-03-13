
package com.skincare.application.repository;

import com.skincare.application.model.Blog;
import com.skincare.application.model.Tag;
import com.skincare.application.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByIsPublishedTrue();
    List<Blog> findByAuthor(User author);
    List<Blog> findByTagsContaining(Tag tag);
    List<Blog> findTop5ByIsPublishedTrueOrderByPublishedAtDesc();
}
