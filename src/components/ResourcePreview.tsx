
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Resource } from "@/types/resource";

interface ResourcePreviewProps {
  resource: Resource;
  onClose: () => void;
}

const ResourcePreview = ({ resource, onClose }: ResourcePreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // This would be dynamically determined based on the actual document

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Determine file type to render appropriate preview
  const getFileType = () => {
    const fileUrl = resource.fileUrl.toLowerCase();
    if (fileUrl.endsWith('.pdf')) return 'pdf';
    if (fileUrl.endsWith('.docx') || fileUrl.endsWith('.doc')) return 'doc';
    if (fileUrl.endsWith('.ppt') || fileUrl.endsWith('.pptx')) return 'ppt';
    return 'unknown';
  };

  const fileType = getFileType();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{resource.title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-auto p-4 bg-gray-100">
            {fileType === 'pdf' ? (
              <iframe 
                src={`${resource.fileUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-0"
                title={resource.title}
              />
            ) : fileType === 'doc' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="mb-4">Preview for Word documents is limited. Please download for best experience.</p>
                  <img 
                    src="/placeholder.svg" 
                    alt="Document preview" 
                    className="w-1/2 mx-auto mb-4 opacity-50"
                  />
                </div>
              </div>
            ) : fileType === 'ppt' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="mb-4">Preview for PowerPoint presentations is limited. Please download for best experience.</p>
                  <img 
                    src="/placeholder.svg" 
                    alt="Presentation preview" 
                    className="w-1/2 mx-auto mb-4 opacity-50"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p>Preview not available for this file type.</p>
                  <img 
                    src="/placeholder.svg" 
                    alt="No preview" 
                    className="w-1/2 mx-auto my-4 opacity-50"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t flex justify-between items-center bg-white">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button asChild>
              <a href={resource.fileUrl} download>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreview;
