import { auth } from "@/auth";

export default auth((req) => {
  const privateRoutes = ["/profile", "/user/profile", "cart"];

  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  // const url = "http://localhost:3000";
  // const url = "https://alma-villa.vercel.app"; 
  const url = "https://alma-villa.vercel.app"; 
  const isRootRoute = req.nextUrl.pathname === "/";
  const isAuthRoute = req.nextUrl.pathname.includes("/account/");
  const isPrivateRoute = privateRoutes.includes(req.nextUrl.pathname);
  const isAdminRoute = req.nextUrl.pathname.includes("/admin");
  const isDashboardRoute = req.nextUrl.pathname.includes("/dashboard");

  // Role-based redirects when user is logged in and trying to access auth routes
  if (isLoggedIn && isAuthRoute) {
    if (user?.role === "Admin") {
      return Response.redirect(`${url}/admin`);
    } else if (user?.role === "Verified" || user?.role === "User") {
      return Response.redirect(`${url}/dashboard`);
    }
    // For other roles (like "Unverified"), let them stay on auth pages
  }

  // Protect private routes
  if (!isLoggedIn && isPrivateRoute) {
    return Response.redirect(`${url}/`);
  }

  // Protect admin routes - only Admin role can access
  if (isAdminRoute) {
    if (!isLoggedIn || user?.role !== "Admin") {
      return Response.redirect(`${url}/`);
    }
  }

  // Protect dashboard routes - Verified, User, and Admin roles can access
  if (isDashboardRoute) {
    if (!isLoggedIn || (user?.role !== "Verified" && user?.role !== "User" && user?.role !== "Admin")) {
      return Response.redirect(`${url}/account/login`);
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};