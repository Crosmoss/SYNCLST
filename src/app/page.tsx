import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const authResult = await auth()
  
  if (authResult.userId) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 absolute top-0 left-0 right-0 z-10">
        <div className="text-2xl font-black text-white">Listify</div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm text-white/80 hover:text-white">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-white text-violet-700 text-sm px-4 py-2 rounded-full font-bold hover:bg-violet-50 transition"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500 flex flex-col items-center text-center px-6 pt-40 pb-32 gap-6">
        <div className="bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full backdrop-blur-sm">
          ✦ AI-powered reseller platform
        </div>
        <h1 className="text-6xl font-black text-white max-w-3xl leading-tight">
          Upload a photo.<br />AI does the rest.
        </h1>
        <p className="text-xl text-white/80 max-w-xl">
          Listify turns your product photos into optimized listings across every marketplace — in seconds, not hours.
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            href="/sign-up"
            className="bg-white text-violet-700 px-8 py-4 rounded-full font-black text-lg hover:bg-violet-50 transition shadow-2xl"
          >
            Start for free →
          </Link>
          <Link
            href="/sign-in"
            className="border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition"
          >
            Sign in
          </Link>
        </div>

        {/* Floating stats */}
        <div className="flex gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-black text-white">10x</div>
            <div className="text-white/70 text-sm">Faster listings</div>
          </div>
          <div className="w-px bg-white/20"/>
          <div className="text-center">
            <div className="text-3xl font-black text-white">90%</div>
            <div className="text-white/70 text-sm">Less manual work</div>
          </div>
          <div className="w-px bg-white/20"/>
          <div className="text-center">
            <div className="text-3xl font-black text-white">5+</div>
            <div className="text-white/70 text-sm">Marketplaces</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-4">
            Everything your reselling business needs
          </h2>
          <p className="text-center text-gray-500 mb-16 text-lg">One platform. Every tool. Zero manual work.</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '📸', title: 'Photo to listing', desc: 'Upload any photo and AI instantly generates a title, description, price, and category.' },
              { icon: '🛍️', title: 'Multi-platform', desc: 'Crosslist to eBay, Depop, Mercari, and more with one click. No copy-pasting.' },
              { icon: '📈', title: 'Smart pricing', desc: 'AI monitors the market and suggests the optimal price to sell faster and earn more.' },
              { icon: '🤖', title: 'Auto-sync inventory', desc: 'Sold something? Listify automatically delists it everywhere so you never oversell.' },
              { icon: '💬', title: 'AI buyer replies', desc: 'Let AI handle buyer questions and offers so you focus on sourcing, not messaging.' },
              { icon: '🔥', title: 'Trend detection', desc: 'Know what\'s selling before everyone else. AI spots trends so you source smarter.' },
            ].map((f) => (
              <div key={f.title} className="group bg-white rounded-2xl p-8 border hover:border-violet-300 hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-16 rounded-3xl bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500 py-20 px-6 flex flex-col items-center text-center gap-6">
        <h2 className="text-4xl font-black text-white max-w-2xl">
          Ready to let AI run your reselling business?
        </h2>
        <p className="text-white/80 text-lg max-w-lg">
          Join thousands of resellers saving hours every week with Listify.
        </p>
        <Link
          href="/sign-up"
          className="bg-white text-violet-700 px-10 py-4 rounded-full font-black text-xl hover:bg-violet-50 transition shadow-xl"
        >
          Get started free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-8 flex items-center justify-between text-sm text-gray-400">
        <div className="font-black text-violet-600 text-lg">Listify</div>
        <div>© 2026 Listify. All rights reserved.</div>
      </footer>

    </main>
  )
}