'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Area = {
  id: string
  name: string
  slug: string
}

type BusinessFiltersProps = {
  areas: Area[]
}

export default function BusinessFilters({ areas }: BusinessFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get('status') || 'all'
  const currentFeatured = searchParams.get('featured') || 'all'
  const currentArea = searchParams.get('area') || 'all'

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/admin/businesses?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={currentStatus}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div>
          <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Status
          </label>
          <select
            id="featured"
            value={currentFeatured}
            onChange={(e) => updateFilter('featured', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Businesses</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured Only</option>
          </select>
        </div>

        {/* Area Filter */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
            Area
          </label>
          <select
            id="area"
            value={currentArea}
            onChange={(e) => updateFilter('area', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {(currentStatus !== 'all' || currentFeatured !== 'all' || currentArea !== 'all') && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => router.push('/admin/businesses')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
