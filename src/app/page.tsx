import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8 font-sans">
      <header className="mb-12 text-center animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Gen Fuel Monitor
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Modern dashboard for real-time fuel management and generator site analytics.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl animate-slide-up">
        <div className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:shadow-2xl hover:shadow-emerald-500/10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
            Real-time Monitoring
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            Live updates from generator sites including fuel levels and consumption trends.
          </p>
        </div>

        <div className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:shadow-2xl hover:shadow-blue-500/10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]"></span>
            Data Analytics
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            In-depth analysis of fuel efficiency and automated report generation.
          </p>
        </div>

        <div className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:shadow-2xl hover:shadow-purple-500/10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]"></span>
            API Integration
          </h2>
          <p className="text-neutral-400 leading-relaxed">
            Ready to consume data through a robust RESTful API layer.
          </p>
        </div>
      </main>

      <footer className="mt-16 text-neutral-500 space-x-6">
        <Link 
          href="/api/hello" 
          target="_blank"
          className="hover:text-emerald-400 transition-colors duration-200 underline decoration-neutral-800 underline-offset-4"
        >
          API Test
        </Link>
        <span className="opacity-20 cursor-default">|</span>
        <span className="cursor-default">Powered by Next.js & Prisma</span>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out 0.3s backwards; }
      `}} />
    </div>
  )
}
