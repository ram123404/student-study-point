
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, FileText, BookMarked, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MOCK_RESOURCES } from "@/data/mockData";

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching resource data
    const foundResource = MOCK_RESOURCES.find((item) => item.id === Number(id));
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setResource(foundResource);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Get icon based on resource type
  const getIcon = () => {
    if (!resource) return null;
    
    switch (resource.type) {
      case "Notes":
        return <BookOpen className="h-6 w-6" />;
      case "Questions":
        return <FileText className="h-6 w-6" />;
      case "Syllabus":
        return <BookMarked className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  // Get color based on resource type
  const getColorClass = () => {
    if (!resource) return "";
    
    switch (resource.type) {
      case "Notes":
        return "bg-primary/10 text-primary";
      case "Questions":
        return "bg-secondary/10 text-secondary";
      case "Syllabus":
        return "bg-accent/10 text-accent";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse h-6 w-24 bg-gray-200 rounded-md mx-auto mb-4"></div>
            <div className="animate-pulse h-4 w-48 bg-gray-200 rounded-md mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
            <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/resources">Back to Resources</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
            <Link to="/resources" className="flex items-center text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
          {/* Resource Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getColorClass()}`}>
                {getIcon()}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold mb-2">{resource.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    Subject: {resource.subject}
                  </span>
                  <span className="flex items-center">
                    • Semester {resource.semester}
                  </span>
                  <span className="flex items-center">
                    • <Calendar className="h-4 w-4 mr-1" /> 
                    {new Date(resource.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <span className={`inline-block text-xs font-medium py-1 px-3 rounded-full ${getColorClass()}`}>
                {resource.type}
              </span>
            </div>
          </div>
          
          {/* Resource Content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{resource.description}</p>
          </div>
          
          {/* Additional Information (can be expanded) */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Format: PDF</li>
              <li>Size: 2.4 MB</li>
              <li>Pages: 45</li>
              <li>Language: English</li>
            </ul>
          </div>
          
          {/* Download Section */}
          <div className="border-t pt-6">
            <Button className="w-full sm:w-auto" asChild>
              <a href={resource.fileUrl} download>
                <Download className="mr-2 h-4 w-4" />
                Download Resource
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResourceDetail;
