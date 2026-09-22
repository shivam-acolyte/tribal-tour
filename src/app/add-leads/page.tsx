"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/lib/types";
import { Trash, LogOut, Search, Menu, X, LayoutDashboard, FileText, MessageCircle, Mail, Phone, Calendar } from "lucide-react";

export default function AdminLeads() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem("admin_auth_token");
      const tokenStr = sessionStorage.getItem("admin_auth_token");
      if (tokenStr) {
        const token = JSON.parse(tokenStr);
        if (Date.now() < token.expiry) return true;
        sessionStorage.removeItem("admin_auth_token");
      }
    } catch (e) {}
    return false;
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(() => {
    if (typeof window === "undefined") return "Admin";
    try {
      const tokenStr = sessionStorage.getItem("admin_auth_token");
      if (tokenStr) return JSON.parse(tokenStr).username || "Admin";
    } catch (e) {}
    return "Admin";
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        if (Array.isArray(data)) setLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    if (isLoggedIn) fetchLeads();
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setLoggedInUser(data.username);
        sessionStorage.setItem("admin_auth_token", JSON.stringify({ expiry: Date.now() + 60 * 60 * 1000, username: data.username }));
        try { localStorage.removeItem("admin_auth_token"); } catch {}
      } else {
        alert(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem("admin_auth_token");
      localStorage.removeItem("admin_auth_token");
    } catch {}
    router.push("/");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await fetch(`/api/leads/${id}`, { method: "DELETE" });
        setLeads(leads.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: status as any } : l)));
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: status as any });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl shadow-lg max-w-sm w-full border border-border">
          <h2 className="text-2xl font-bold text-center mb-6 font-heading">Admin Login</h2>
          <input type="text" placeholder="Username" className="w-full mb-4 p-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full mb-6 p-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-primary text-primary-foreground p-3 rounded-xl font-semibold hover:opacity-90 transition">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/10 text-sm relative">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className={`absolute md:relative z-50 w-80 max-w-[85vw] bg-card border-r flex flex-col h-full shadow-sm transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 border-b flex justify-between items-center bg-muted/20">
          <div><h2 className="font-bold text-lg font-heading">Leads ({leads.length})</h2><p className="text-xs text-muted-foreground">Hi, {loggedInUser} 👋</p></div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-muted-foreground hover:bg-muted p-2 rounded-lg transition"><X size={18} /></button>
            <button onClick={handleLogout} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition"><LogOut size={18} /></button>
          </div>
        </div>

        <div className="p-4 border-b flex flex-col gap-3">
          <div className="flex bg-background rounded-lg p-1 border mb-2 overflow-x-auto">
            <button onClick={() => router.push("/add-tours")} className="flex-1 flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground py-1.5 px-2 rounded text-xs font-medium transition whitespace-nowrap"><LayoutDashboard size={14} /> Tours</button>
            <button onClick={() => router.push("/add-blogs")} className="flex-1 flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground py-1.5 px-2 rounded text-xs font-medium transition whitespace-nowrap"><FileText size={14} /> Blogs</button>
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-1.5 px-2 rounded shadow-sm text-xs font-semibold whitespace-nowrap"><MessageCircle size={14} /> Leads</button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-muted/30" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {leads.filter((l) => (l.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (l.email || "").toLowerCase().includes(searchQuery.toLowerCase())).map((lead) => (
            <div key={lead.id} onClick={() => { setSelectedLead(lead); setIsSidebarOpen(false); }} className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition ${selectedLead?.id === lead.id ? "bg-primary/10 border-primary/20 border" : "hover:bg-muted"}`}>
              <div className="overflow-hidden pr-2">
                <p className="font-bold text-sm truncate">{lead.name}</p>
                <p className="text-xs text-muted-foreground truncate mb-1">{lead.subject}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${lead.status === "New" ? "bg-blue-100 text-blue-700" : lead.status === "Contacted" ? "bg-orange/20 text-orange" : "bg-green-100 text-green-700"}`}>{lead.status}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(lead.id!); }} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition shrink-0"><Trash size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-background relative">
        <div className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-muted-foreground hover:bg-muted p-1.5 rounded-lg transition shrink-0"><Menu size={20} /></button>
            <h1 className="text-lg md:text-xl font-bold font-heading truncate">Lead Details</h1>
          </div>
          {selectedLead && (
            <select value={selectedLead.status} onChange={(e) => updateStatus(selectedLead.id!, e.target.value)} className="px-3 py-1.5 border rounded-lg bg-card text-sm font-medium outline-none focus:ring-2 focus:ring-primary">
              <option value="New">Status: New</option>
              <option value="Contacted">Status: Contacted</option>
              <option value="Closed">Status: Closed</option>
            </select>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10">
          {selectedLead ? (
            <div className="max-w-3xl mx-auto bg-card rounded-2xl border shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div><h2 className="text-2xl font-bold font-heading">{selectedLead.name}</h2><p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><Calendar size={14} /> {new Date(selectedLead.created_at!).toLocaleString()}</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Email</p><a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 font-medium text-primary hover:underline"><Mail size={16} /> {selectedLead.email}</a></div>
                  <div><p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Phone</p><a href={`https://wa.me/${selectedLead.phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-primary hover:underline"><Phone size={16} /> {selectedLead.phone || "Not Provided"}</a></div>
                </div>
                <div>
                  <div><p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Subject</p><p className="font-medium">{selectedLead.subject}</p></div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2 border-t pt-6">Message</p>
                <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">{selectedLead.message}</div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">Select a lead from the sidebar to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
