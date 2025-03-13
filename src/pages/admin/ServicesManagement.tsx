
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { serviceApi, categoryApi } from "@/services/api";
import { toast } from "sonner";

const ServicesManagement = () => {
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    isActive: true,
    imageUrl: "",
    categories: []
  });

  // Fetch services and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          serviceApi.getAll(),
          categoryApi.getAll()
        ]);
        setServices(servicesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load services data");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData(prev => {
      const currentCategories = [...prev.categories];
      
      if (isChecked) {
        // Add category if it's not already in the array
        const categoryToAdd = categories.find(cat => cat.id === categoryId);
        if (categoryToAdd && !currentCategories.some(cat => cat.id === categoryId)) {
          return {
            ...prev,
            categories: [...currentCategories, categoryToAdd]
          };
        }
      } else {
        // Remove category
        return {
          ...prev,
          categories: currentCategories.filter(cat => cat.id !== categoryId)
        };
      }
      
      return prev;
    });
  };

  const handleAddEdit = (service = null) => {
    if (service) {
      setFormData({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        durationMinutes: service.durationMinutes.toString(),
        isActive: service.isActive,
        imageUrl: service.imageUrl || "",
        categories: service.categories || []
      });
      setSelectedService(service);
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        price: "",
        durationMinutes: "",
        isActive: true,
        imageUrl: "",
        categories: []
      });
      setSelectedService(null);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      // Note: This doesn't actually delete but marks as inactive in the backend
      await serviceApi.deleteService(selectedService.id);
      
      // Update local state
      setServices(prev => 
        prev.map(s => s.id === selectedService.id ? { ...s, isActive: false } : s)
      );
      
      toast.success("Service successfully deactivated");
    } catch (error) {
      console.error("Error deactivating service:", error);
      toast.error("Failed to deactivate service");
    } finally {
      setIsDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes)
      };
      
      let response;
      if (formData.id) {
        response = await serviceApi.updateService(formData.id, serviceData);
        setServices(prev => 
          prev.map(s => s.id === formData.id ? response : s)
        );
        toast.success("Service updated successfully");
      } else {
        response = await serviceApi.createService(serviceData);
        setServices(prev => [...prev, response]);
        toast.success("Service created successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
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
            <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            <p className="text-muted-foreground">Add, edit and manage your skincare services</p>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Service
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
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No services found. Add your first service.
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>${service.price.toFixed(2)}</TableCell>
                      <TableCell>{service.durationMinutes} minutes</TableCell>
                      <TableCell>
                        {service.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircle className="mr-1 h-3 w-3" /> Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {service.categories?.map((category) => (
                            <span key={category.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleAddEdit(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service)}>
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Service Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    showCharacterCount
                    maxCharacters={500}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="durationMinutes" className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      id="durationMinutes"
                      name="durationMinutes"
                      type="number"
                      min="5"
                      step="5"
                      value={formData.durationMinutes}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="http://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Categories</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          value={category.id}
                          checked={formData.categories.some(cat => cat.id === category.id)}
                          onChange={handleCategoryChange}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={`category-${category.id}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" size="sm" />}
                  {formData.id ? "Update" : "Create"} Service
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Deactivate Service</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to deactivate "{selectedService?.name}"? This service will be marked as inactive but not permanently deleted.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={loading}>
                {loading && <Spinner className="mr-2" size="sm" />}
                Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ServicesManagement;
