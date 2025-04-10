
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  FileText, 
  LogOut 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { MOCK_RESOURCES, SEMESTERS, SUBJECTS, RESOURCE_TYPES } from "@/data/mockData";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: RESOURCE_TYPES[0],
    subject: SUBJECTS[0],
    semester: SEMESTERS[0],
    file: null,
  });

  // Mock handler for uploading new resource
  const handleUpload = (e) => {
    e.preventDefault();
    
    // Create new resource with mock data
    const uploadedResource = {
      id: resources.length + 1,
      title: newResource.title,
      description: newResource.description,
      type: newResource.type,
      subject: newResource.subject,
      semester: newResource.semester,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: "#",
    };

    // Add to resources
    setResources([uploadedResource, ...resources]);
    
    // Show success message
    toast({
      title: "Resource uploaded",
      description: "The resource has been successfully added.",
    });
    
    // Close modal and reset form
    setIsUploadModalOpen(false);
    setNewResource({
      title: '',
      description: '',
      type: RESOURCE_TYPES[0],
      subject: SUBJECTS[0],
      semester: SEMESTERS[0],
      file: null,
    });
  };

  // Mock delete handler
  const handleDelete = (id) => {
    setResources(resources.filter(resource => resource.id !== id));
    toast({
      title: "Resource deleted",
      description: "The resource has been removed.",
    });
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Resources</h2>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>

          {/* Resources table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>{resource.type}</TableCell>
                    <TableCell>{resource.subject}</TableCell>
                    <TableCell>{resource.semester}</TableCell>
                    <TableCell>{resource.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(resource.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Upload New Resource</h3>
            
            <form onSubmit={handleUpload}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    value={newResource.description}
                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newResource.type}
                      onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                      required
                    >
                      {RESOURCE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newResource.subject}
                      onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                      required
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newResource.semester}
                      onChange={(e) => setNewResource({...newResource, semester: parseInt(e.target.value)})}
                      required
                    >
                      {SEMESTERS.map((semester) => (
                        <option key={semester} value={semester}>Semester {semester}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOCX, PPT up to 10MB
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload"
                    accept=".pdf,.docx,.ppt,.pptx" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    Select File
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Upload Resource
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
