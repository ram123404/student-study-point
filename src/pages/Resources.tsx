
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock data
const MOCK_RESOURCES = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Comprehensive notes covering C programming basics, control structures, and arrays.",
    type: "Notes",
    subject: "Computer Programming",
    semester: 1,
    uploadDate: "2023-09-15",
    fileUrl: "#",
  },
  {
    id: 2,
    title: "Digital Logic Question Bank",
    description: "Collection of past exam questions from 2018-2022 with detailed solutions.",
    type: "Questions",
    subject: "Digital Logic",
    semester: 1,
    uploadDate: "2023-08-25",
    fileUrl: "#",
  },
  {
    id: 3,
    title: "Mathematics I Syllabus",
    description: "Official syllabus for Mathematics I including course objectives and evaluation criteria.",
    type: "Syllabus",
    subject: "Mathematics I",
    semester: 1,
    uploadDate: "2023-10-05",
    fileUrl: "#",
  },
  {
    id: 4,
    title: "Data Structures Notes",
    description: "Complete notes on arrays, linked lists, stacks, queues, trees, and graphs.",
    type: "Notes",
    subject: "Data Structures and Algorithms",
    semester: 3,
    uploadDate: "2023-09-10",
    fileUrl: "#",
  },
  {
    id: 5,
    title: "Database Management Systems",
    description: "Lecture notes covering relational model, SQL, normalization, and transactions.",
    type: "Notes",
    subject: "Database Management Systems",
    semester: 4,
    uploadDate: "2023-07-20",
    fileUrl: "#",
  },
  {
    id: 6,
    title: "Object-Oriented Programming Past Papers",
    description: "Last 5 years question papers for OOP with Java programming examples.",
    type: "Questions",
    subject: "Object-Oriented Programming",
    semester: 3,
    uploadDate: "2023-08-05",
    fileUrl: "#",
  },
];

// Unique semesters, subjects and types from mock data
const semesters = Array.from(new Set(MOCK_RESOURCES.map(r => r.semester))).sort();
const subjects = Array.from(new Set(MOCK_RESOURCES.map(r => r.subject)));
const types = Array.from(new Set(MOCK_RESOURCES.map(r => r.type)));

const Resources = () => {
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const filteredSubjects = selectedSemester 
    ? Array.from(new Set(MOCK_RESOURCES
        .filter(r => r.semester === parseInt(selectedSemester))
        .map(r => r.subject)))
    : subjects;
  
  const filteredResources = MOCK_RESOURCES.filter(resource => {
    // Apply semester filter
    if (selectedSemester && resource.semester !== parseInt(selectedSemester)) {
      return false;
    }
    
    // Apply subject filter
    if (selectedSubject && resource.subject !== selectedSubject) {
      return false;
    }
    
    // Apply type filter
    if (selectedType && resource.type !== selectedType) {
      return false;
    }
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.subject.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const clearFilters = () => {
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedType("");
    setSearchQuery("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Browse Resources</h1>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              
              {/* Semester */}
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Subject */}
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={!selectedSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map(subj => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Resource Type */}
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Resource type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear filters button */}
            {(selectedSemester || selectedSubject || selectedType || searchQuery) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Results */}
          <div className="space-y-6">
            {filteredResources.length > 0 ? (
              <>
                <p className="text-gray-600">Showing {filteredResources.length} resources</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map(resource => (
                    <ResourceCard 
                      key={resource.id}
                      resource={resource}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600">Try changing your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
