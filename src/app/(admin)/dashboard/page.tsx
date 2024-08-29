import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import DashboardContent from "@/components/DashboardContent";
import { redirect } from "next/navigation";

export default async function Page() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login?post_login_redirect_url=/dashboard");
  }

  return (
    <main className="text-center pt-16">
      <h1 className="text-4xl font-bold mb-6">Action Vertical</h1>
      <DashboardContent />
      <div className="mt-8">
      </div>
    </main>
  );
}
