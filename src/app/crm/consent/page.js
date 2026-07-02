"use client";

import { useState, useEffect } from "react";
import { Shield, Fingerprint, Lock, ShieldCheck } from "lucide-react";

export default function ConsentPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteId, setSiteId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("x-site-id") || process.env.NEXT_PUBLIC_SITE_ID || "";
    setSiteId(id);
  }, []);

  useEffect(() => {
    if (siteId) fetchLogs();
  }, [siteId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/visitors/consent", {
        headers: { "x-site-id": siteId }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data.logs || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const acceptedCount = logs.filter(l => l.accepted).length;
  const acceptanceRate = logs.length > 0 ? Math.round((acceptedCount / logs.length) * 100) : 0;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          GDPR Cookie Consent logs
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Review visitor privacy agreements and opt-in settings for tracking
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Consent Events</span>
          <p className="text-2xl font-bold mt-1">{logs.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Accepted Count</span>
          <p className="text-2xl font-bold mt-1 text-green-600">{acceptedCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Acceptance Rate</span>
          <p className="text-2xl font-bold mt-1 text-indigo-600">{acceptanceRate}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No consent activities recorded yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">Visitor ID</th>
                <th className="p-3">Accepted Cookies</th>
                <th className="p-3">Analytics Opt-in</th>
                <th className="p-3">Marketing Opt-in</th>
                <th className="p-3">IP Hash</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
              {logs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                  <td className="p-3 font-mono text-[10px] text-slate-900 dark:text-slate-100">{item.visitorId}</td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                      item.accepted ? "bg-green-50 text-green-700 border-green-150" : "bg-slate-50 text-slate-500 border-slate-150"
                    }`}>
                      {item.accepted ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                      item.analytics ? "bg-green-50 text-green-700 border-green-150" : "bg-slate-50 text-slate-500 border-slate-150"
                    }`}>
                      {item.analytics ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                      item.marketing ? "bg-green-50 text-green-700 border-green-150" : "bg-slate-50 text-slate-500 border-slate-150"
                    }`}>
                      {item.marketing ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-[10px] font-mono">{item.ipHash || "-"}</td>
                  <td className="p-3 text-slate-400 text-[10px]">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
