import { useNavigate } from "react-router-dom";
// Note: Ensure your global CSS includes these keyframes for 'animate-float' and 'animate-pulse-slow'

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#0a0a0c] text-white selection:bg-purple-500/30">
      
      {/* 🌌 HERO SECTION: Immersive Dark Mode with Mesh Gradients */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          {/* Enhanced Logo Container */}
          <div className="relative inline-block mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition duration-500"></div>
            <img
              src="/G Collab logo (2).png"
              alt="Code Palette Logo"
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/20 backdrop-blur-md p-1 transform group-hover:rotate-12 transition-transform duration-500"
            />
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">Code</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Palette</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Beyond just an editor. Experience the next generation of 
            <span className="text-white font-medium"> real-time collaborative engineering</span> for modern teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="group relative px-8 py-4 w-full sm:w-auto bg-white text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          
          </div>
        </div>
      </section>

      {/* 🧩 BENTO GRID FEATURES SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Engineered for speed.</h2>
          <p className="text-gray-500">Everything you need to ship code faster together.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
          {/* Feature 1: Large Bento Card */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121214] p-8 transition-all hover:border-purple-500/50">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Real-Time Sync</h3>
              <p className="text-gray-400 max-w-md">Zero-latency collaboration powered by WebSockets. See cursors move in real-time as your team types.</p>
            </div>
            <div className="mt-8 rounded-xl overflow-hidden border border-white/5">
                <img src="room.png" alt="Collaborative Coding Room" className="w-full grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>

          {/* Feature 2: Small Bento Card */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="h-1/2 group rounded-3xl border border-white/10 bg-[#121214] p-6 hover:border-blue-500/50 transition-all">
                <div className="w-10 h-10 mb-4 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">🔑</div>
                <h3 className="text-xl font-bold mb-2">Private Rooms</h3>
                <p className="text-sm text-gray-500">Secure AES-256 encrypted rooms for your private discussions.</p>
            </div>
            <div className="h-1/2 group rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-transparent p-6 hover:border-pink-500/50 transition-all">
                <div className="w-10 h-10 mb-4 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">💻</div>
                <h3 className="text-xl font-bold mb-2">Multi-Lang Support</h3>
                <p className="text-sm text-gray-500">Here 5 Languages supported: JavaScript, Python, C++, Go, Rust</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 TECHNOLOGY STACK: Floating Icons Style */}
      <section className="py-24 border-t border-white/5 bg-[#0d0d0f]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-gray-500 uppercase tracking-[0.2em] text-sm font-semibold mb-12">The Stack behind the Magic</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-60">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition cursor-default">
                <span className="text-2xl font-bold italic">REACT</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition cursor-default">
                <span className="text-2xl font-bold italic">TYPESCRIPT</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition cursor-default">
                <span className="text-2xl font-bold italic">WEBSOCKETS</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition cursor-default">
                <span className="text-2xl font-bold italic">TAILWIND</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🧾 FOOTER: Minimalist & Clean */}
      <footer className="border-t border-white/5 bg-[#0a0a0c] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">Code Palette</h3>
            <p className="text-gray-500 max-w-sm">The platform for the next generation of software engineers. Learn, collaborate, and build.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer transition">Editor</li>
              <li className="hover:text-white cursor-pointer transition">Room Sync</li>
              <li className="hover:text-white cursor-pointer transition">Extensions</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Social</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li className="hover:text-white cursor-pointer transition">GitHub</li>
              <li className="hover:text-white cursor-pointer transition">Discord</li>
              <li className="hover:text-white cursor-pointer transition">Twitter</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-600 border-t border-white/5 pt-8">
          © 2024 Code Palette. Designed for the Future of Coding.
        </div>
      </footer>
    </div>
  );
};

export default Intro;