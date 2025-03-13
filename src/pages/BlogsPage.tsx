
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import MainLayout from "@/components/layout/MainLayout";
import { blogApi } from "@/services/api";
import { CalendarIcon, Clock, UserCircle, Eye, Tag } from "lucide-react";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // In production:
        // const blogsData = await blogApi.getAll({ published: true });
        
        // For demo, use mock data
        const mockBlogs = [
          {
            id: 1,
            title: "Ultimate Guide to Skincare Routine",
            content: "This comprehensive guide will walk you through the essential steps of a good skincare routine. Learn how to cleanse, exfoliate, and moisturize properly for radiant skin.",
            featuredImage: "https://placehold.co/600x400?text=Skincare+Routine",
            isPublished: true,
            viewCount: 1240,
            author: { fullName: "Emma Wilson" },
            tags: [{ id: 1, name: "Skincare" }, { id: 4, name: "Hydration" }],
            createdAt: "2023-08-15T14:22:33",
            publishedAt: "2023-08-16T09:10:00"
          },
          {
            id: 2,
            title: "10 Myths About Acne Treatment",
            content: "Many people believe these myths about acne treatment which can actually make your skin condition worse. We debunk the most common misconceptions about treating acne.",
            featuredImage: "https://placehold.co/600x400?text=Acne+Myths",
            isPublished: true,
            viewCount: 876,
            author: { fullName: "Michael Chang" },
            tags: [{ id: 2, name: "Acne" }, { id: 1, name: "Skincare" }],
            createdAt: "2023-09-05T16:45:12",
            publishedAt: "2023-09-06T10:30:00"
          },
          {
            id: 3,
            title: "Natural Ingredients for Sensitive Skin",
            content: "If you have sensitive skin, these natural ingredients can help soothe and nourish without causing irritation. Learn which plant-based products are gentle enough for reactive skin.",
            featuredImage: "https://placehold.co/600x400?text=Natural+Ingredients",
            isPublished: true,
            viewCount: 543,
            author: { fullName: "Sarah Johnson" },
            tags: [{ id: 1, name: "Skincare" }, { id: 6, name: "Natural Remedies" }],
            createdAt: "2023-10-01T11:20:45",
            publishedAt: "2023-10-02T09:15:30"
          },
          {
            id: 4,
            title: "The Science Behind Anti-Aging Products",
            content: "Understanding how anti-aging products work can help you make informed decisions about your skincare routine. Learn about retinoids, peptides, and antioxidants.",
            featuredImage: "https://placehold.co/600x400?text=Anti-aging+Science",
            isPublished: true,
            viewCount: 1120,
            author: { fullName: "Dr. Emma Wilson" },
            tags: [{ id: 3, name: "Anti-aging" }],
            createdAt: "2023-10-15T09:30:20",
            publishedAt: "2023-10-16T10:45:00"
          },
          {
            id: 5,
            title: "Sunscreen 101: Everything You Need to Know",
            content: "Protecting your skin from sun damage is one of the most important steps in any skincare routine. This guide covers different types of sunscreen and how to choose the right one.",
            featuredImage: "https://placehold.co/600x400?text=Sunscreen",
            isPublished: true,
            viewCount: 950,
            author: { fullName: "Michael Chang" },
            tags: [{ id: 5, name: "Sun Protection" }, { id: 1, name: "Skincare" }],
            createdAt: "2023-11-10T14:20:15",
            publishedAt: "2023-11-11T08:30:00"
          }
        ];
        
        setBlogs(mockBlogs);
        
        // Extract all unique tags
        const allTags = mockBlogs.reduce((acc, blog) => {
          blog.tags.forEach(tag => {
            if (!acc.some(t => t.id === tag.id)) {
              acc.push(tag);
            }
          });
          return acc;
        }, []);
        
        setTags(allTags);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Filter blogs based on search term and selected tag
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag ? blog.tags.some(tag => tag.id === selectedTag) : true;
    
    return matchesSearch && matchesTag;
  });

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Skincare Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Expert advice, tips, and insights for healthy skin
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-10 space-y-4">
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              onClick={() => setSelectedTag(null)}
            >
              All Topics
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTag === tag.id ? "default" : "outline"}
                onClick={() => setSelectedTag(tag.id)}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog posts */}
        {loading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
              </div>
            ) : (
              filteredBlogs.map((blog) => (
                <Card key={blog.id} className="flex flex-col h-full">
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={blog.featuredImage || "https://placehold.co/600x400?text=Blog+Post"} 
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.tags.map((tag) => (
                        <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <UserCircle className="h-4 w-4 mr-1" /> {blog.author.fullName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 line-clamp-3">{truncateContent(blog.content)}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{blog.viewCount} views</span>
                    </div>
                  </CardFooter>
                  <CardFooter className="pt-0">
                    <Link to={`/blogs/${blog.id}`} className="w-full">
                      <Button variant="outline" className="w-full">Read More</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogsPage;
