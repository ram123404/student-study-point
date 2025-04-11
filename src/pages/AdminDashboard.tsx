
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, LogOut, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import ResourceTable from '@/components/admin/ResourceTable';
import ResourceForm from '@/components/admin/ResourceForm';
import { Resource } from '@/types/resource';
import { getResources, createResource, updateResource, deleteResource } from '@/services/mongodb';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: '',
    subject: '',
    semester: 1,
    file: null,
  });

  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast({
          title: "Error",
          description: "Failed to load resources",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [toast]);

  // Modal handler for editing resources
  const handleEditClick = (resource: Resource) => {
    setCurrentResource(resource);
    setIsEditModalOpen(true);
  };

  // Handle resource update
  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentResource) return;
    
    try {
      const updated = await updateResource(currentResource.id, currentResource);
      
      if (updated) {
        // Update resources list
        setResources(resources.map(resource => 
          resource.id === currentResource.id ? currentResource : resource
        ));
        
        // Show success message
        toast({
          title: "Resource updated",
          description: "The resource has been successfully updated.",
        });
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive"
      });
    }
    
    // Close modal
    setIsEditModalOpen(false);
    setCurrentResource(null);
  };

  // Handle new resource upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create new resource
      const created = await createResource({
        title: newResource.title,
        description: newResource.description,
        type: newResource.type || 'Notes',
        subject: newResource.subject,
        semester: newResource.semester,
        fileUrl: "#"
      });
      
      // Add to resources
      setResources([created, ...resources]);
      
      // Show success message
      toast({
        title: "Resource uploaded",
        description: "The resource has been successfully added.",
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive"
      });
    }
    
    // Close modal and reset form
    setIsUploadModalOpen(false);
    setNewResource({
      title: '',
      description: '',
      type: '',
      subject: '',
      semester: 1,
      file: null,
    });
  };

  // Handle delete resource
  const handleDelete = async (id: number) => {
    try {
      await deleteResource(id);
      setResources(resources.filter(resource => resource.id !== id));
      toast({
        title: "Resource deleted",
        description: "The resource has been removed.",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      });
    }
  };

  // Handle form field changes for new resource
  const handleNewResourceChange = (name: string, value: any) => {
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form field changes for editing resource
  const handleEditResourceChange = (name: string, value: any) => {
    if (currentResource) {
      setCurrentResource({
        ...currentResource,
        [name]: value
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/register')}
              className="hidden sm:flex"
            >
              Register New Admin
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Manage Resources</h2>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>

          {/* Resources table */}
          {isLoading ? (
            <div className="text-center py-8">Loading resources...</div>
          ) : resources.length > 0 ? (
            <ResourceTable 
              resources={resources} 
              onEdit={handleEditClick} 
              onDelete={handleDelete} 
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No resources found. Add your first resource using the "Add Resource" button.
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <ResourceForm
          onSubmit={handleUpload}
          onCancel={() => setIsUploadModalOpen(false)}
          onChange={handleNewResourceChange}
          formTitle="Upload New Resource"
          submitLabel="Upload Resource"
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && currentResource && (
        <ResourceForm
          resource={currentResource}
          onSubmit={handleUpdateResource}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentResource(null);
          }}
          onChange={handleEditResourceChange}
          formTitle="Edit Resource"
          submitLabel="Update Resource"
        />
      )}
    </div>
  );
};

export default AdminDashboard;
