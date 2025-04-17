
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen, FileText, BookMarked, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getResourceById } from "@/services/mongodb";
import { Resource } from "@/types/resource";
import { useToast } from "@/components/ui/use-toast";
import ResourcePreview from "@/components/ResourcePreview";

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [fileInfo, setFileInfo] = useState({
    format: 'PDF',
    size: '0 KB',
    pages: 'Unknown',
    language: 'English'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        if (id) {
          console.log('Fetching resource with id:', id);
          const foundResource = await getResourceById(Number(id));
          console.log('Found resource:', foundResource);
          setResource(foundResource);
          
          // Get file information
          if (foundResource?.fileUrl) {
            try {
              const response = await fetch(foundResource.fileUrl, { method: 'HEAD' });
              const contentLength = response.headers.get('content-length');
              const contentType = response.headers.get('content-type');
              
              // Calculate file size
              let sizeText = 'Unknown';
              if (contentLength) {
                const sizeInBytes = parseInt(contentLength, 10);
                if (sizeInBytes < 1024) {
                  sizeText = `${sizeInBytes} B`;
                } else if (sizeInBytes < 1024 * 1024) {
                  sizeText = `${(sizeInBytes / 1024).toFixed(1)} KB`;
                } else {
                  sizeText = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
                }
              }
              
              // Determine format from content type or file extension
              let format = 'Unknown';
              if (contentType) {
                if (contentType.includes('pdf')) {
                  format = 'PDF';
                } else if (contentType.includes('word') || contentType.includes('docx')) {
                  format = 'Word Document';
                } else if (contentType.includes('powerpoint') || contentType.includes('pptx')) {
                  format = 'PowerPoint';
                } else if (contentType.includes('text')) {
                  format = 'Text';
                }
              } else {
                // Fallback to file extension
                const fileUrl = foundResource.fileUrl.toLowerCase();
                if (fileUrl.endsWith('.pdf')) format = 'PDF';
                else if (fileUrl.endsWith('.docx') || fileUrl.endsWith('.doc')) format = 'Word Document';
                else if (fileUrl.endsWith('.ppt') || fileUrl.endsWith('.pptx')) format = 'PowerPoint';
                else if (fileUrl.endsWith('.txt')) format = 'Text';
              }
              
              // Update file info
              setFileInfo({
                format: format,
                size: sizeText,
                pages: format === 'PDF' ? 'Multiple' : 'N/A',
                language: 'English' // Default language
              });
            } catch (error) {
              console.error('Error fetching file info:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
        toast({
          title: "Error",
          description: "Failed to load resource details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id, toast]);

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
        <main className="flex-grow container mx-auto px-6 sm:px-8 lg:px-12 py-8 flex items-center justify-center">
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
        <main className="flex-grow container mx-auto px-6 sm:px-8 lg:px-12 py-8 flex items-center justify-center">
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
      
      <main className="flex-grow container mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 pl-0 hover:bg-transparent">
            <Link to="/resources" className="flex items-center text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-8">
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
                    • {resource.field || "BCA"}
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
          
          {/* Additional Information (dynamic based on resource) */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Format: {fileInfo.format}</li>
              <li>Size: {fileInfo.size}</li>
              <li>Pages: {fileInfo.pages}</li>
              <li>Language: {fileInfo.language}</li>
            </ul>
          </div>
          
          {/* Download Section */}
          <div className="border-t pt-6 flex flex-wrap gap-3">
            <Button onClick={() => setShowPreview(true)} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            
            <Button asChild>
              <a href={resource.fileUrl} download>
                <Download className="mr-2 h-4 w-4" />
                Download Resource
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      {showPreview && resource && (
        <ResourcePreview 
          resource={resource} 
          onClose={() => setShowPreview(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ResourceDetail;
