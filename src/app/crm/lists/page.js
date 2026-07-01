"use client";

import { useState, useEffect } from "react";
import { UsersRound, Trash2, Plus, Users } from "lucide-react";

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newList, setNewList] = useState({ name: "", description: "" });

  const siteId = typeof window !== "undefined" ? localStorage.getItem("x-site-id") || "demo" : "demo";

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/lists", {
        headers: { "x-site-id": siteId }
      });
      const data = await res.json();
      if (data.success) {
        setLists(data.data.lists || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
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
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Subscriber Lists
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Segment your audiences into clean marketing lists
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
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
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-semibold">
            Create List
          </button>
        </form>
      )}

      {/* Grid of lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 col-span-full">Loading lists...</div>
        ) : lists.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 col-span-full">No lists created yet. Click "New List" to add one.</div>
        ) : (
          lists.map((list) => (
            <div key={list.id} className="p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{list.name}</h3>
                  <div className="flex p-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded">
                    <UsersRound size={12} />
                  </div>
                </div>
                <p className="text-xs text-slate-450 dark:text-slate-400 line-clamp-2 min-h-8">
                  {list.description || "No description provided."}
                </p>
                <div className="flex items-center gap-1 mt-3 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <Users size={12} />
                  <span>{list._count?.subscribers || 0} Contacts</span>
                </div>
              </div>

              <div className="flex gap-1 justify-end items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => handleDelete(list.id)}
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
