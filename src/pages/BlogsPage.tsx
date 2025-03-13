
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const BlogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", "published"],
    queryFn: () => blogApi.getAll({ published: true }),
  });

  const filteredBlogs = blogs?.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Blog Articles</h1>
          <p className="text-muted-foreground">
            Explore our latest articles about skincare tips, treatments, and wellness advice
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredBlogs?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map(blog => (
              <Card key={blog.id} className="overflow-hidden flex flex-col">
                {blog.featuredImage && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {blog.publishedAt 
                        ? formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true }) 
                        : formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link to={`/blogs/${blog.id}`}>
                    <Button>Read More</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No articles found</h3>
            <p className="text-muted-foreground">Try changing your search term</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogsPage;
