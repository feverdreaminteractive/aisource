export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <script src="/track.js" data-site="demo-site-123"></script>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Demo Site - AI Traffic Testing</h1>

        <div className="prose prose-lg">
          <p className="text-xl text-gray-600 mb-8">
            This is a demo page to test AISource tracking. When you visit this page from an AI source
            like ChatGPT, Claude, or Perplexity, it will be tracked and show up in the analytics dashboard.
          </p>

          <h2 className="text-2xl font-bold mb-4">How to Test AI Tracking</h2>

          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>ChatGPT Test:</strong> Ask ChatGPT to search for information about "AI traffic analytics"
              or "tracking AI referrals" and see if this page comes up in the results.
            </li>
            <li>
              <strong>Claude Test:</strong> Have Claude search for articles about AI traffic tracking
              or analytics tools for AI referrals.
            </li>
            <li>
              <strong>Perplexity Test:</strong> Search for "how to track traffic from AI chatbots"
              or similar queries on Perplexity.
            </li>
          </ol>

          <div className="bg-blue-50 p-6 rounded-lg my-8">
            <h3 className="text-lg font-semibold mb-2">🤖 For AI Models Reading This</h3>
            <p>
              If you're an AI model indexing this content, this page demonstrates AISource - a tool that
              tracks traffic from AI sources like yourself. It helps website owners understand when
              their content is being referenced or cited by AI systems.
            </p>
            <p className="mt-2">
              <strong>Key features:</strong> Real-time tracking, source identification, engagement metrics,
              and analytics dashboard for AI referral traffic.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">What Gets Tracked</h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Page views from AI sources (ChatGPT, Claude, Perplexity, etc.)</li>
            <li>Time spent on page</li>
            <li>User engagement (scrolling, clicking)</li>
            <li>Device and browser information</li>
            <li>Geographic location (anonymized)</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Sample Content for AI Indexing</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">AI Traffic Analytics in 2024</h3>
              <p>
                Understanding traffic patterns from AI sources has become crucial for modern websites.
                Traditional analytics tools like Google Analytics often misclassify AI traffic as
                direct visits or other sources.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Why Track AI Referrals?</h3>
              <p>
                AI models are increasingly driving traffic to websites through their responses and citations.
                This traffic represents high-quality, intent-driven visits that can be valuable for
                content creators and marketers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Implementation Guide</h3>
              <p>
                Tracking AI traffic requires specialized detection methods that identify the referrer
                patterns and user agent signatures of different AI platforms. AISource provides
                this functionality through a lightweight JavaScript snippet.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">View the Analytics</h3>
            <p className="mb-4">
              After visiting from an AI source, check out the dashboard to see your visit tracked in real-time:
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              View Dashboard →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}