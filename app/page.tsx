import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AISource</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#docs" className="text-gray-600 hover:text-gray-900">Docs</a>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Demo
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Track AI Traffic That<br />
            <span className="text-blue-600">Google Analytics Misses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The first analytics platform specifically built to identify and track traffic from ChatGPT, Claude, Perplexity, and 10+ AI sources. Get the insights you need to optimize for the AI-driven web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
            >
              View Live Demo
            </Link>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-gray-500 mb-8">Trusted by 500+ websites to track their AI traffic</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">2.3M+</div>
              <div className="text-gray-600">AI visits tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">15%</div>
              <div className="text-gray-600">Average AI traffic share</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">12+</div>
              <div className="text-gray-600">AI sources detected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Analytics Are Blind to AI Traffic
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Traditional analytics tools weren't built for the AI era. Here's what you're missing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">✗</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">AI Traffic Shows as "Direct"</h3>
                    <p className="text-gray-600">Google Analytics categorizes most AI referrals as direct traffic, hiding your fastest-growing traffic source.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">✗</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">No AI Source Breakdown</h3>
                    <p className="text-gray-600">Which AI platform drives your traffic? ChatGPT? Claude? You'll never know with traditional tools.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">✗</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Missing Content Insights</h3>
                    <p className="text-gray-600">Don't know which content AI models cite most. Miss opportunities to create more AI-friendly content.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <h3 className="font-semibold text-gray-900 mb-4">Typical Analytics Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Direct</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Google Search</span>
                  <span className="font-semibold">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social Media</span>
                  <span className="font-semibold">18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Other</span>
                  <span className="font-semibold">5%</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Hidden:</strong> 15-25% of "Direct" traffic is actually from AI sources
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Track AI Traffic
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get complete visibility into your AI-driven traffic with enterprise-grade analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">12+ AI Sources</h3>
              <p className="text-gray-600">
                Tracks ChatGPT, Claude, Perplexity, Gemini, Copilot, and growing list of AI platforms
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                &lt;2KB tracking script loads instantly without impacting your site performance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">
                See AI traffic insights instantly with beautiful dashboards and detailed breakdowns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free, scale as you grow. No surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 border">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for personal projects</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Up to 10,000 page views/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  1 website
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  All AI sources
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Basic analytics
                </li>
              </ul>
              <Link
                href="/signup?plan=free"
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Up to 100,000 page views/month
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  5 websites
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Advanced analytics & trends
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Email reports
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition text-center block"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8 border">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Unlimited page views
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Unlimited websites
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Custom analytics & API
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Dedicated support
                </li>
              </ul>
              <Link
                href="/contact"
                className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to See Your AI Traffic?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of websites already tracking their AI referrals with AISource.
          </p>
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-8 text-left max-w-2xl mx-auto">
            {'<script src="https://aisource.app/track.js" data-site="your-site-id"></script>'}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}