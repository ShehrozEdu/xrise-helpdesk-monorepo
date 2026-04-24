import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@helpdesk/shared';

export const FilterBar: React.FC = () => {
  const { activeFilters, setFilter } = useUiStore();
  const [searchInput, setSearchInput] = useState(activeFilters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search', searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilter]);

  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-tabs" role="tablist">
        <button
          className={`filter-tab ${!activeFilters.status ? 'active' : ''}`}
          onClick={() => setFilter('status', undefined)}
        >
          All
        </button>
        {TICKET_STATUSES.map((status) => (
          <button
            key={status}
            className={`filter-tab ${activeFilters.status === status ? 'active' : ''}`}
            onClick={() => setFilter('status', status)}
          >
            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <select
        className="form-select"
        value={activeFilters.priority || ''}
        onChange={(e) => setFilter('priority', e.target.value || undefined)}
        style={{ width: 'auto', minWidth: '130px' }}
      >
        <option value="">All Priorities</option>
        {TICKET_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <div className="search-input">
        <Search />
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );
};
