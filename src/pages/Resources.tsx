
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { MOCK_RESOURCES, SEMESTERS, SUBJECTS, RESOURCE_TYPES } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Group subjects by semester
const getSubjectsBySemester = (semesterValue) => {
  if (!semesterValue) return SUBJECTS;
  
  // In a real app, you would fetch this from an API
  // For now, let's simulate semester-specific subjects
  const semesterNum = parseInt(semesterValue);
  
  // Create a simple mapping of subjects per semester
  const subjectMapping = {
    1: ["Computer Programming", "Digital Logic", "Mathematics I"],
    2: ["Object-Oriented Programming", "Mathematics II", "Web Development"],
    3: ["Data Structures and Algorithms", "Database Management Systems", "Software Engineering"],
    4: ["Computer Networks", "Operating Systems", "Computer Architecture"],
    5: ["Artificial Intelligence", "Mobile Application Development", "Computer Graphics"],
    6: ["Web Development", "Machine Learning", "Data Science"],
    7: ["Cloud Computing", "Big Data Analytics", "Information Security"],
    8: ["Project Work", "Internship", "Emerging Technologies"]
  };
  
  return subjectMapping[semesterNum] || SUBJECTS;
};

const Resources = () => {
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
    type: "",
    searchQuery: "",
  });
  const [availableSubjects, setAvailableSubjects] = useState(SUBJECTS);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 20;

  // Update available subjects when semester changes
  useEffect(() => {
    setAvailableSubjects(getSubjectsBySemester(filters.semester));
    
    // Reset subject filter if current subject is not available in the new semester
    if (filters.semester && filters.subject) {
      const newSubjects = getSubjectsBySemester(filters.semester);
      if (!newSubjects.includes(filters.subject)) {
        setFilters(prev => ({...prev, subject: ""}));
      }
    }
  }, [filters.semester]);

  // Apply filters
  useEffect(() => {
    let filteredResults = [...MOCK_RESOURCES];

    // Filter by semester
    if (filters.semester) {
      filteredResults = filteredResults.filter(
        (resource) => resource.semester === parseInt(filters.semester)
      );
    }

    // Filter by subject
    if (filters.subject) {
      filteredResults = filteredResults.filter(
        (resource) => resource.subject === filters.subject
      );
    }

    // Filter by type
    if (filters.type) {
      filteredResults = filteredResults.filter(
        (resource) => resource.type === filters.type
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredResults = filteredResults.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
      );
    }

    setResources(filteredResults);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      semester: "",
      subject: "",
      type: "",
      searchQuery: "",
    });
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Get current resources based on pagination
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = resources.slice(indexOfFirstResource, indexOfLastResource);

  // Calculate total pages
  const totalPages = Math.ceil(resources.length / resourcesPerPage);

  // Generate pagination links
  const generatePaginationLinks = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // When on early pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // When on later pages
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // When in the middle
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 gradient-heading">Academic Resources</h1>
          <p className="text-gray-600">
            Browse and download BCA study materials, past exam questions, notes, and syllabi.
          </p>
        </div>

        {/* Search & Filters Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              />
            </div>
            <div className="flex gap-2 self-end">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear Filters
              </Button>
              <Button 
                variant="outline" 
                onClick={toggleFilters} 
                className="md:hidden"
                size="sm"
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Semester Filter */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={filters.semester}
                onChange={(e) => handleFilterChange("semester", e.target.value)}
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter - Now dynamically updated based on semester */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                <option value="">All Subjects</option>
                {availableSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {resources.length} {resources.length === 1 ? "Resource" : "Resources"} Found
          </h2>
          {totalPages > 0 && (
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstResource + 1} to {Math.min(indexOfLastResource, resources.length)} of {resources.length} resources
            </p>
          )}
        </div>

        {/* Resource Cards */}
        {currentResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {currentResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg mb-8">
            <p className="text-gray-500 mb-4">No matching resources found.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {resources.length > 0 && totalPages > 1 && (
          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {generatePaginationLinks().map((page, index) => (
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
