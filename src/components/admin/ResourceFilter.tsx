
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import SearchInput from '@/components/resources/SearchInput';
import FieldSelector from '@/components/resources/FieldSelector';
import SubjectSelector from '@/components/resources/SubjectSelector';
import SemesterSelector from '@/components/resources/SemesterSelector';
import ResourceTypeSelector from '@/components/resources/ResourceTypeSelector';
import { useFields } from '@/hooks/useFields';

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
  const { fields } = useFields();
  
  // Get field name for display purposes
  const getFieldName = (fieldId: string): string => {
    const field = fields.find(f => f.id === fieldId);
    return field?.name || '';
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
      <div className="flex flex-col space-y-4">
        <SearchInput value={filters.search} onChange={onSearchChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <FieldSelector 
            value={filters.field || ''} 
            onChange={(value) => onFilterChange('field', value)} 
          />
          
          <ResourceTypeSelector 
            value={filters.type} 
            onChange={(value) => onFilterChange('type', value)}
          />
          
          <SubjectSelector 
            value={filters.subject} 
            onChange={(value) => onFilterChange('subject', value)}
            fieldId={filters.field}
            semester={typeof filters.semester === 'number' ? filters.semester : undefined}
          />
          
          <SemesterSelector 
            value={filters.semester} 
            onChange={(value) => onFilterChange('semester', value)}
          />
          
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
