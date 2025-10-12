'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { STATUS_FILTER_OPTIONS } from '@/firebase/services/constants';

interface SearchFilterBarProps {
  searchTerm: string;
  statusFilter: string;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onToggleFilters: () => void;
}

export function SearchFilterBar({
  searchTerm,
  statusFilter,
  showFilters,
  onSearchChange,
  onStatusFilterChange,
  onToggleFilters,
}: SearchFilterBarProps) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-h3 text-text-dark'>
            Search & Filter
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={onToggleFilters}
            className='cursor-pointer'
          >
            <Filter className='w-4 h-4 mr-2' />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </CardHeader>
      {showFilters && (
        <CardContent className='pt-0'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light w-4 h-4' />
                <Input
                  placeholder='Search jobs by title or company...'
                  value={searchTerm}
                  onChange={e => onSearchChange(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <div className='sm:w-48'>
              <select
                value={statusFilter}
                onChange={e => onStatusFilterChange(e.target.value)}
                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-dark cursor-pointer'
              >
                {STATUS_FILTER_OPTIONS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
