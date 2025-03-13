
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { specialistApi, serviceApi } from "@/services/api";
import { toast } from "sonner";

const SpecialistsManagement = () => {
  const { isLoading: authLoading, isAdmin } = useAdminAuth();
  const [specialists, setSpecialists] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    user: {
      fullName: "",
      email: "",
      phoneNumber: ""
    },
    specialization: "",
    bio: "",
    experience: "",
    certifications: "",
    services: []
  });

  // Fetch specialists and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specialistsData, servicesData] = await Promise.all([
          specialistApi.getAll(),
          serviceApi.getAll()
        ]);
        setSpecialists(specialistsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load specialists data");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setFormData(prev => {
      const currentServices = [...prev.services];
      
      if (isChecked) {
        // Add service if it's not already in the array
        const serviceToAdd = services.find(srv => srv.id === serviceId);
        if (serviceToAdd && !currentServices.some(srv => srv.id === serviceId)) {
          return {
            ...prev,
            services: [...currentServices, serviceToAdd]
          };
        }
      } else {
        // Remove service
        return {
          ...prev,
          services: currentServices.filter(srv => srv.id !== serviceId)
        };
      }
      
      return prev;
    });
  };

  const handleAddEdit = (specialist = null) => {
    if (specialist) {
      setFormData({
        id: specialist.id,
        user: {
          fullName: specialist.user.fullName,
          email: specialist.user.email,
          phoneNumber: specialist.user.phoneNumber || ""
        },
        specialization: specialist.specialization,
        bio: specialist.bio || "",
        experience: specialist.experience || "",
        certifications: specialist.certifications || "",
        services: specialist.services || []
      });
      setSelectedSpecialist(specialist);
    } else {
      setFormData({
        id: null,
        user: {
          fullName: "",
          email: "",
          phoneNumber: ""
        },
        specialization: "",
        bio: "",
        experience: "",
        certifications: "",
        services: []
      });
      setSelectedSpecialist(null);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (specialist) => {
    setSelectedSpecialist(specialist);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      // In production, call API to delete specialist
      // For demo, just update local state
      setSpecialists(prev => prev.filter(s => s.id !== selectedSpecialist.id));
      toast.success("Specialist removed successfully");
    } catch (error) {
      console.error("Error removing specialist:", error);
      toast.error("Failed to remove specialist");
    } finally {
      setIsDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In production, call API to save specialist
      // const response = formData.id 
      //   ? await specialistApi.updateSpecialist(formData.id, formData)
      //   : await specialistApi.createSpecialist(formData);
      
      // For demo, just update local state
      if (formData.id) {
        setSpecialists(prev => 
          prev.map(s => s.id === formData.id ? {
            ...s,
            ...formData,
            user: { ...s.user, ...formData.user }
          } : s)
        );
        toast.success("Specialist updated successfully");
      } else {
        const newSpecialist = {
          ...formData,
          id: specialists.length + 1,
          ratingAverage: 0,
          ratingCount: 0
        };
        setSpecialists(prev => [...prev, newSpecialist]);
        toast.success("Specialist added successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving specialist:", error);
      toast.error("Failed to save specialist");
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
            <h1 className="text-3xl font-bold tracking-tight">Specialists Management</h1>
            <p className="text-muted-foreground">Add and manage your skincare specialists</p>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Specialist
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
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No specialists found. Add your first specialist.
                    </TableCell>
                  </TableRow>
                ) : (
                  specialists.map((specialist) => (
                    <TableRow key={specialist.id}>
                      <TableCell className="font-medium">{specialist.user.fullName}</TableCell>
                      <TableCell>{specialist.specialization}</TableCell>
                      <TableCell>{specialist.experience}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{specialist.ratingAverage?.toFixed(1) || "-"}</span>
                          <span className="text-gray-400 text-xs ml-1">
                            ({specialist.ratingCount || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {specialist.services?.slice(0, 2).map((service) => (
                            <span key={service.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {service.name}
                            </span>
                          ))}
                          {specialist.services?.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{specialist.services.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleAddEdit(specialist)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(specialist)}>
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
              <DialogTitle>{formData.id ? "Edit Specialist" : "Add New Specialist"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="user.fullName" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="user.fullName"
                    name="user.fullName"
                    value={formData.user.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="user.email" className="text-sm font-medium">Email</label>
                  <Input
                    id="user.email"
                    name="user.email"
                    type="email"
                    value={formData.user.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="user.phoneNumber" className="text-sm font-medium">Phone Number</label>
                  <Input
                    id="user.phoneNumber"
                    name="user.phoneNumber"
                    value={formData.user.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="specialization" className="text-sm font-medium">Specialization</label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="experience" className="text-sm font-medium">Experience</label>
                  <Input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 5+ years"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="certifications" className="text-sm font-medium">Certifications</label>
                  <Textarea
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Services</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          value={service.id}
                          checked={formData.services.some(srv => srv.id === service.id)}
                          onChange={handleServiceChange}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={`service-${service.id}`} className="text-sm">
                          {service.name}
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
                  {formData.id ? "Update" : "Add"} Specialist
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Specialist</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to remove "{selectedSpecialist?.user?.fullName}" from your specialists?</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={loading}>
                {loading && <Spinner className="mr-2" size="sm" />}
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default SpecialistsManagement;
