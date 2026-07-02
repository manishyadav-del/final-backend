"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  MousePointerClick,
  Percent,
  Code,
  Image,
  ExternalLink,
} from "lucide-react";

export default function AdsConsole({ siteId, initialAds }) {
  const [ads, setAds] = useState(initialAds);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [type, setType] = useState("BANNER");
  const [adsenseCode, setAdsenseCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [position, setPosition] = useState("HEADER");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const openCreateForm = () => {
    setEditingAd(null);
    setName("");
    setType("BANNER");
    setAdsenseCode("");
    setImageUrl("");
    setTargetUrl("");
    setPosition("HEADER");
    setActive(true);
    setError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (ad) => {
    setEditingAd(ad);
    setName(ad.name);
    setType(ad.type);
    setAdsenseCode(ad.adsenseCode || "");
    setImageUrl(ad.imageUrl || "");
    setTargetUrl(ad.targetUrl || "");
    setPosition(ad.position);
    setActive(ad.active);
    setError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name,
      type,
      adsenseCode: type === "ADSENSE" ? adsenseCode : null,
      imageUrl: type === "BANNER" ? imageUrl : null,
      targetUrl: type === "BANNER" ? targetUrl : null,
      position,
      active,
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
        setSuccess("Advertisement updated successfully!");
      } else {
        setAds([json.data.ad, ...ads]);
        setSuccess("Advertisement created successfully!");
      }

      setTimeout(() => {
        setIsFormOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (ad) => {
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;
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

  const getCTR = (impressions, clicks) => {
    if (!impressions) return "0.00%";
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white border rounded-xl shadow-sm space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Ads</div>
          <div className="text-3xl font-extrabold text-gray-900">{ads.length}</div>
        </div>
        <div className="p-5 bg-white border rounded-xl shadow-sm space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Eye size={14} className="text-blue-500" /> Impressions
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {ads.reduce((sum, a) => sum + (a.impressions || 0), 0)}
          </div>
        </div>
        <div className="p-5 bg-white border rounded-xl shadow-sm space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MousePointerClick size={14} className="text-emerald-500" /> Clicks
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {ads.reduce((sum, a) => sum + (a.clicks || 0), 0)}
          </div>
        </div>
        <div className="p-5 bg-white border rounded-xl shadow-sm space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Percent size={14} className="text-purple-500" /> Average CTR
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {getCTR(
              ads.reduce((sum, a) => sum + (a.impressions || 0), 0),
              ads.reduce((sum, a) => sum + (a.clicks || 0), 0)
            )}
          </div>
        </div>
      </div>

      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="text-blue-600" size={20} />
          Active Campaigns
        </h2>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <Plus size={16} /> Create Ad Unit
        </button>
      </div>

      {/* Form modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border">
            <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-900">
                {editingAd ? "Modify Ad Campaign" : "Provision New Ad Campaign"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
              {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{success}</div>}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Ad Unit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Sale Banner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ad Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="BANNER">Custom Upload Banner</option>
                    <option value="ADSENSE">Google AdSense Integration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Placement Location</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm"
                  >
                    <option value="HEADER">Header Announcement</option>
                    <option value="SIDEBAR">Sidebar Panel</option>
                    <option value="FOOTER">Footer Banner</option>
                    <option value="IN_CONTENT">In-Content Divider</option>
                  </select>
                </div>
              </div>

              {type === "BANNER" ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Banner Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/assets/banner.png"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Destination URL (Target Link)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/promotion"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full border rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">AdSense Code snippet</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="<!-- Google AdSense Code -->\n<ins class='adsbygoogle' ...></ins>"
                    value={adsenseCode}
                    onChange={(e) => setAdsenseCode(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm font-mono"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="active" className="text-sm font-semibold text-gray-700">
                  Enable and show this advertisement immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  {loading ? "Saving changes..." : "Save Advertisement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ads List */}
      {ads.length === 0 ? (
        <div className="py-12 border border-dashed rounded-xl bg-gray-50/50 text-center space-y-2">
          <Megaphone className="mx-auto text-gray-300" size={32} />
          <h3 className="font-bold text-gray-700">No advertisements provisioned</h3>
          <p className="text-xs text-gray-400">Deploy custom banners or AdSense configurations to monetise your traffic.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Type / Location</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Impressions</th>
                <th className="px-6 py-4 text-center">Clicks</th>
                <th className="px-6 py-4 text-center">CTR</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{ad.name}</div>
                    {ad.type === "BANNER" && ad.targetUrl && (
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        Destination link <ExternalLink size={10} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {ad.type === "BANNER" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 text-blue-600 px-2 py-0.5 text-xs font-medium">
                          <Image size={10} /> Custom Banner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-600 px-2 py-0.5 text-xs font-medium">
                          <Code size={10} /> AdSense Code
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-gray-500 text-xs font-semibold">{ad.position}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(ad)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        ad.active
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {ad.active ? (
                        <>
                          <CheckCircle size={12} /> Active
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">{ad.impressions ?? 0}</td>
                  <td className="px-6 py-4 text-center font-semibold text-gray-700">{ad.clicks ?? 0}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900">{getCTR(ad.impressions, ad.clicks)}</td>
                  <td className="px-6 py-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEditForm(ad)}
                      className="inline-flex p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition"
                      title="Edit Campaign"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="inline-flex p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition"
                      title="Delete Campaign"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
