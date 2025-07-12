import React, { useState } from 'react';
import { Search, MapPin, Clock, Filter, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search by skill, location, or name...", filters = false }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    skill: '',
    availability: '',
    college: '',
    company: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, activeFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onSearch(query, newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({
      location: '',
      skill: '',
      availability: '',
      college: '',
      company: ''
    });
    onSearch(query, {});
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={placeholder}
          />
          <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
            {filters && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filters Panel */}
      {filters && showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <MapPin className="h-3 w-3 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={activeFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City, State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Skill Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Skill
              </label>
              <select
                value={activeFilters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Skills</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Node.js">Node.js</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <Clock className="h-3 w-3 inline mr-1" />
                Availability
              </label>
              <select
                value={activeFilters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Any Time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>

            {/* College Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                College
              </label>
              <input
                type="text"
                value={activeFilters.college}
                onChange={(e) => handleFilterChange('college', e.target.value)}
                placeholder="University name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={activeFilters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                placeholder="Company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {key}: {value}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;