import { Metadata } from 'next';
import StemSelector from './components/StemSelector';
import Navbar from './components/Navbar';
import AnimationWrapper from './components/AnimationWrapper';

export const metadata: Metadata = {
  title: 'SPLITTER - Split Music Into Studio-Quality Stems',
  description: 'Extract bass, drums, vocals, and more from any YouTube track in minutes. Professional-quality stems powered by state-of-the-art AI. Only $3 per split.',
  keywords: 'music stem separation, audio splitting, vocal isolation, drum extraction, bass isolation, AI music processing, Demucs',
  openGraph: {
    title: 'SPLITTER - Split Music Into Studio-Quality Stems',
    description: 'Extract bass, drums, vocals, and more from any YouTube track in minutes. Professional-quality stems powered by state-of-the-art AI.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center">
          {/* Static background elements */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          </div>
          
          <div className="container-max py-20 sm:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <AnimationWrapper animation="fadeIn" delay={200}>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-800/80">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Powered by AI
                </div>
              </AnimationWrapper>
              
              <AnimationWrapper animation="fadeInUp" delay={400}>
                <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Split Music Into
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Studio Stems
                  </span>
                </h1>
              </AnimationWrapper>
              
              <AnimationWrapper animation="fadeInUp" delay={600}>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Extract bass, drums, or vocals from any YouTube track in minutes. 
                  Professional-quality stems powered by state-of-the-art AI.
                </p>
              </AnimationWrapper>

              {/* Interactive form component */}
              <AnimationWrapper animation="scaleIn" delay={800}>
                <StemSelector />
              </AnimationWrapper>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="container-max pb-16 sm:pb-24">
          <AnimationWrapper animation="fadeInUp" triggerOnScroll={true}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Simple, fast, and professional. Get studio-quality stems in just three easy steps.
              </p>
            </div>
          </AnimationWrapper>
          <div className="grid gap-8 sm:grid-cols-3">
            <AnimationWrapper animation="slideInLeft" triggerOnScroll={true} delay={100}>
              <div className="relative card bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  1
                </div>
                <div className="pt-8">
                  <div className="text-4xl mb-4">🔗</div>
                  <div className="text-xl font-bold mb-2">Paste link</div>
                  <p className="text-gray-600 dark:text-gray-300">Drop a YouTube URL of a song or mix.</p>
                </div>
              </div>
            </AnimationWrapper>
            <AnimationWrapper animation="fadeInUp" triggerOnScroll={true} delay={200}>
              <div className="relative card bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  2
                </div>
                <div className="pt-8">
                  <div className="text-4xl mb-4">🎛️</div>
                  <div className="text-xl font-bold mb-2">Select stem</div>
                  <p className="text-gray-600 dark:text-gray-300">Choose Bass, Drums, or Vocals—one at a time.</p>
                </div>
              </div>
            </AnimationWrapper>
            <AnimationWrapper animation="slideInRight" triggerOnScroll={true} delay={300}>
              <div className="relative card bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  3
                </div>
                <div className="pt-8">
                  <div className="text-4xl mb-4">⚡</div>
                  <div className="text-xl font-bold mb-2">Split</div>
                  <p className="text-gray-600 dark:text-gray-300">We process with Demucs and deliver your stem.</p>
                </div>
              </div>
            </AnimationWrapper>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="container-max pb-16 sm:pb-24">
          <div className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 text-center border-2 border-blue-200 dark:border-gray-600 shadow-2xl">
            <h2 className="text-3xl font-bold mb-3">Simple Pricing</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Pay per split. No subscriptions, no hidden fees.</p>
            
            <div className="mb-8">
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$3</span>
                <span className="text-xl text-gray-600 dark:text-gray-300">per split</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  Studio-quality stems
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  5-10 minute processing
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  WAV format output
                </div>
              </div>
            </div>

            <button 
              className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg transition-all"
            >
              Start Splitting Now →
            </button>
          </div>
        </section>

        {/* Why Splitter? */}
        <section className="container-max pb-16 sm:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold mb-4">Why Splitter?</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">Fast turnaround</h3>
                <p className="text-gray-600 dark:text-gray-300">Get your stems in minutes, not hours. Our cloud pipeline is optimized for speed and reliability.</p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">Studio-grade quality</h3>
                <p className="text-gray-600 dark:text-gray-300">We use Demucs, a state-of-the-art AI model, to deliver clean, professional-quality stems for any genre.</p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-lg mb-2">No account required</h3>
                <p className="text-gray-600 dark:text-gray-300">Try your first split without signing up. No hassle, no spam—just music.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="container-max pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold">About Splitter</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Splitter is a minimalist tool for creators and musicians. We use Demucs, a state-of-the-art
              source separation model, to split songs into stems. Paste a link, choose a stem type, and you're done.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container-max pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <summary className="font-semibold cursor-pointer group-open:text-blue-600 dark:group-open:text-blue-400 py-2 flex items-center justify-between">
                  What is a stem?
                  <span className="text-2xl text-blue-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                  A stem is an isolated part of a song, such as vocals, drums, or bass. Splitter lets you extract one stem type from any track.
                </p>
              </details>
              <details className="card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <summary className="font-semibold cursor-pointer group-open:text-blue-600 dark:group-open:text-blue-400 py-2 flex items-center justify-between">
                  How long does splitting take?
                  <span className="text-2xl text-blue-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Most splits are ready in 1–3 minutes, depending on song length and server load.
                </p>
              </details>
              <details className="card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <summary className="font-semibold cursor-pointer group-open:text-blue-600 dark:group-open:text-blue-400 py-2 flex items-center justify-between">
                  What formats do you support?
                  <span className="text-2xl text-blue-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                  You can paste any public YouTube link. Output stems are delivered as high-quality WAV files.
                </p>
              </details>
              <details className="card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <summary className="font-semibold cursor-pointer group-open:text-blue-600 dark:group-open:text-blue-400 py-2 flex items-center justify-between">
                  Is my data private?
                  <span className="text-2xl text-blue-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Yes. We process your audio securely and never share your files. All tracks are deleted after processing.
                </p>
              </details>
              <details className="card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <summary className="font-semibold cursor-pointer group-open:text-blue-600 dark:group-open:text-blue-400 py-2 flex items-center justify-between">
                  Can I split multiple stem types at once?
                  <span className="text-2xl text-blue-600 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Currently, you can only select one stem type per split. To get multiple stems, you'll need to process the same song multiple times.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container-max py-10 text-sm text-gray-600 dark:text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Splitter. All rights reserved.</div>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

