
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseProxyClient } from "./config/supabase-proxy-config";
 

const protectedPrefixes = ["/user", "/admin"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createSupabaseProxyClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};




