"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Megaphone,
  Bell,
  Mail,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Inbox,
  MousePointerClick,
  Percent,
  RefreshCw,
  Activity,
  Calendar,
  Image,
  Code,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  Eye,
  ArrowRight,
} from "lucide-react";

export default function CrmDashboardClient({
  siteId,
  siteName,
  initialStats,
  initialTrends,
  initialCampaignPerformance,
  recentSubscribers,
  recentCampaigns,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // --- TAB 1: Overview States ---
  const [stats, setStats] = useState(initialStats);
  const [trends, setTrends] = useState(initialTrends);
  const [campaigns, setCampaigns] = useState(initialCampaignPerformance);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("30");

  // --- TAB 2: Ads States ---
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [isAdFormOpen, setIsAdFormOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adName, setAdName] = useState("");
  const [adType, setAdType] = useState("BANNER");
  const [adsenseCode, setAdsenseCode] = useState("");
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adTargetUrl, setAdTargetUrl] = useState("");
  const [adPosition, setAdPosition] = useState("HEADER");
  const [adActive, setAdActive] = useState(true);
  const [adError, setAdError] = useState(null);
  const [adSuccess, setAdSuccess] = useState(null);

  // --- TAB 3: Reports States ---
  const [reportType, setReportType] = useState("overview");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportResults, setReportResults] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  // Fetch Ads for Tab 2
  const fetchAds = async () => {
    setAdsLoading(true);
    try {
      const res = await fetch("/api/admin/ads", {
        headers: { "x-site-id": siteId },
      });
      const json = await res.json();
      if (res.ok) {
        setAds(json.data?.ads || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ads") {
      fetchAds();
    }
  }, [activeTab]);

  const refreshOverviewData = async (newRange = range) => {
    setLoading(true);
    try {
      const [resStats, resReports] = await Promise.all([
        fetch(`/api/admin/analytics/dashboard?range=${newRange}`, {
          headers: { "x-site-id": siteId },
        }),
        fetch(`/api/admin/reports/advanced?range=${newRange}`, {
          headers: { "x-site-id": siteId },
        }),
      ]);

      const jsonStats = await resStats.json();
      const jsonReports = await resReports.json();

      if (resStats.ok && jsonStats.data) {
        setStats((prev) => ({
          ...prev,
          crmLeads: jsonStats.data.summary?.crmLeads ?? prev.crmLeads,
          crmSubscribers: jsonStats.data.summary?.crmSubscribers ?? prev.crmSubscribers,
          contactSubmissions: jsonStats.data.summary?.contactSubmissions ?? prev.contactSubmissions,
          totalPageViews: jsonStats.data.summary?.totalPageViews ?? prev.totalPageViews,
        }));
      }

      if (resReports.ok && jsonReports.data) {
        setTrends(jsonReports.data.trafficTrends || []);
        setCampaigns(jsonReports.data.campaignPerformance || []);
        setStats((prev) => ({
          ...prev,
          totalPipelineValue: jsonReports.data.revenue?.totalPipelineValue ?? prev.totalPipelineValue,
          convertedValue: jsonReports.data.revenue?.convertedValue ?? prev.convertedValue,
          conversionRate: jsonReports.data.revenue?.conversionRate ?? prev.conversionRate,
        }));
      }
    } catch (err) {
      console.error("Failed to refresh CRM stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (e) => {
    const val = e.target.value;
    setRange(val);
    refreshOverviewData(val);
  };

  // Ads CRUD Handlers
  const openCreateAdForm = () => {
    setEditingAd(null);
    setAdName("");
    setAdType("BANNER");
    setAdsenseCode("");
    setAdImageUrl("");
    setAdTargetUrl("");
    setAdPosition("HEADER");
    setAdActive(true);
    setAdError(null);
    setIsAdFormOpen(true);
  };

  const openEditAdForm = (ad) => {
    setEditingAd(ad);
    setAdName(ad.name);
    setAdType(ad.type);
    setAdsenseCode(ad.adsenseCode || "");
    setAdImageUrl(ad.imageUrl || "");
    setAdTargetUrl(ad.targetUrl || "");
    setAdPosition(ad.position);
    setAdActive(ad.active);
    setAdError(null);
    setIsAdFormOpen(true);
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    setAdError(null);
    setAdSuccess(null);

    const payload = {
      name: adName,
      type: adType,
      adsenseCode: adType === "ADSENSE" ? adsenseCode : null,
      imageUrl: adType === "BANNER" ? adImageUrl : null,
      targetUrl: adType === "BANNER" ? adTargetUrl : null,
      position: adPosition,
      active: adActive,
    };

    try {
      let res;
      if (editingAd) {
        res = await fetch("/api/admin/ads", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-site-id": siteId,
          },
          body: JSON.stringify({ id: editingAd.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/ads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-site-id": siteId,
          },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save advertisement");

      if (editingAd) {
        setAds(ads.map((a) => (a.id === editingAd.id ? json.data.ad : a)));
        setAdSuccess("Ad unit updated successfully!");
      } else {
        setAds([json.data.ad, ...ads]);
        setAdSuccess("Ad unit created successfully!");
      }

      setTimeout(() => {
        setIsAdFormOpen(false);
        setAdSuccess(null);
      }, 1500);
    } catch (err) {
      setAdError(err.message);
    }
  };

  const toggleAdStatus = async (ad) => {
    try {
      const res = await fetch("/api/admin/ads", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-site-id": siteId,
        },
        body: JSON.stringify({ id: ad.id, active: !ad.active }),
      });
      const json = await res.json();
      if (res.ok) {
        setAds(ads.map((a) => (a.id === ad.id ? json.data.ad : a)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdDelete = async (id) => {
    if (!confirm("Delete this advertisement?")) return;
    try {
      const res = await fetch(`/api/admin/ads?id=${id}`, {
        method: "DELETE",
        headers: { "x-site-id": siteId },
      });
      if (res.ok) {
        setAds(ads.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Custom Reports Handler
  const generateReport = async (e) => {
    e.preventDefault();
    setReportLoading(true);
    setReportError(null);
    setReportResults(null);

    try {
      let url = `/api/admin/analytics/custom-reports?type=${reportType}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const res = await fetch(url, {
        headers: { "x-site-id": siteId },
      });
      const json = await res.json();
      if (res.ok) {
        setReportResults(json.data || json);
      } else {
        throw new Error(json.error || "Failed to fetch report data");
      }
    } catch (err) {
      setReportError(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  const getCTR = (impressions, clicks) => {
    if (!impressions) return "0.00%";
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header and Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Marketing CRM Command Center</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Website: <span className="font-semibold text-gray-800">{siteName}</span>
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity size={14} /> Overview & Advanced Reports
          </button>
          <button
            onClick={() => setActiveTab("ads")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "ads" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Megaphone size={14} /> Advertisement Placements
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === "reports" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileSpreadsheet size={14} /> Custom Reports
          </button>
        </div>
      </div>

      {/* --- TAB 1: CRM OVERVIEW & ADVANCED REPORTS --- */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-800 mb-4">CRM Workspace Shortcuts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/crm/campaigns" className="flex flex-col p-3 bg-white border border-slate-150 rounded-xl hover:border-indigo-300 transition">
                <Mail size={16} className="text-indigo-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-800">New Campaign</h3>
                <p className="text-[10px] text-slate-400 mt-1">Draft a new email broadcast</p>
              </Link>
              <Link href="/crm/subscribers" className="flex flex-col p-3 bg-white border border-slate-150 rounded-xl hover:border-indigo-300 transition">
                <Users size={16} className="text-indigo-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-800">Import Contacts</h3>
                <p className="text-[10px] text-slate-400 mt-1">Upload CSV subscriber list</p>
              </Link>
              <Link href="/crm/templates" className="flex flex-col p-3 bg-white border border-slate-150 rounded-xl hover:border-indigo-300 transition">
                <PlusCircle size={16} className="text-indigo-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-800">New Template</h3>
                <p className="text-[10px] text-slate-400 mt-1">Create newsletter template</p>
              </Link>
              <Link href="/crm/push" className="flex flex-col p-3 bg-white border border-slate-150 rounded-xl hover:border-indigo-300 transition">
                <Bell size={16} className="text-indigo-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-800">Send Push</h3>
                <p className="text-[10px] text-slate-400 mt-1">Broadcast web push alert</p>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Users size={12} className="text-blue-500" /> Subscribers
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{stats.crmSubscribers}</div>
            </div>
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Inbox size={12} className="text-indigo-500" /> Lead Inflow
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{stats.crmLeads}</div>
            </div>
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={12} className="text-emerald-500" /> Pipeline Value
              </span>
              <div className="text-2xl font-extrabold text-emerald-600">${stats.totalPipelineValue}</div>
              <div className="text-[10px] text-emerald-500 font-semibold">{stats.conversionRate}% Win Rate</div>
            </div>
            <div className="p-4 bg-white border rounded-xl shadow-sm space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp size={12} className="text-purple-500" /> Total Pageviews
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{stats.totalPageViews}</div>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                <Activity size={15} className="text-blue-500" /> Pageview Trends (Last {range} Days)
              </h2>
              <div className="flex items-center gap-1 border rounded px-1.5 py-1 text-[11px] bg-slate-50">
                <select value={range} onChange={handleRangeChange} className="bg-transparent outline-none font-semibold cursor-pointer">
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                </select>
              </div>
            </div>

            <div className="h-44 flex items-end gap-1 pt-4">
              {trends.map((t, idx) => {
                const maxVal = Math.max(...trends.map((day) => day.pageViews), 1);
                const heightPercent = `${(t.pageViews / maxVal) * 100}%`;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                    <div className="relative w-full h-full flex items-end justify-center">
                      <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 font-mono">
                        {t.date}: {t.pageViews} views
                      </div>
                      <div className="bg-blue-500 hover:bg-blue-600 w-full rounded-t-sm transition-all" style={{ height: heightPercent, minHeight: t.pageViews > 0 ? "4px" : "1px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campaigns and Subscribers grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-xl p-4 bg-white space-y-3">
              <h3 className="font-bold text-gray-900 text-xs border-b pb-2">Email Campaigns</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-3 border rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{c.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{c.status}</span>
                    </div>
                    {c.status === "sent" && (
                      <div className="flex gap-4 text-[10px] text-gray-500 font-mono mt-1 pt-1 border-t">
                        <span>Sent: {c.sentCount}</span>
                        <span>Opens: {c.openRate}%</span>
                        <span>Clicks: {c.clickRate}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-white space-y-3">
              <h3 className="font-bold text-gray-900 text-xs border-b pb-2">Recent Subscribers</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recentSubscribers.map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center text-xs pb-1.5 border-b last:border-0">
                    <div>
                      <span className="font-semibold text-gray-800">{sub.name || sub.email}</span>
                      <span className="text-[10px] text-gray-400 block">{sub.email}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-semibold">{sub.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: ADVERTISEMENT PLACEMENTS --- */}
      {activeTab === "ads" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">Campaigns & Display Banners</h2>
              <p className="text-xs text-gray-500">Configure visual banner spots or integrate responsive Google AdSense scripts.</p>
            </div>
            <button
              onClick={openCreateAdForm}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
            >
              <Plus size={14} /> New Ad Campaign
            </button>
          </div>

          {/* Form Modal */}
          {isAdFormOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border">
                <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 text-sm">{editingAd ? "Modify Ad unit" : "Register Ad placement"}</h3>
                  <button onClick={() => setIsAdFormOpen(false)} className="text-xs text-gray-400 hover:text-gray-600 font-bold">Close</button>
                </div>
                <form onSubmit={handleAdSubmit} className="p-6 space-y-4">
                  {adError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border">{adError}</div>}
                  {adSuccess && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-lg border">{adSuccess}</div>}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Ad Unit Name</label>
                    <input type="text" required value={adName} onChange={(e) => setAdName(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Ad Type</label>
                      <select value={adType} onChange={(e) => setAdType(e.target.value)} className="w-full border rounded-lg p-2 text-xs">
                        <option value="BANNER">Upload Banner</option>
                        <option value="ADSENSE">Google AdSense</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Position</label>
                      <select value={adPosition} onChange={(e) => setAdPosition(e.target.value)} className="w-full border rounded-lg p-2 text-xs">
                        <option value="HEADER">Header</option>
                        <option value="SIDEBAR">Sidebar</option>
                        <option value="FOOTER">Footer</option>
                        <option value="IN_CONTENT">In-Content</option>
                      </select>
                    </div>
                  </div>

                  {adType === "BANNER" ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Image Link</label>
                        <input type="url" required value={adImageUrl} onChange={(e) => setAdImageUrl(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Redirect URL</label>
                        <input type="url" required value={adTargetUrl} onChange={(e) => setAdTargetUrl(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Script Code</label>
                      <textarea required rows={4} value={adsenseCode} onChange={(e) => setAdsenseCode(e.target.value)} className="w-full border rounded-lg p-2 text-xs font-mono" />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="adActive" checked={adActive} onChange={(e) => setAdActive(e.target.checked)} className="rounded" />
                    <label htmlFor="adActive" className="text-xs font-semibold text-gray-700">Display this advertisement immediately</label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button type="button" onClick={() => setIsAdFormOpen(false)} className="px-3 py-1.5 border rounded-lg text-xs font-bold">Cancel</button>
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table list */}
          {adsLoading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading ads data...</div>
          ) : ads.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 border border-dashed rounded-xl bg-slate-50">No ads configured. Click "New Ad Campaign" to get started.</div>
          ) : (
            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Ad Name</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Position</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-center">Impressions</th>
                    <th className="px-5 py-3 text-center">Clicks</th>
                    <th className="px-5 py-3 text-center">CTR</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 font-semibold text-gray-800">{ad.name}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          ad.type === "BANNER" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}>{ad.type}</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-500">{ad.position}</td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => toggleAdStatus(ad)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ad.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-gray-500"
                        }`}>{ad.active ? "Active" : "Disabled"}</button>
                      </td>
                      <td className="px-5 py-4 text-center">{ad.impressions}</td>
                      <td className="px-5 py-4 text-center">{ad.clicks}</td>
                      <td className="px-5 py-4 text-center font-bold text-gray-800">{getCTR(ad.impressions, ad.clicks)}</td>
                      <td className="px-5 py-4 text-right space-x-1">
                        <button onClick={() => openEditAdForm(ad)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><Edit2 size={13} /></button>
                        <button onClick={() => handleAdDelete(ad.id)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: CUSTOM REPORTS GENERATOR --- */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-gray-900">Custom Reports Generator</h2>
            <p className="text-xs text-gray-500">Query site activity and CRM details. Export query logs to JSON formats.</p>
          </div>

          <form onSubmit={generateReport} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-xl bg-slate-50">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Dataset Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white">
                <option value="overview">Executive Overview</option>
                <option value="traffic">Traffic Logs</option>
                <option value="crm">CRM Leads & Subscribers</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={reportLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1">
                <RefreshCw size={12} className={reportLoading ? "animate-spin" : ""} /> {reportLoading ? "Querying..." : "Generate Dataset"}
              </button>
            </div>
          </form>

          {reportError && <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl">{reportError}</div>}

          {reportResults && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-xs">Query Results Table</h3>
                {/* Download button */}
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportResults, null, 2))}`}
                  download={`CRM_Report_${reportType}_${new Date().toISOString().split("T")[0]}.json`}
                  className="flex items-center gap-1.5 px-3 py-1 border rounded-lg text-xs font-bold text-gray-600 hover:bg-slate-50 transition"
                >
                  <Download size={13} /> Export JSON
                </a>
              </div>

              {/* Display Result Sheets based on Type */}
              {reportType === "overview" && reportResults.data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-xl bg-white text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Traffic Pageviews</div>
                    <div className="text-xl font-bold text-gray-800 mt-1">{reportResults.data.totalPageViews}</div>
                  </div>
                  <div className="p-4 border rounded-xl bg-white text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Unique Visitors</div>
                    <div className="text-xl font-bold text-gray-800 mt-1">{reportResults.data.uniqueVisitors}</div>
                  </div>
                  <div className="p-4 border rounded-xl bg-white text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">New Leads</div>
                    <div className="text-xl font-bold text-gray-800 mt-1">{reportResults.data.crmLeads}</div>
                  </div>
                  <div className="p-4 border rounded-xl bg-white text-center">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Newsletter Signups</div>
                    <div className="text-xl font-bold text-gray-800 mt-1">{reportResults.data.crmSubscribers}</div>
                  </div>
                </div>
              )}

              {reportType === "traffic" && Array.isArray(reportResults.data) && (
                <div className="border rounded-xl bg-white overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3">Page Viewed</th>
                        <th className="px-4 py-3">Referrer/Source</th>
                        <th className="px-4 py-3 text-center">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-xs">
                      {reportResults.data.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{new Date(row.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{row.pageViewed}</td>
                          <td className="px-4 py-3 text-gray-600">{row.trafficSource || "Direct"}</td>
                          <td className="px-4 py-3 text-center font-semibold text-blue-600">{row.duration}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportType === "crm" && reportResults.data && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border rounded-xl p-4 bg-white space-y-3 max-h-80 overflow-y-auto">
                    <h4 className="font-bold text-xs border-b pb-1.5">Leads Captured</h4>
                    {reportResults.data.leads?.map((lead) => (
                      <div key={lead.id} className="text-xs pb-1.5 border-b last:border-0 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-800">{lead.name}</span>
                          <span className="text-[10px] text-gray-400 block">Interest: {lead.serviceInterest || "None"}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">{lead.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-xl p-4 bg-white space-y-3 max-h-80 overflow-y-auto">
                    <h4 className="font-bold text-xs border-b pb-1.5">Subscribers Active</h4>
                    {reportResults.data.subscribers?.map((sub) => (
                      <div key={sub.id} className="text-xs pb-1.5 border-b last:border-0 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-800">{sub.name || sub.email}</span>
                          <span className="text-[10px] text-gray-400 block">{sub.email}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-semibold">{sub.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
