
import React, { useState } from 'react';
import { MOCK_RESOURCES, SUBJECTS, SEMESTERS, Resource } from '../data/resources';

const Resources: React.FC = () => {
  const [semester, setSemester] = useState<number | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [type, setType] = useState<Resource['type'] | ''>('');

  const filteredResources = MOCK_RESOURCES.filter(resource => 
    (!semester || resource.semester === semester) &&
    (!subject || resource.subject === subject) &&
    (!type || resource.type === type)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Academic Resources</h1>
      
      <div className="flex space-x-4 mb-6">
        <select 
          value={semester} 
          onChange={(e) => setSemester(e.target.value ? Number(e.target.value) : '')}
          className="border rounded p-2 w-full"
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        <select 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as Resource['type'] | '')}
          className="border rounded p-2 w-full"
        >
          <option value="">All Types</option>
          <option value="Notes">Notes</option>
          <option value="Questions">Questions</option>
          <option value="Syllabus">Syllabus</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <div 
            key={resource.id} 
            className="border rounded p-4 hover:shadow-md transition-shadow"
          >
            <h2 className="font-bold text-lg mb-2">{resource.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{resource.subject}</span>
              <span>Semester {resource.semester}</span>
            </div>
            <button 
              onClick={() => window.open(resource.fileUrl, '_blank')}
              className="mt-2 w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
