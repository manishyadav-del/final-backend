import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { getSiteForUser } from "@/lib/getSiteForUser";
import StatCard from "@/components/dashboard/StatCard";
import {
  Users,
  Megaphone,
  Bell,
  Mail,
  PlusCircle,
  FolderOpen,
  Play,
  ArrowLeftRight
} from "lucide-react";

export default async function CrmDashboardPage() {
  const user = await requireAuth();
  const site = await getSiteForUser(user);

  if (!site) {
    return (
      <div className="p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Marketing CRM</h1>
        <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-250 rounded-xl text-sm max-w-md mx-auto">
          No active site configuration found. Please configure a site in the database first.
        </div>
      </div>
    );
  }

  // Fetch CRM-scoped stats
  const totalSubscribers = await prisma.subscriber.count({
    where: { siteId: site.id }
  });

  const totalCampaigns = await prisma.emailCampaign.count({
    where: { siteId: site.id }
  });

  const totalLists = await prisma.subscriberList.count({
    where: { siteId: site.id }
  });

  const totalPushes = await prisma.pushNotification.count({
    where: { siteId: site.id }
  });

  const recentSubscribers = await prisma.subscriber.findMany({
    where: { siteId: site.id },
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  const recentCampaigns = await prisma.emailCampaign.findMany({
    where: { siteId: site.id },
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  const globalRole = user.globalRole || "VIEWER";

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Marketing CRM
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Marketing & Campaigns overview for:{" "}
          <span className="font-semibold text-gray-800">{site.name}</span>
        </p>
      </div>

      {/* Quick Actions Block */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800/40 dark:to-indigo-950/10 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 shadow-xs transition-colors duration-200">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
          Marketing Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/crm/campaigns"
            className="group flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-300 transition"
          >
            <Mail size={16} className="text-indigo-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">New Campaign</h3>
            <p className="text-[10px] text-slate-400 mt-1">Draft a new email broadcast</p>
          </Link>
          <Link
            href="/crm/subscribers"
            className="group flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-300 transition"
          >
            <Users size={16} className="text-indigo-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Import Contacts</h3>
            <p className="text-[10px] text-slate-400 mt-1">Upload CSV subscriber list</p>
          </Link>
          <Link
            href="/crm/templates"
            className="group flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-300 transition"
          >
            <PlusCircle size={16} className="text-indigo-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">New Template</h3>
            <p className="text-[10px] text-slate-400 mt-1">Create newsletter template</p>
          </Link>
          <Link
            href="/crm/push"
            className="group flex flex-col p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-indigo-300 transition"
          >
            <Bell size={16} className="text-indigo-500 mb-2" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Send Push</h3>
            <p className="text-[10px] text-slate-400 mt-1">Broadcast web push alert</p>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Subscribers" value={totalSubscribers} />
        <StatCard title="Email Lists" value={totalLists} />
        <StatCard title="Total Campaigns" value={totalCampaigns} />
        <StatCard title="Push Alerts" value={totalPushes} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Subscribers */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
            Recent Subscribers
          </h2>
          <div className="space-y-3">
            {recentSubscribers.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No subscribers registered yet.</p>
            ) : (
              recentSubscribers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-slate-200">
                      {item.name || item.email}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.name ? item.email : "No name provided"}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-green-50 border-green-200 text-green-700">
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
            Recent Campaigns
          </h2>
          <div className="space-y-3">
            {recentCampaigns.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No campaigns drafted yet.</p>
            ) : (
              recentCampaigns.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-slate-200">
                      {item.name}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Subject: {item.subject}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-indigo-50 border-indigo-200 text-indigo-700">
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
