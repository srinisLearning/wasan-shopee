"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, User, ShoppingCart } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import MenuItems from "./menu-items";

interface PrivateLayoutHeaderProps {
  onMenuClick?: () => void;
}

const PrivateLayoutHeader = ({ onMenuClick }: PrivateLayoutHeaderProps) => {
  const { currentUser } = useUserStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [open, setOpen] = useState(false);

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    }
    setOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Extreme Left: Brand Logo */}
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

          {/* Extreme Right: Logged in User Name & Menu Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/user/cart" className="relative p-2 rounded-xl text-white hover:bg-white/15 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <ShoppingCart className="w-6 h-6 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-primary bg-white rounded-full shadow-sm translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white">
                <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-semibold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-sm font-semibold tracking-wide drop-shadow-xs max-w-[140px] truncate sm:max-w-[200px]">
                  {currentUser.name || currentUser.email}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleMenuClick}
              className="p-2.5 rounded-xl text-white hover:bg-white/15 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 text-white stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sheet Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[360px] p-0 flex flex-col justify-between bg-white text-foreground"
        >
          <SheetHeader className="p-6 border-b border-border/40 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-foreground">
                  Navigation Menu
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {currentUser?.role === "admin" ? "Admin Management Portal" : "Customer Portal"}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <MenuItems onItemClick={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default PrivateLayoutHeader;