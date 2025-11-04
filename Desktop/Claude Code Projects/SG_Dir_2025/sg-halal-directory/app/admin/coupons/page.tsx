import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getCoupons } from '@/app/actions/admin'
import CouponForm from './components/CouponForm'
import CouponsTable from './components/CouponsTable'

export const metadata = {
  title: 'Coupon Management | Admin',
  description: 'Create and manage promotional coupon codes',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
    "max-snippet": -1,
    "max-image-preview": "none",
    "max-video-preview": -1,
  },
}

export default async function AdminCouponsPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/login?redirect=/admin/coupons')
  }

  // Check admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Fetch coupons data
  const coupons = await getCoupons()

  const activeCoupons = coupons.filter(c => c.is_active && (!c.valid_until || new Date(c.valid_until) > new Date()))
  const inactiveCoupons = coupons.filter(c => !c.is_active || (c.valid_until && new Date(c.valid_until) <= new Date()))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="mt-2 text-gray-600">
            Create and manage promotional discount codes for featured listings
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Coupons</p>
                <p className="text-2xl font-semibold text-gray-900">{activeCoupons.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Redeemed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {coupons.reduce((sum, c) => sum + c.times_used, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactive Coupons</p>
                <p className="text-2xl font-semibold text-gray-900">{inactiveCoupons.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Coupon Form */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Coupon</h2>
          <CouponForm />
        </section>

        {/* Active Coupons */}
        {activeCoupons.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Active Coupons ({activeCoupons.length})
            </h2>
            <CouponsTable coupons={activeCoupons} />
          </section>
        )}

        {/* Inactive Coupons */}
        {inactiveCoupons.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Inactive Coupons ({inactiveCoupons.length})
            </h2>
            <CouponsTable coupons={inactiveCoupons} />
          </section>
        )}

        {/* Empty State */}
        {coupons.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center mt-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No coupons created</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first promotional coupon code.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
