import React, { useState } from 'react';

        const EmailSearch = ({ onSearch }) => {
          const [searchTerm, setSearchTerm] = useState('');
          const [filterType, setFilterType] = useState('subject');

          const handleSearchChange = (event) => {
            setSearchTerm(event.target.value);
          };

          const handleFilterChange = (event) => {
            setFilterType(event.target.value);
          };

          const handleSubmit = (event) => {
            event.preventDefault();
            onSearch(searchTerm, filterType);
          };

          return (
            <form onSubmit={handleSubmit} className="search-bar">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <select value={filterType} onChange={handleFilterChange} className="filter-select">
                <option value="subject">Subject</option>
                <option value="sender">Sender</option>
                <option value="body">Body</option>
              </select>
              <button type="submit">Search</button>
            </form>
          );
        };

        export default EmailSearch;
