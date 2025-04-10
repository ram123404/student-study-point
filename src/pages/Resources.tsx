
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { MOCK_RESOURCES, SEMESTERS, SUBJECTS, RESOURCE_TYPES } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const Resources = () => {
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
    type: "",
    searchQuery: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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

            {/* Subject Filter */}
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
                {SUBJECTS.map((subject) => (
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            {resources.length} {resources.length === 1 ? "Resource" : "Resources"} Found
          </h2>
        </div>

        {/* Resource Cards */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No matching resources found.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
