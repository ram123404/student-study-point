
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from 'lucide-react';
import { RESOURCE_TYPES, SUBJECTS, SEMESTERS } from "@/data/mockData";
import { Resource } from "@/types/resource";

interface ResourceFormProps {
  resource?: Resource;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (name: string, value: any) => void;
  formTitle: string;
  submitLabel: string;
}

const ResourceForm = ({ 
  resource, 
  onSubmit, 
  onCancel, 
  onChange, 
  formTitle,
  submitLabel
}: ResourceFormProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{formTitle}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={resource?.title || ''}
                onChange={(e) => onChange('title', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                value={resource?.description || ''}
                onChange={(e) => onChange('description', e.target.value)}
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
                  value={resource?.type || RESOURCE_TYPES[0]}
                  onChange={(e) => onChange('type', e.target.value)}
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
                  value={resource?.subject || SUBJECTS[0]}
                  onChange={(e) => onChange('subject', e.target.value)}
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
                  value={resource?.semester || SEMESTERS[0]}
                  onChange={(e) => onChange('semester', parseInt(e.target.value))}
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
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select File
              </Button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
