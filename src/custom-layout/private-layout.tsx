"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { getLoggedInUser, logoutUser } from "@/services/users";
import { Spinner } from "@/components/ui/spinner";
import PrivateLayoutHeader from "./private-layout-header";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>(!currentUser);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await getLoggedInUser();
      setCurrentUser(user);
    } catch (error: any) {
      await logoutUser();
      setCurrentUser(null);
      toast.error(error?.message || "Session expired. Please log in again.");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  if (loading || !currentUser) {
    return <Spinner fullScreen text="Authenticating..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PrivateLayoutHeader />
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
};

export default PrivateLayout;
