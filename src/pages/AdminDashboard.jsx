import React, { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Map,
  Phone,
  Send,
  Users,
  Home,
  Settings,
  User,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("incident");

  const tabs = [
    { id: "incident", label: "Incident Report", icon: AlertTriangle },
    { id: "typhoon", label: "Typhoon Tracking", icon: MapPin },
    { id: "map", label: "Interactive Map", icon: Map },
    { id: "hotline", label: "Hotline Numbers", icon: Phone },
    { id: "broadcast", label: "Broadcast", icon: Send },
    { id: "users", label: "User Management", icon: Users },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-blue-950 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">Admin Dashboard</h1>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-slate-200 px-2 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-96">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {currentTab?.label}
            </h2>
            <p className="text-slate-500 text-sm">
              Content for {currentTab?.label} will be displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
