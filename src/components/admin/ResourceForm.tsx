
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from 'lucide-react';
import { Resource } from "@/types/resource";
import { supabase } from "@/lib/supabase";

interface ResourceFormProps {
  resource?: Resource;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (name: string, value: any) => void;
  formTitle: string;
  submitLabel: string;
}

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);
const RESOURCE_TYPES = ["Notes", "Questions", "Syllabus"];

const ResourceForm = ({
  resource,
  onSubmit,
  onCancel,
  onChange,
  formTitle,
  submitLabel
}: ResourceFormProps) => {
  const [formValues, setFormValues] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    type: resource?.type || RESOURCE_TYPES[0],
    subject: resource?.subject || '',
    semester: resource?.semester || SEMESTERS[0],
    fileUrl: resource?.fileUrl || '#',
    field: resource?.field || '',
    field_id: resource?.field_id || ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fields, setFields] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string; field_id: string; semester: number }[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    supabase.from("fields").select("*").order("name").then(({ data }) => {
      setFields(data || []);
      // If no initial value, set default
      if (!formValues.field && data && data[0]) {
        handleInputChange('field', data[0].name);
        handleInputChange('field_id', data[0].id);
      }
    });
    supabase.from("subjects").select("*").then(({ data }) => {
      setSubjects(data || []);
    });
    // eslint-disable-next-line
  }, []);

  // Update available subjects when field/semester change
  useEffect(() => {
    const selectedField = fields.find(f => f.name === formValues.field);
    let filtered = subjects;
    if (selectedField) {
      filtered = filtered.filter(sub => sub.field_id === selectedField.id);
    }
    if (formValues.semester) {
      filtered = filtered.filter(sub => sub.semester === formValues.semester);
    }
    setAvailableSubjects(filtered.map(s => ({ id: s.id, name: s.name })));
    if (formValues.subject && filtered.every(sub => sub.name !== formValues.subject)) {
      handleInputChange('subject', filtered[0]?.name || '');
    }
    // eslint-disable-next-line
  }, [formValues.field, formValues.semester, subjects, fields]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      handleInputChange('fileUrl', URL.createObjectURL(file));
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    onChange(name, value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{formTitle}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onCancel}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title
              </label>
              <Input
                value={formValues.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                placeholder="Enter resource title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <Textarea
                className="min-h-[100px]"
                value={formValues.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                placeholder="Enter resource description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Field of Study
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formValues.field}
                  onChange={(e) => {
                    handleInputChange('field', e.target.value);
                    const selected = fields.find(f => f.name === e.target.value);
                    if (selected) handleInputChange('field_id', selected.id);
                  }}
                  required
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.name}>{field.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formValues.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  required
                >
                  {RESOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Semester
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formValues.semester}
                  onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
                  required
                >
                  {SEMESTERS.map((semester) => (
                    <option key={semester} value={semester}>Semester {semester}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formValues.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                >
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-4">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">
                PDF, DOCX, PPT up to 10MB
              </p>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx,.ppt,.pptx"
                onChange={handleFileChange}
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
