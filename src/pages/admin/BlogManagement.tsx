
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/services/api";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Edit, Trash, Plus, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BlogManagement = () => {
  const queryClient = useQueryClient();
  const [blogFormData, setBlogFormData] = useState({
    id: null,
    title: "",
    content: "",
    featuredImage: "",
    tags: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch all blogs
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", "admin"],
    queryFn: () => blogApi.getAll({ published: null })
  });

  // Create blog mutation
  const createBlog = useMutation({
    mutationFn: (blogData) => blogApi.createBlog(blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post created successfully");
      resetForm();
      setDialogOpen(false);
    }
  });

  // Update blog mutation
  const updateBlog = useMutation({
    mutationFn: ({ id, blogData }) => blogApi.updateBlog(id, blogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post updated successfully");
      resetForm();
      setDialogOpen(false);
    }
  });

  // Delete blog mutation
  const deleteBlog = useMutation({
    mutationFn: (id) => blogApi.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post deleted successfully");
    }
  });

  // Publish/Unpublish blog mutation
  const publishBlog = useMutation({
    mutationFn: (id) => blogApi.publishBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post published successfully");
    }
  });

  const unpublishBlog = useMutation({
    mutationFn: (id) => blogApi.unpublishBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog post unpublished successfully");
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogFormData({
      ...blogFormData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && blogFormData.id) {
      updateBlog.mutate({ id: blogFormData.id, blogData: blogFormData });
    } else {
      createBlog.mutate(blogFormData);
    }
  };

  const handleEdit = (blog) => {
    setBlogFormData({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      featuredImage: blog.featuredImage,
      tags: blog.tags || []
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setBlogFormData({
      id: null,
      title: "",
      content: "",
      featuredImage: "",
      tags: []
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={blogFormData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={blogFormData.content}
                  onChange={handleInputChange}
                  required
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  name="featuredImage"
                  value={blogFormData.featuredImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button type="submit" className="w-full">
                {isEditing ? "Update" : "Create"} Blog Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.map((blog) => (
              <Card key={blog.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">{blog.title}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 overflow-hidden text-sm text-muted-foreground mb-4">
                    {blog.content.substring(0, 100)}...
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      {blog.isPublished ? (
                        <span className="text-green-600">Published</span>
                      ) : (
                        <span className="text-amber-600">Draft</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {blog.isPublished ? (
                        <Button variant="outline" size="sm" onClick={() => unpublishBlog.mutate(blog.id)}>
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => publishBlog.mutate(blog.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteBlog.mutate(blog.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.filter(blog => blog.isPublished).map((blog) => (
              <Card key={blog.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">{blog.title}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 overflow-hidden text-sm text-muted-foreground mb-4">
                    {blog.content.substring(0, 100)}...
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className="text-green-600">Published</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => unpublishBlog.mutate(blog.id)}>
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteBlog.mutate(blog.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.filter(blog => !blog.isPublished).map((blog) => (
              <Card key={blog.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium truncate">{blog.title}</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 overflow-hidden text-sm text-muted-foreground mb-4">
                    {blog.content.substring(0, 100)}...
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className="text-amber-600">Draft</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => publishBlog.mutate(blog.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteBlog.mutate(blog.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogManagement;
