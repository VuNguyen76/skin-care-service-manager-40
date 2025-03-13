
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { toast } from "sonner";

// Create a new API for blogs
const blogApi = {
  getAll: async () => {
    const response = await axios.get('/api/blogs');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`/api/blogs/${id}`);
    return response.data;
  },
  
  createBlog: async (blogData) => {
    const response = await axios.post('/api/blogs', blogData);
    return response.data;
  },
  
  updateBlog: async (id, blogData) => {
    const response = await axios.put(`/api/blogs/${id}`, blogData);
    return response.data;
  },
  
  deleteBlog: async (id) => {
    const response = await axios.delete(`/api/blogs/${id}`);
    return response.data;
  },
  
  publishBlog: async (id) => {
    const response = await axios.put(`/api/blogs/${id}/publish`);
    return response.data;
  },
  
  unpublishBlog: async (id) => {
    const response = await axios.put(`/api/blogs/${id}/unpublish`);
    return response.data;
  }
};

const BlogManagement = () => {
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    featuredImage: "",
    isPublished: false,
    tags: []
  });

  // Mock tags (in production, you would fetch from API)
  const availableTags = [
    { id: 1, name: "Skincare" },
    { id: 2, name: "Acne" },
    { id: 3, name: "Anti-aging" },
    { id: 4, name: "Hydration" },
    { id: 5, name: "Sun Protection" },
    { id: 6, name: "Natural Remedies" }
  ];

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // For demo purposes, create mock data
        // In production, use: const blogsData = await blogApi.getAll();
        const mockBlogs = [
          {
            id: 1,
            title: "Ultimate Guide to Skincare Routine",
            content: "This comprehensive guide will walk you through...",
            featuredImage: "https://example.com/image1.jpg",
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
            content: "Many people believe these myths about acne...",
            featuredImage: "https://example.com/image2.jpg",
            isPublished: true,
            viewCount: 876,
            author: { fullName: "Michael Chang" },
            tags: [{ id: 1, name: "Skincare" }, { id: 2, name: "Acne" }],
            createdAt: "2023-09-05T16:45:12",
            publishedAt: "2023-09-06T10:30:00"
          },
          {
            id: 3,
            title: "Natural Ingredients for Sensitive Skin",
            content: "If you have sensitive skin, these natural ingredients...",
            featuredImage: "https://example.com/image3.jpg",
            isPublished: false,
            viewCount: 0,
            author: { fullName: "Sarah Johnson" },
            tags: [{ id: 1, name: "Skincare" }, { id: 6, name: "Natural Remedies" }],
            createdAt: "2023-10-01T11:20:45",
            publishedAt: null
          }
        ];
        
        setBlogs(mockBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchBlogs();
    }
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleTagChange = (e) => {
    const tagId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData(prev => {
      const currentTags = [...prev.tags];
      
      if (isChecked) {
        // Add tag if it's not already in the array
        const tagToAdd = availableTags.find(tag => tag.id === tagId);
        if (tagToAdd && !currentTags.some(tag => tag.id === tagId)) {
          return {
            ...prev,
            tags: [...currentTags, tagToAdd]
          };
        }
      } else {
        // Remove tag
        return {
          ...prev,
          tags: currentTags.filter(tag => tag.id !== tagId)
        };
      }
      
      return prev;
    });
  };

  const handleAddEdit = (blog = null) => {
    if (blog) {
      setFormData({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        featuredImage: blog.featuredImage || "",
        isPublished: blog.isPublished,
        tags: blog.tags || []
      });
      setSelectedBlog(blog);
    } else {
      setFormData({
        id: null,
        title: "",
        content: "",
        featuredImage: "",
        isPublished: false,
        tags: []
      });
      setSelectedBlog(null);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      // In production: await blogApi.deleteBlog(selectedBlog.id);
      
      // Update local state
      setBlogs(prev => prev.filter(b => b.id !== selectedBlog.id));
      
      toast.success("Blog post deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setIsDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  const handlePublishToggle = async (blog) => {
    try {
      setLoading(true);
      
      // In production, use the appropriate API call:
      // const updatedBlog = blog.isPublished 
      //   ? await blogApi.unpublishBlog(blog.id)
      //   : await blogApi.publishBlog(blog.id);
      
      // For demo, we'll just update the local state
      const updatedBlog = {
        ...blog,
        isPublished: !blog.isPublished,
        publishedAt: !blog.isPublished ? new Date().toISOString() : null
      };
      
      setBlogs(prev => 
        prev.map(b => b.id === blog.id ? updatedBlog : b)
      );
      
      toast.success(`Blog post ${updatedBlog.isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In production, use the appropriate API call:
      // let response;
      // if (formData.id) {
      //   response = await blogApi.updateBlog(formData.id, formData);
      // } else {
      //   response = await blogApi.createBlog(formData);
      // }
      
      // For demo, we'll just update the local state
      const currentDate = new Date().toISOString();
      
      if (formData.id) {
        // Update existing blog
        const updatedBlog = {
          ...blogs.find(b => b.id === formData.id),
          ...formData,
          publishedAt: formData.isPublished ? currentDate : null
        };
        
        setBlogs(prev => 
          prev.map(b => b.id === formData.id ? updatedBlog : b)
        );
        
        toast.success("Blog post updated successfully");
      } else {
        // Create new blog
        const newBlog = {
          ...formData,
          id: blogs.length + 1,
          createdAt: currentDate,
          publishedAt: formData.isPublished ? currentDate : null,
          viewCount: 0,
          author: { fullName: "Current User" } // In production, get from logged in user
        };
        
        setBlogs(prev => [...prev, newBlog]);
        
        toast.success("Blog post created successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The hook will redirect
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage blog content for your customers</p>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Button>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No blog posts found. Create your first post.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">{blog.title}</TableCell>
                      <TableCell>{blog.author.fullName}</TableCell>
                      <TableCell>
                        {blog.isPublished ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Draft
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>{blog.viewCount}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handlePublishToggle(blog)}>
                          {blog.isPublished ? <Eye className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAddEdit(blog)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(blog)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={10}
                    showCharacterCount
                    maxCharacters={5000}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="featuredImage" className="text-sm font-medium">Featured Image URL</label>
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="grid grid-cols-3 gap-2 p-3 border rounded-md">
                    {availableTags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tag-${tag.id}`}
                          value={tag.id}
                          checked={formData.tags.some(t => t.id === tag.id)}
                          onChange={handleTagChange}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={`tag-${tag.id}`} className="text-sm">
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" size="sm" />}
                  {formData.id ? "Update" : "Create"} Post
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Blog Post</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={loading}>
                {loading && <Spinner className="mr-2" size="sm" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
