"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  ListCheck,
  Package,
  Settings,
  User,
  UserRound,
  LogOut,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { logoutUser } from "@/services/users";
import { cn } from "@/lib/utils";

interface MenuItemsProps {
  onItemClick?: () => void;
}

export interface IMenuItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const MenuItems = ({ onItemClick }: MenuItemsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();

  const userMenuItems: IMenuItem[] = [
    {
      name: "Profile",
      icon: User,
      href: "/user/profile",
    },
    {
      name: "Dashboard",
      icon: Home,
      href: "/user/dashboard",
    },
    {
      name: "Products",
      icon: Package,
      href: "/user/products",
    },
    {
      name: "Shipping Addresses",
      icon: MapPin,
      href: "/user/addresses",
    },
    {
      name: "My Orders",
      icon: ListCheck,
      href: "/user/orders",
    },

    {
      name: "Settings",
      icon: Settings,
      href: "/user/settings",
    },
  ];

  const adminMenuItems: IMenuItem[] = [
    {
      name: "Dashboard",
      icon: Home,
      href: "/admin/dashboard",
    },
    {
      name: "Products",
      icon: Package,
      href: "/admin/products",
    },
    {
      name: "Categories",
      icon: LayoutDashboard,
      href: "/admin/categories",
    },
    {
      name: "Orders",
      icon: ListCheck,
      href: "/admin/orders",
    },
    {
      name: "Users",
      icon: UserRound,
      href: "/admin/users",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const menuItems =
    currentUser?.role === "admin" ? adminMenuItems : userMenuItems;

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      onItemClick?.();
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error: any) {
      toast.error(error?.message || "Failed to log out");
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Navigation List */}
      <div className="space-y-1.5">
        {/* <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {currentUser?.role === "admin" ? "Admin Controls" : "Main Menu"}
        </div> */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                  : "text-foreground/80 hover:text-foreground hover:bg-muted/70",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:scale-110",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span>{item.name}</span>
              </div>
              <ChevronRight
                className={cn(
                  "w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform",
                  isActive ? "opacity-100" : "",
                )}
              />
            </Link>
          );
        })}
      </div>

      {/* User Info & Logout Section */}
      <div className="pt-4 mt-6 border-t border-border/50 space-y-3">
        {/*  {currentUser && (
          <div className="p-3 rounded-xl bg-muted/50 border border-border/40 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {currentUser.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.email}
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {currentUser.role}
            </span>
          </div>
        )} */}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 active:scale-[0.98] transition-all cursor-pointer border border-destructive/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItems;