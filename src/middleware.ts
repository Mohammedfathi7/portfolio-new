import { middlewareAuth } from "@/lib/auth.middleware";

export default middlewareAuth;

export const config = {
  matcher: ["/admin/:path*"],
};
