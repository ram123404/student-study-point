
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const RESOURCE_TYPES = ["Notes", "Questions", "Syllabus"];

interface ResourceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const ResourceTypeSelector: React.FC<ResourceTypeSelectorProps> = ({ 
  value, 
  onChange, 
  label = "Type" 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          {RESOURCE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ResourceTypeSelector;
