
package com.skincare.application.controller;

import com.skincare.application.dto.BlogDto;
import com.skincare.application.model.Blog;
import com.skincare.application.model.Tag;
import com.skincare.application.model.User;
import com.skincare.application.repository.BlogRepository;
import com.skincare.application.repository.TagRepository;
import com.skincare.application.repository.UserRepository;
import com.skincare.application.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    // Lấy tất cả bài viết
    @GetMapping
    public ResponseEntity<List<BlogDto>> getAllBlogs(
            @RequestParam(required = false) Boolean published,
            @RequestParam(required = false) String tag) {

        List<Blog> blogs;

        if (published != null) {
            blogs = blogRepository.findByIsPublishedTrue();
        } else if (tag != null) {
            Optional<Tag> tagEntity = tagRepository.findByName(tag);
            if (tagEntity.isPresent()) {
                blogs = blogRepository.findByTagsContaining(tagEntity.get());
            } else {
                blogs = blogRepository.findAll();
            }
        } else {
            blogs = blogRepository.findAll();
        }

        List<BlogDto> blogDtos = blogs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(blogDtos);
    }

    // Lấy blog theo ID
    @GetMapping("/{id}")
    public ResponseEntity<BlogDto> getBlogById(@PathVariable Long id) {
        Optional<Blog> blog = blogRepository.findById(id);
        if (blog.isPresent()) {
            // Tăng lượt xem khi lấy chi tiết blog
            Blog blogEntity = blog.get();
            blogEntity.setViewCount(blogEntity.getViewCount() + 1);
            blogRepository.save(blogEntity);
            
            return ResponseEntity.ok(convertToDto(blogEntity));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Lấy danh sách blog mới nhất
    @GetMapping("/latest")
    public ResponseEntity<List<BlogDto>> getLatestBlogs() {
        List<Blog> latestBlogs = blogRepository.findTop5ByIsPublishedTrueOrderByPublishedAtDesc();
        List<BlogDto> blogDtos = latestBlogs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(blogDtos);
    }

    // Tạo blog mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogDto> createBlog(@RequestBody BlogDto blogDto) {
        Blog blog = new Blog();
        updateBlogFromDto(blog, blogDto);
        
        // Lấy thông tin người dùng hiện tại
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> currentUser = userRepository.findById(userDetails.getId());
        
        if (currentUser.isPresent()) {
            blog.setAuthor(currentUser.get());
        }
        
        blog.setCreatedAt(LocalDateTime.now());
        blog.setViewCount(0);
        blog.setIsPublished(false);
        
        Blog savedBlog = blogRepository.save(blog);
        return ResponseEntity.ok(convertToDto(savedBlog));
    }

    // Cập nhật blog
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogDto> updateBlog(@PathVariable Long id, @RequestBody BlogDto blogDto) {
        Optional<Blog> existingBlog = blogRepository.findById(id);
        if (existingBlog.isPresent()) {
            Blog blog = existingBlog.get();
            updateBlogFromDto(blog, blogDto);
            Blog updatedBlog = blogRepository.save(blog);
            return ResponseEntity.ok(convertToDto(updatedBlog));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Xuất bản blog
    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogDto> publishBlog(@PathVariable Long id) {
        Optional<Blog> existingBlog = blogRepository.findById(id);
        if (existingBlog.isPresent()) {
            Blog blog = existingBlog.get();
            blog.setIsPublished(true);
            blog.setPublishedAt(LocalDateTime.now());
            Blog updatedBlog = blogRepository.save(blog);
            return ResponseEntity.ok(convertToDto(updatedBlog));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Hủy xuất bản blog
    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogDto> unpublishBlog(@PathVariable Long id) {
        Optional<Blog> existingBlog = blogRepository.findById(id);
        if (existingBlog.isPresent()) {
            Blog blog = existingBlog.get();
            blog.setIsPublished(false);
            Blog updatedBlog = blogRepository.save(blog);
            return ResponseEntity.ok(convertToDto(updatedBlog));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa blog
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        Optional<Blog> existingBlog = blogRepository.findById(id);
        if (existingBlog.isPresent()) {
            blogRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Chuyển đổi Blog Entity sang DTO
    private BlogDto convertToDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setFeaturedImage(blog.getFeaturedImage());
        dto.setIsPublished(blog.getIsPublished());
        dto.setViewCount(blog.getViewCount());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setPublishedAt(blog.getPublishedAt());
        
        if (blog.getAuthor() != null) {
            dto.setAuthor(new com.skincare.application.dto.UserDto(
                blog.getAuthor().getId(),
                blog.getAuthor().getUsername(),
                blog.getAuthor().getEmail(),
                blog.getAuthor().getFullName()));
        }
        
        if (blog.getTags() != null) {
            dto.setTags(blog.getTags().stream()
                .map(tag -> {
                    com.skincare.application.dto.TagDto tagDto = new com.skincare.application.dto.TagDto();
                    tagDto.setId(tag.getId());
                    tagDto.setName(tag.getName());
                    return tagDto;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // Cập nhật Entity từ DTO
    private void updateBlogFromDto(Blog blog, BlogDto dto) {
        blog.setTitle(dto.getTitle());
        blog.setContent(dto.getContent());
        blog.setFeaturedImage(dto.getFeaturedImage());
        
        // Xử lý tags nếu có
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            blog.getTags().clear();
            dto.getTags().forEach(tagDto -> {
                Optional<Tag> existingTag = tagRepository.findById(tagDto.getId());
                existingTag.ifPresent(tag -> blog.getTags().add(tag));
            });
        }
    }
}
