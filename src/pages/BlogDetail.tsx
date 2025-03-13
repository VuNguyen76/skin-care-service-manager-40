
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { format } from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogApi.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !blog) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Link to="/blogs">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        {blog.featuredImage && (
          <div className="rounded-lg overflow-hidden mb-8 aspect-video">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
          {blog.author && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{blog.author.fullName || blog.author.username}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {blog.publishedAt 
                ? format(new Date(blog.publishedAt), 'MMM dd, yyyy') 
                : format(new Date(blog.createdAt), 'MMM dd, yyyy')}
            </span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <Tag className="h-4 w-4" />
              {blog.tags.map(tag => (
                <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="prose prose-lg max-w-none">
          {/* Render content safely - if it's HTML you may need to use dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogDetail;
