
package com.skincare.application.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogDto {
    private Long id;
    private String title;
    private String content;
    private String featuredImage;
    private Boolean isPublished;
    private Integer viewCount;
    private UserDto author;
    private List<TagDto> tags;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
}
