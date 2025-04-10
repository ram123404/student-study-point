
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, BookMarked, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden resource-card transition-transform hover:shadow-lg h-full">
      <Link to={`/resources/${resource.id}`} className="block h-full">
        <div className="p-5 h-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2.5 rounded-md ${getColor()}`}>
                {getIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{resource.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">
                  {resource.subject} • Semester {resource.semester}
                </p>
              </div>
            </div>
            <span className={`text-xs font-medium py-1.5 px-2.5 rounded-full ${getColor()} ml-2 whitespace-nowrap`}>
              {resource.type}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Added on {new Date(resource.uploadDate).toLocaleDateString()}
            </span>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex items-center text-xs px-2 py-1 h-auto" asChild>
                <a href={resource.fileUrl} download onClick={(e) => e.stopPropagation()}>
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </a>
              </Button>
              <Button size="sm" variant="ghost" className="flex items-center text-xs px-2 py-1 h-auto" asChild>
                <Link to={`/resources/${resource.id}`} onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ResourceCard;
