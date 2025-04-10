
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Upload, File, Plus, Trash2, Edit, LogOut } from "lucide-react";

// Import mock data from Resources.tsx
import { MOCK_RESOURCES } from "@/data/mockData";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");
  const [resourceToDelete, setResourceToDelete] = useState<number | null>(null);
  
  // For resource upload form
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    semester: "",
    subject: "",
    type: "",
    file: null as File | null,
  });
  
  // Unique semesters, subjects and types
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);
  const subjects = [
    "Computer Programming", 
    "Digital Logic", 
    "Mathematics I", 
    "Data Structures and Algorithms",
    "Database Management Systems",
    "Object-Oriented Programming",
    "Software Engineering",
    "Computer Networks",
  ];
  const types = ["Notes", "Questions", "Syllabus"];
  
  // Check if user is authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth !== "true") {
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  const handleUploadChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };
  
  const handleResourceUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!uploadForm.title || !uploadForm.description || !uploadForm.semester || 
        !uploadForm.subject || !uploadForm.type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadForm.file) {
      toast({
        title: "Validation Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    // Add new resource
    const newResource = {
      id: resources.length + 1,
      title: uploadForm.title,
      description: uploadForm.description,
      type: uploadForm.type,
      subject: uploadForm.subject,
      semester: parseInt(uploadForm.semester),
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: "#", // In a real app, this would be the uploaded file URL
    };
    
    setResources(prev => [...prev, newResource]);
    
    // Reset form
    setUploadForm({
      title: "",
      description: "",
      semester: "",
      subject: "",
      type: "",
      file: null,
    });
    
    toast({
      title: "Resource Uploaded",
      description: `Successfully uploaded ${uploadForm.title}`,
    });
  };
  
  const handleDeleteResource = (id: number) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
    setResourceToDelete(null);
    
    toast({
      title: "Resource Deleted",
      description: "The resource has been successfully deleted.",
    });
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything until we check authentication
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="resources">Manage Resources</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">All Resources</h2>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Type</TableHead>
                        <TableHead className="hidden md:table-cell">Subject</TableHead>
                        <TableHead className="hidden md:table-cell">Semester</TableHead>
                        <TableHead className="hidden md:table-cell">Upload Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.length > 0 ? (
                        resources.map(resource => (
                          <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.title}</TableCell>
                            <TableCell className="hidden md:table-cell">{resource.type}</TableCell>
                            <TableCell className="hidden md:table-cell">{resource.subject}</TableCell>
                            <TableCell className="hidden md:table-cell">{resource.semester}</TableCell>
                            <TableCell className="hidden md:table-cell">{resource.uploadDate}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setResourceToDelete(resource.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the resource.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setResourceToDelete(null)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteResource(resource.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No resources found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Upload New Resource</h2>
                
                <form onSubmit={handleResourceUpload} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Resource Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={uploadForm.title}
                          onChange={handleUploadChange}
                          placeholder="E.g., Data Structures Notes"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={uploadForm.description}
                          onChange={handleUploadChange}
                          placeholder="Brief description of the resource"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="file">Upload File (PDF, DOCX)</Label>
                        <div className="mt-1">
                          <label
                            htmlFor="file"
                            className="flex justify-center items-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none"
                          >
                            <span className="flex flex-col items-center space-y-2">
                              {uploadForm.file ? (
                                <>
                                  <File className="h-10 w-10 text-primary" />
                                  <span className="font-medium text-gray-600">
                                    {uploadForm.file.name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-gray-400" />
                                  <span className="font-medium text-gray-600">
                                    Drop files to upload or <span className="text-primary">browse</span>
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Supported formats: PDF, DOCX, PPTX
                                  </span>
                                </>
                              )}
                            </span>
                            <input
                              id="file"
                              name="file"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".pdf,.docx,.pptx"
                              required
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="semester">Semester</Label>
                        <Select 
                          name="semester" 
                          value={uploadForm.semester}
                          onValueChange={(value) => 
                            setUploadForm(prev => ({ ...prev, semester: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters.map(sem => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semester {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Select 
                          name="subject" 
                          value={uploadForm.subject}
                          onValueChange={(value) => 
                            setUploadForm(prev => ({ ...prev, subject: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="type">Resource Type</Label>
                        <Select 
                          name="type" 
                          value={uploadForm.type}
                          onValueChange={(value) => 
                            setUploadForm(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4">
                        <Button type="submit" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Upload Resource
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
