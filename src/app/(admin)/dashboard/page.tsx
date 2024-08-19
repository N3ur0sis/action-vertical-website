import { createPost } from "@/actions/actions";
import PostEditor from "@/components/post-editor";
import {
  getKindeServerSession,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login?post_login_redirect_url?=/create-post");
  }
  return (
    <main className="text-center pt-16">
      <h1>Admin Dashboard </h1>
      <LogoutLink>Logout</LogoutLink>
    </main>
  );
}
