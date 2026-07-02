"use client";

import { useState, useEffect } from "react";
import { UsersRound, Trash2, Plus, Users, CheckSquare, Square, AlertTriangle } from "lucide-react";

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newList, setNewList] = useState({ name: "", description: "" });
  const [siteId, setSiteId] = useState("");
  const [saveError, setSaveError] = useState(null);

  const [selected, setSelected] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem("x-site-id") || process.env.NEXT_PUBLIC_SITE_ID || "";
    setSiteId(id);
  }, []);

  useEffect(() => {
    if (siteId) fetchLists();
  }, [siteId]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const [resLists, resSubs] = await Promise.all([
        fetch("/api/crm/lists", { headers: { "x-site-id": siteId } }),
        fetch("/api/crm/subscribers?take=1", { headers: { "x-site-id": siteId } })
      ]);
      const dataLists = await resLists.json();
      const dataSubs = await resSubs.json();

      if (dataLists.success) {
        setLists(dataLists.data?.lists || []);
        setSelected(new Set());
      }
      if (dataSubs.success) {
        setTotalSubscribers(dataSubs.data?.total || 0);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaveError(null);
    if (!siteId) return setSaveError("Site ID not loaded yet. Please wait.");
    try {
      const res = await fetch("/api/crm/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-site-id": siteId
        },
        body: JSON.stringify(newList)
      });
      const data = await res.json();
      if (data.success) {
        setNewList({ name: "", description: "" });
        setShowAddForm(false);
        fetchLists();
      } else {
        setSaveError(data.error || "Failed to create list.");
      }
    } catch (err) {
      console.error(err);
      setSaveError("Network error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subscriber list? Subscribers will not be deleted.")) return;
    try {
      const res = await fetch(`/api/crm/lists/${id}`, {
        method: "DELETE",
        headers: { "x-site-id": siteId }
      });
      const data = await res.json();
      if (data.success) {
        fetchLists();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk select helpers
  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === lists.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(lists.map(l => l.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected list(s)? Subscribers inside them will NOT be deleted.`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(
        [...selected].map(id =>
          fetch(`/api/crm/lists/${id}`, { method: "DELETE", headers: { "x-site-id": siteId } })
        )
      );
      await fetchLists();
    } catch (err) {
      console.error(err);
    }
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Subscriber Lists
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Segment your audiences into clean marketing lists. Total subscribers on site: <span className="font-bold text-slate-800 dark:text-slate-200">{totalSubscribers}</span>
          </p>
        </div>

        <button
          onClick={() => { setShowAddForm(!showAddForm); setSaveError(null); }}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={14} /> New List
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 max-w-xl">
          <h3 className="text-sm font-bold">New Subscriber List</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="List Name"
              required
              value={newList.name}
              onChange={(e) => setNewList({ ...newList, name: e.target.value })}
              className="p-2 border rounded text-xs dark:bg-slate-900 w-full"
            />
            <textarea
              placeholder="Description"
              value={newList.description}
              onChange={(e) => setNewList({ ...newList, description: e.target.value })}
              className="p-2 border rounded text-xs dark:bg-slate-900 w-full"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition">
              Create List
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setSaveError(null); }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            {saveError && <p className="text-red-500 text-xs font-semibold">{saveError}</p>}
          </div>
        </form>
      )}

      {/* Bulk Actions Bar */}
      {!loading && lists.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-semibold transition"
          >
            {selected.size === lists.length
              ? <CheckSquare size={14} className="text-indigo-600" />
              : <Square size={14} />}
            {selected.size === lists.length ? "Deselect All" : "Select All"}
          </button>
          <span className="text-xs text-slate-400">{selected.size > 0 ? `${selected.size} selected` : `${lists.length} total`}</span>
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-60"
            >
              <Trash2 size={12} />
              {bulkDeleting ? "Deleting..." : `Delete ${selected.size} Selected`}
            </button>
          )}
          {lists.length > 1 && selected.size === 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
              <AlertTriangle size={11} /> Select lists to bulk-delete duplicates
            </span>
          )}
        </div>
      )}

      {/* Grid of lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 col-span-full">Loading lists...</div>
        ) : lists.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 col-span-full">No lists created yet. Click "New List" to add one.</div>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              onClick={() => toggleSelect(list.id)}
              className={`p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex flex-col justify-between hover:shadow-sm transition cursor-pointer ${selected.has(list.id) ? "ring-2 ring-indigo-500 border-indigo-400" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {selected.has(list.id)
                      ? <CheckSquare size={13} className="text-indigo-600 flex-shrink-0" />
                      : <Square size={13} className="text-slate-300 flex-shrink-0" />}
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{list.name}</h3>
                  </div>
                  <div className="flex p-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded">
                    <UsersRound size={12} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-8">
                  {list.description || "No description provided."}
                </p>
                <div className="flex items-center gap-1 mt-3 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <Users size={12} />
                  <span>{list._count?.subscribers || 0} Contacts</span>
                </div>
              </div>

              <div className="flex gap-1 justify-end items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(list.id); }}
                  className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
