import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  return withAuth(req);
}

export const config = {
  matcher: [
    "/dashboard/create-post", 
    "/dashboard/files/:path*", 
    "/dashboard/gallery/:path*", 
    "/dashboard/:path*", 
    "/dashboard/posts/:path*"
  ],
};
