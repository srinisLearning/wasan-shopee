import { Sparkles } from 'lucide-react'
import React from 'react'

const PublicHeader = () => {
  return (
    <>
     <section
        id="hero"
        className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden"
      >
        {/* Full-width Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')`,
          }}
          role="img"
          aria-label="Wasan Shopee Lifestyle Retail Store"
        />

        {/* Lighter Multi-stop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/40 to-slate-900/20" />

        {/* Subtle decorative radial glow */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[oklch(0.508_0.118_165.612)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Text Overlay Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-white w-full">
          <div className="max-w-3xl space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Welcome to Wasan Shopee</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/80 font-normal">
                Next-Gen Shopping
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
              Curated Elegance, Unbeatable Value &{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                Seamless Shopping
              </span>
            </h1>

            {/* About Project Narrative */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed text-balance">
              <strong className="text-white font-semibold">Wasan Shopee</strong>{" "}
              is your premier destination for handpicked fashion, smart
              electronics, home essentials, and lifestyle innovations. We unite
              authentic global brands, ethical sourcing, and lightning-fast
              fulfillment to bring a world-class retail experience right to your
              fingertips.
            </p>

            {/* Call to Action Buttons */}
            {/* <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#testimonials"
                className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-900/40 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-base group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#about"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-medium px-6 py-3.5 rounded-xl border border-white/30 backdrop-blur-md hover:border-white/50 active:scale-95 transition-all text-sm sm:text-base"
              >
                <span>About Our Platform</span>
              </Link>
            </div> */}

            {/* Value Proposition Micro Highlights */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15 text-white/90">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Free Express</p>
                  <p className="text-white/70">On orders ₹499+</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">100% Genuine</p>
                  <p className="text-white/70">Certified Brands</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">30-Day Return</p>
                  <p className="text-white/70">Doorstep Pickup</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Top Rated</p>
                  <p className="text-white/70">4.9 / 5 Rating</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default PublicHeader