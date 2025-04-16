
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, BookMarked, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Resource } from "@/types/resource";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden resource-card transition-all hover:shadow-lg hover:translate-y-[-2px] h-full">
      <Link to={`/resources/${resource.id}`} className="block h-full">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start space-x-3.5">
              <div className={`p-3 rounded-md ${getColor()}`}>
                {getIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{resource.title}</h3>
                <p className="text-gray-500 text-sm mt-1.5">
                  {resource.field && <span className="font-medium">{resource.field} • </span>}
                  {resource.subject} • Semester {resource.semester}
                </p>
              </div>
            </div>
            <span className={`text-xs font-medium py-1.5 px-3 rounded-full ${getColor()} ml-2 whitespace-nowrap`}>
              {resource.type}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-grow">
            {resource.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Added on {new Date(resource.uploadDate).toLocaleDateString()}
            </span>
            
            <div className="flex space-x-2.5">
              <Button size="sm" variant="outline" className="flex items-center text-xs px-3 py-1.5 h-8" asChild>
                <a href={resource.fileUrl} download onClick={(e) => e.stopPropagation()}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
              <Button size="sm" variant="ghost" className="flex items-center text-xs px-3 py-1.5 h-8" asChild>
                <Link to={`/resources/${resource.id}`} onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
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
