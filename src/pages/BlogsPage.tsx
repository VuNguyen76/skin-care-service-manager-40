
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ChevronRight } from "lucide-react";
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
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-gray-900">Our Skincare Journal</h1>
            <p className="text-lg text-gray-600">
              Expert advice and insights for your personalized skincare journey
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredBlogs?.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map(blog => (
              <div key={blog.id} className="group">
                {blog.featuredImage ? (
                  <div className="aspect-[4/3] overflow-hidden mb-5">
                    <img 
                      src={blog.featuredImage} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gray-100 mb-5 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                <div className="mb-2 flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {blog.publishedAt 
                      ? formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true }) 
                      : formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <h3 className="text-xl font-medium mb-3 group-hover:text-indigo-700 transition-colors">{blog.title}</h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                
                <Link 
                  to={`/blogs/${blog.id}`} 
                  className="text-indigo-600 font-medium inline-flex items-center border-b border-transparent hover:border-indigo-600 pb-1 transition-colors"
                >
                  Read More <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2 text-gray-900">No articles found</h3>
            <p className="text-gray-600">Try changing your search term</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogsPage;
