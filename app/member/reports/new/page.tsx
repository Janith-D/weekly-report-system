import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WeeklyReportForm } from "@/components/reports/WeeklyReportForm";

export default async function NewReportPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            New Weekly Report
          </h1>
          <p className="text-gray-500 mt-1">
            Fill out the form below to create your weekly report
          </p>
        </div>
        <WeeklyReportForm />
      </div>
    </DashboardLayout>
  );
}
