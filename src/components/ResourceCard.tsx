
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, BookMarked } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  semester: number;
  uploadDate: string;
  fileUrl: string;
}

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  // Get appropriate icon based on resource type
  const getIcon = () => {
    switch (resource.type) {
      case "Notes":
        return <BookOpen className="h-5 w-5" />;
      case "Questions":
        return <FileText className="h-5 w-5" />;
      case "Syllabus":
        return <BookMarked className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Get appropriate color based on resource type
  const getColor = () => {
    switch (resource.type) {
      case "Notes":
        return "text-primary bg-primary/10";
      case "Questions":
        return "text-secondary bg-secondary/10";
      case "Syllabus":
        return "text-accent bg-accent/10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden resource-card">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-md ${getColor()}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{resource.title}</h3>
              <p className="text-gray-500 text-sm">
                {resource.subject} • Semester {resource.semester}
              </p>
            </div>
          </div>
          <span className={`text-xs font-medium py-1 px-2 rounded-full ${getColor()}`}>
            {resource.type}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Added on {new Date(resource.uploadDate).toLocaleDateString()}
          </span>
          
          <Button size="sm" variant="outline" asChild>
            <a href={resource.fileUrl} download>
              <Download className="mr-1 h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
