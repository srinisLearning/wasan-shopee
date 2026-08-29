"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/services/products";
import { IProduct } from "@/interfaces";
import {
  ShoppingBag,
  LogIn,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  ThumbsUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Verified Buyer • Mumbai",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      title: "Exceptional quality and swift delivery!",
      comment:
        "Wasan Shopee has completely transformed my online shopping routine. The packaging was immaculate, customer support helped instantly, and the premium apparel quality exceeded my expectations. Will definitely shop again!",
      product: "Urban Chic Linen Set",
      date: "2 days ago",
      helpful: 48,
    },
    {
      id: 2,
      name: "Arjun Patel",
      role: "Verified Buyer • Bengaluru",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      title: "Best prices & 100% genuine products",
      comment:
        "I was skeptical about ordering high-end electronics online, but Wasan Shopee proved to be genuine, lightning-fast with 24-hour dispatch, and offers authentic brand warranties. Super satisfied with the service!",
      product: "Wireless Noise-Canceling Buds",
      date: "1 week ago",
      helpful: 35,
    },
    {
      id: 3,
      name: "Sarah Jenkins",
      role: "Verified Buyer • New Delhi",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      title: "Gorgeous curated aesthetic collection",
      comment:
        "The curated home living and lifestyle selection on Wasan Shopee is unmatched. Everything matches the high-definition photos accurately and arrived 2 days earlier than scheduled. Truly a 5-star experience!",
      product: "Artisan Ceramic Decor Vase",
      date: "2 weeks ago",
      helpful: 62,
    },
    {
      id: 4,
      name: "Rahul Verma",
      role: "Verified Buyer • Hyderabad",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      title: "Hassle-free returns and friendly support",
      comment:
        "I had to exchange a size for my footwear purchase and the exchange was picked up from my doorstep without any hassle. The smoothest return experience I have ever had on any ecommerce site!",
      product: "Aero Cushion Running Shoes",
      date: "3 weeks ago",
      helpful: 29,
    },
    {
      id: 5,
      name: "Ananya Iyer",
      role: "Verified Buyer • Pune",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      title: "Smooth checkout & top-tier discounts",
      comment:
        "Got unbelievable festival discounts with extra member coupons! The mobile experience is buttery smooth and tracking the order in real-time was super convenient.",
      product: "Smart Fitness Tracker Pro",
      date: "1 month ago",
      helpful: 41,
    },
    {
      id: 6,
      name: "David Miller",
      role: "Verified Buyer • Chennai",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      title: "My favorite digital marketplace",
      comment:
        "Wasan Shopee brings together premium authenticity, clean design, and prompt customer care. The product diversity covers everything from everyday lifestyle to luxury goods!",
      product: "Minimalist Leather Backpack",
      date: "1 month ago",
      helpful: 53,
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* =========================================================================
          SECTION 1: HEADER (Theme Primary Background & White Logo)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* White Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1"
            >
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm font-[var(--font-montserrat)]">
                  Wasan Shopee
                </span>
                <span className="text-[11px] font-medium tracking-widest uppercase text-white/80 -mt-1">
                  Premium Marketplace
                </span>
              </div>
            </Link>

            {/* Navigation links (Desktop) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link
                href="#hero"
                className="text-white/90 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-white/90 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all"
              >
                About Store
              </Link>
              <Link
                href="#testimonials"
                className="text-white/90 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all"
              >
                Reviews
              </Link>
              <Link
                href="#footer"
                className="text-white/90 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all"
              >
                Contact
              </Link>
            </nav>

            {/* Header Right Actions & Login Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Bar Preview */}
              <div className="hidden lg:flex items-center bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-all cursor-pointer">
                <Search className="w-3.5 h-3.5 mr-2 text-white/70" />
                <span>Search 50,000+ items...</span>
                <kbd className="ml-3 px-1.5 py-0.5 text-[10px] bg-white/20 rounded font-mono text-white">
                  ⌘K
                </kbd>
              </div>

              {/* Login Button */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-[oklch(0.508_0.118_165.612)] font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-xl hover:bg-white/95 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <LogIn className="w-4 h-4 text-[oklch(0.508_0.118_165.612)] stroke-[2.5]" />
                <span>Login</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white hover:bg-white/15 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-white/15 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2">
            <Link
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-white/10 transition-colors"
            >
              About Store
            </Link>
            <Link
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-white/10 transition-colors"
            >
              Customer Reviews
            </Link>
            <Link
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-white font-medium hover:bg-white/10 transition-colors"
            >
              Contact & Support
            </Link>
          </div>
        )}
      </header>

      {/* =========================================================================
          SECTION 2: HERO SECTION (About Project with Full Width Image & Text Overlay)
          ========================================================================= */}
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
            <div className="flex flex-wrap items-center gap-4 pt-2">
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
            </div>

            {/* Value Proposition Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15 text-white/90">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Free Express</p>
                  <p className="text-white/70">On orders $49+</p>
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
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TESTIMONIALS (Reviews)
          ========================================================================= */}
      <section
        id="testimonials"
        className="py-20 lg:py-28 bg-muted/40 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              What Shoppers Love About{" "}
              <span className="text-primary">Wasan Shopee</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Over 50,000+ satisfied customers rely on us for authentic
              products, lightning-speed logistics, and unrivaled service. Here
              is what real shoppers say.
            </p>
          </div>

          {/* =========================================================================
              FEATURED PRODUCTS
              ========================================================================= */}
          <section id="featured-products" className="mb-20 p-6 sm:p-8 border border-primary/40 rounded-3xl bg-background shadow-sm">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
              {/*  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Featured <span className="text-primary">Products</span>
              </h3> */}
              <p className="text-primary text-2xl font-medium text-center">
                Handpicked Selections from our Collection.
              </p>
            </div>

            {loadingFeatured ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No featured products available at the moment.
              </div>
            )}
          </section>

          {/* Social Proof Stat Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-card border border-border/80 shadow-sm mb-12 text-center">
            <div className="p-3 border-r border-border/50 last:border-r-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">
                4.9 / 5.0
              </p>
              <div className="flex justify-center gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                12,500+ Verified Reviews
              </p>
            </div>
            <div className="p-3 border-r border-border/50 last:border-r-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                99.4%
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
                On-Time Delivery
              </p>
              <p className="text-xs text-muted-foreground">
                Nationwide Fulfillment
              </p>
            </div>
            <div className="p-3 border-r border-border/50 last:border-r-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                50k+
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
                Happy Members
              </p>
              <p className="text-xs text-muted-foreground">Growing Community</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
                24 / 7
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
                VIP Support
              </p>
              <p className="text-xs text-muted-foreground">
                Average 2m response
              </p>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Star Rating & Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* Review Heading & Body */}
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      &ldquo;{item.title}&rdquo;
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.comment}
                    </p>
                  </div>

                  {/* Purchased Product Tag */}
                  <div className="pt-2">
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                      Purchased:{" "}
                      <span className="font-semibold">{item.product}</span>
                    </span>
                  </div>
                </div>

                {/* Reviewer Profile & Footer */}
                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span>{item.helpful}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Bottom Trust Bar */}
          <div className="mt-14 p-6 rounded-2xl bg-primary/5 border border-primary/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  100% Genuine Buyer Reviews
                </h4>
                <p className="text-xs text-muted-foreground">
                  Every single review is collected from certified and confirmed
                  delivery orders.
                </p>
              </div>
            </div>
            <Link
              href="#hero"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Explore all collections now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FOOTER
          ========================================================================= */}
      <footer
        id="footer"
        className="bg-slate-950 text-slate-300 border-t border-slate-800"
      >
        {/* Newsletter / Promo Banner */}
        <div className="border-b border-slate-800/80 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center lg:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Exclusive Privileges
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Join the Wasan Shopee VIP Club
                </h3>
                <p className="text-sm text-slate-400">
                  Subscribe to receive secret flash discounts, weekly drops, and
                  15% off your first checkout.
                </p>
              </div>

              <form
                onSubmit={handleSubscribe}
                className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 max-w-md"
              >
                <div className="relative flex-grow">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all text-sm whitespace-nowrap shadow-md"
                >
                  {subscribed ? "Subscribed! 🎉" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Info & Mission */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white font-[var(--font-montserrat)]">
                  Wasan Shopee
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Wasan Shopee is committed to providing premium quality products,
                ethical consumer standards, and voice-of-customer excellence.
                Discover the best in modern lifestyle, tech, and fashion.
              </p>

              <div className="pt-2 flex items-center gap-3 text-slate-400 text-sm font-semibold">
                <Link
                  href="#social"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-primary hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  FB
                </Link>
                <Link
                  href="#social"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-primary hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                  aria-label="Twitter"
                >
                  X
                </Link>
                <Link
                  href="#social"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-primary hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  IG
                </Link>
                <Link
                  href="#social"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-primary hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  IN
                </Link>
                <Link
                  href="#social"
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-primary hover:text-white border border-slate-800 flex items-center justify-center transition-all"
                  aria-label="YouTube"
                >
                  YT
                </Link>
              </div>
            </div>

            {/* Column 2: Categories */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Shop Categories
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link
                    href="#hero"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Fashion & Apparel
                  </Link>
                </li>
                <li>
                  <Link
                    href="#hero"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Smart Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    href="#hero"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Home & Modern Living
                  </Link>
                </li>
                <li>
                  <Link
                    href="#hero"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Beauty & Skincare
                  </Link>
                </li>
                <li>
                  <Link
                    href="#hero"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Sports & Fitness Gear
                  </Link>
                </li>
                <li>
                  <Link
                    href="#hero"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Flash Deals & Offers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Help Center & FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Shipping & Delivery Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Easy Return Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Warranty & Protection
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Store Info */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Get In Touch
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Wasan Shopee Global HQ, Tech Park, Suite 400</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+1 (800) 890-WASAN</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>support@wasanshopee.com</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mon - Sun: 24/7 Support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Badges */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Wasan Shopee. All rights reserved.
              Designed with pride.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Security
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
