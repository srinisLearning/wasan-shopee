"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react"

export function Footer({ showNewsletter = true }: { showNewsletter?: boolean }) {
  const [emailInput, setEmailInput] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput) {
      setSubscribed(true)
      setEmailInput("")
    }
  }

  return (
    <footer
      id="footer"
      className="w-full bg-slate-950 text-slate-300 border-t border-slate-800"
    >
      {/* Newsletter / Promo Banner */}
      {showNewsletter && (
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
      )}

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
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fashion & Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Smart Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home & Modern Living
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Beauty & Skincare
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Sports & Fitness Gear
                </Link>
              </li>
              <li>
                <Link
                  href="/"
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
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Easy Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Warranty & Protection
                </Link>
              </li>
              <li>
                <Link
                  href="/"
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
  )
}
