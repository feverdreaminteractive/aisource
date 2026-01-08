'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Site } from '../../lib/types'
import { getUserSites, supabase } from '../../lib/supabase'

export default function SitesPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newSite, setNewSite] = useState({ domain: '', name: '' })
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadSites()
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, isSignedIn])

  async function loadSites() {
    try {
      setLoading(true)
      console.log('Loading sites...')

      if (!user?.id) {
        console.log('No user ID available')
        setSites([])
        return
      }

      const userSites = await getUserSites(user.id)
      console.log('Loaded sites:', userSites)
      setSites(userSites || [])
    } catch (error) {
      console.error('Error loading sites:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addSite() {
    if (!newSite.domain || !newSite.name || !user?.id) return

    try {
      setAdding(true)
      console.log('Adding site:', newSite)

      // Generate a unique site ID (same logic as API)
      const siteId = `site_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`

      const newSiteData = {
        id: siteId,
        domain: newSite.domain.replace(/^https?:\/\//, '').replace(/\/$/, ''), // Clean domain
        name: newSite.name,
        owner_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: site, error } = await supabase
        .from('sites')
        .insert(newSiteData)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Failed to create site: ${error.message}`)
      }

      console.log('Site created:', site)
      setSites([site, ...sites])
      setNewSite({ domain: '', name: '' })
    } catch (error) {
      console.error('Error adding site:', error)
      alert(`Error adding site: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setAdding(false)
    }
  }

  function getTrackingScript(siteId: string) {
    return `<script src="https://aisource-kappa.vercel.app/track.js" data-site="${siteId}"></script>`
  }

  async function copyScript(script: string, siteId: string) {
    try {
      await navigator.clipboard.writeText(script)
      setCopiedScript(siteId)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (error) {
      console.error('Failed to copy script:', error)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Sites</h1>
          <p className="text-gray-600 mb-8">Sign in to manage your tracking sites</p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Sites</h1>
              <p className="text-gray-600">Add sites and get tracking scripts</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add New Site */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Site</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <input
                id="domain"
                type="text"
                value={newSite.domain}
                onChange={(e) => setNewSite({ ...newSite, domain: e.target.value })}
                placeholder="example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                id="name"
                type="text"
                value={newSite.name}
                onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                placeholder="My Website"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <button
                onClick={addSite}
                disabled={adding || !newSite.domain || !newSite.name}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {adding ? 'Adding...' : 'Add Site'}
              </button>
            </div>
          </div>
        </div>

        {/* Sites List */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Your Sites ({sites.length})</h2>

          {sites.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <p className="text-gray-600 mb-4">No sites added yet</p>
              <p className="text-sm text-gray-500">Add your first site above to get started with AI traffic tracking</p>
            </div>
          ) : (
            sites.map((site) => {
              const script = getTrackingScript(site.id)

              return (
                <div key={site.id} className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                      <p className="text-gray-600">{site.domain}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {new Date(site.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {site.id}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tracking Script
                      </label>
                      <button
                        onClick={() => copyScript(script, site.id)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition"
                      >
                        {copiedScript === site.id ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded border font-mono text-sm text-gray-800 overflow-x-auto">
                      {script}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Add this script to the &lt;head&gt; section of your website to start tracking AI referrals
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Getting Started */}
        {sites.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Copy the tracking script for your site</li>
              <li>• Add it to your website's &lt;head&gt; section</li>
              <li>• Share your site in AI tools (ChatGPT, Claude, etc.) to generate traffic</li>
              <li>• Check your <Link href="/dashboard" className="text-blue-600 hover:underline">dashboard</Link> to see AI referrals</li>
            </ul>
          </div>
        )}

        {/* Legal Information */}
        <div className="mt-8 bg-gray-50 p-6 rounded-xl">
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} AISource. All rights reserved.
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <button className="text-gray-600 hover:text-gray-900">Privacy Policy</button>
              <button className="text-gray-600 hover:text-gray-900">Terms of Service</button>
              <button className="text-gray-600 hover:text-gray-900">Contact</button>
            </div>
            <div className="text-xs text-gray-500 max-w-2xl mx-auto">
              Track AI traffic that Google Analytics misses. Monitor referrals from ChatGPT, Claude, and other AI tools.
              By using this service, you agree to our data collection practices for analytics purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}