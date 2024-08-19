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
    <>
      <h1 className=" text-4xl md:text-5xl mb-5 font-bold ">Créer un aricle</h1>
      <PostEditor />
      <LogoutLink>Logout</LogoutLink>
    </>
  );
}
