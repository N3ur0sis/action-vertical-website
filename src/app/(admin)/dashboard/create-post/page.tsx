import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default async function Page() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("${process.env.NEXT_PUBLIC_VERCEL_URL}/api/auth/login?post_login_redirect_url=/create-post");
  }

  return (
    <>
      <PostEditor />
    </>
  );
}
