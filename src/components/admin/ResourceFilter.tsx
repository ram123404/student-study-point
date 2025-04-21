
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEMESTERS } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

const RESOURCE_TYPES = ["Notes", "Questions", "Syllabus"];

interface ResourceFilterProps {
  onFilterChange: (filterType: string, value: string | number) => void;
  onSearchChange: (searchTerm: string) => void;
  onReset: () => void;
  filters: {
    type: string;
    subject: string;
    semester: number | '';
    search: string;
    field?: string;
  };
}

const ResourceFilter = ({
  onFilterChange,
  onSearchChange,
  onReset,
  filters
}: ResourceFilterProps) => {
  const [fields, setFields] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string; field_id: string; semester: number }[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    supabase.from("fields").select("*").order("name").then(({ data }) => {
      setFields(data || []);
    });
    supabase.from("subjects").select("*").then(({ data }) => {
      setSubjects(data || []);
    });
  }, []);

  useEffect(() => {
    let filtered = subjects;
    if (filters.field) {
      filtered = filtered.filter(s => s.field_id === filters.field);
    }
    if (filters.semester) {
      filtered = filtered.filter(s => s.semester === filters.semester);
    }
    setAvailableSubjects(filtered.map(({ id, name }) => ({ id, name })));
  }, [filters.field, filters.semester, subjects]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search resources..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Field of Study</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.field || ""}
              onChange={(e) => onFilterChange('field', e.target.value)}
            >
              <option value="">All Fields</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Subject</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.subject}
              onChange={(e) => onFilterChange('subject', e.target.value)}
            >
              <option value="">All Subjects</option>
              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Semester</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.semester}
              onChange={(e) => onFilterChange('semester', e.target.value ? parseInt(e.target.value) : '')}
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map((semester) => (
                <option key={semester} value={semester}>Semester {semester}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFilter;
