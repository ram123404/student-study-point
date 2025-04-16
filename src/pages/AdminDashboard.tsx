
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, LogOut, Plus, BookOpen, Layers } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import ResourceTable from '@/components/admin/ResourceTable';
import ResourceForm from '@/components/admin/ResourceForm';
import ResourceFilter from '@/components/admin/ResourceFilter';
import FieldsManager from '@/components/admin/FieldsManager';
import SubjectsManager from '@/components/admin/SubjectsManager';
import { Resource } from '@/types/resource';
import { getResources, createResource, updateResource, deleteResource } from '@/services/mongodb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'Notes',
    subject: 'Computer Programming',
    semester: 1,
    fileUrl: '#',
    file: null,
    field: 'BCA'
  });

  const [filters, setFilters] = useState({
    type: '',
    subject: '',
    semester: '' as number | '',
    search: '',
    field: '',
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
        setFilteredResources(data);
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

  useEffect(() => {
    let result = [...resources];
    
    if (filters.field) {
      result = result.filter(resource => resource.field === filters.field);
    }
    
    if (filters.type) {
      result = result.filter(resource => resource.type === filters.type);
    }
    
    if (filters.subject) {
      result = result.filter(resource => resource.subject === filters.subject);
    }
    
    if (filters.semester !== '') {
      result = result.filter(resource => resource.semester === filters.semester);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredResources(result);
  }, [resources, filters]);

  const handleFilterChange = (filterType: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      subject: '',
      semester: '',
      search: '',
      field: '',
    });
  };

  const handleEditClick = (resource: Resource) => {
    console.log("Editing resource:", resource);
    setCurrentResource({...resource});
    setIsEditModalOpen(true);
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentResource) return;
    
    try {
      console.log("Updating resource:", currentResource);
      const updated = await updateResource(currentResource.id, currentResource);
      
      if (updated) {
        setResources(resources.map(resource => 
          resource.id === currentResource.id ? {...currentResource} : resource
        ));
        
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
    
    setIsEditModalOpen(false);
    setCurrentResource(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Creating new resource:", newResource);
      const created = await createResource({
        title: newResource.title,
        description: newResource.description,
        type: newResource.type,
        subject: newResource.subject,
        semester: newResource.semester,
        fileUrl: newResource.fileUrl || "#",
        field: newResource.field
      });
      
      setResources([created, ...resources]);
      
      toast({
        title: "Resource uploaded",
        description: "The resource has been successfully added.",
      });
      
      setIsUploadModalOpen(false);
      setNewResource({
        title: '',
        description: '',
        type: 'Notes',
        subject: 'Computer Programming',
        semester: 1,
        fileUrl: '#',
        file: null,
        field: 'BCA'
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive"
      });
    }
  };

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

  const handleNewResourceChange = (name: string, value: any) => {
    console.log(`Changing new resource ${name} to:`, value);
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditResourceChange = (name: string, value: any) => {
    if (currentResource) {
      console.log(`Changing current resource ${name} to:`, value);
      setCurrentResource(prev => ({
        ...prev!,
        [name]: value
      }));
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="container mx-auto px-6 py-10">
        <Tabs defaultValue="resources" className="bg-white rounded-lg shadow-md p-8 mx-4 sm:mx-8">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="resources" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              <span>Fields</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Subjects</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold">Manage Resources</h2>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            <ResourceFilter 
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              onReset={resetFilters}
              filters={filters}
            />

            {isLoading ? (
              <div className="text-center py-8">Loading resources...</div>
            ) : filteredResources.length > 0 ? (
              <ResourceTable 
                resources={filteredResources} 
                onEdit={handleEditClick} 
                onDelete={handleDelete} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                {resources.length > 0 
                  ? "No resources found with the current filters."
                  : "No resources found. Add your first resource using the \"Add Resource\" button."
                }
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="fields">
            <FieldsManager />
          </TabsContent>
          
          <TabsContent value="subjects">
            <SubjectsManager />
          </TabsContent>
        </Tabs>
      </main>

      {isUploadModalOpen && (
        <ResourceForm
          onSubmit={handleUpload}
          onCancel={() => setIsUploadModalOpen(false)}
          onChange={handleNewResourceChange}
          formTitle="Upload New Resource"
          submitLabel="Upload Resource"
        />
      )}

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
