import React, { useState } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  FileText, 
  TrendingUp, 
  History, 
  Settings, 
  Home, 
  LogOut,
  Sparkles,
  DollarSign,
  MoreHorizontal,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ViewType } from "../types";

interface NavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  businessName: string;
  onLogout: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export const Sidebar: React.FC<NavProps> = ({ currentView, setView, businessName, onLogout, theme, setTheme }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "chat", label: "CFO AI Chat", icon: Bot, badge: "AI" },
    { id: "ledger", label: "Ledger", icon: BookOpen },
    { id: "billing", label: "Billing & Invoices", icon: FileText },
    { id: "intelligence", label: "Revenue Intel", icon: TrendingUp },
    { id: "audit", label: "Audit Trail", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside id="desktop-sidebar" className="hidden lg:flex flex-col w-64 bg-[#141414] border-r border-[#000000] h-screen sticky top-0 text-white select-none">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#000000] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#FF3B30] flex items-center justify-center text-[#0A0A0A] font-bold text-lg">
          A
        </div>
        <div>
          <h1 className="font-heading font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            A.A.R.Y.A <span className="text-[10px] bg-white/10 text-[#FF3B30] px-1.5 py-0.5 rounded font-mono font-medium">CFO</span>
          </h1>
          <p className="text-[10px] text-[#CECDCA] truncate max-w-[140px]">{businessName}</p>
        </div>
      </div>

      {/* Primary Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[#CECDCA] px-3 mb-3">
          Core Operations
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setView(item.id as ViewType)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-[#FF3B30] text-white shadow-md shadow-[#FF3B30]/20"
                  : "text-[#CECDCA] hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isActive ? "bg-black/20 text-white" : "bg-[#FF3B30]/25 text-[#FF3B30]"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 border-t border-[#000000] mt-6">
          <div className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[#CECDCA] px-3 mb-3">
            Marketing & Demo
          </div>
          <button
            id="nav-link-landing"
            onClick={() => setView("landing")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
              currentView === "landing"
                ? "bg-white/10 text-white"
                : "text-[#CECDCA] hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FF3B30]" />
            <span>Product Pitch</span>
          </button>
        </div>
      </nav>

      {/* Theme Toggle section inside sidebar */}
      <div className="px-6 py-4 border-t border-[#000000]/60 flex items-center justify-between text-xs font-medium text-[#CECDCA] bg-[#0d0d0d]/40">
        <div className="flex items-center gap-2.5">
          {theme === "dark" ? <Moon className="w-4 h-4 text-[#FF3B30]" /> : <Sun className="w-4 h-4 text-[#FF3B30]" />}
          <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
        </div>
        <button
          type="button"
          id="sidebar-theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-neutral-800"
          style={{ backgroundColor: theme === "dark" ? "#FF3B30" : "#262626" }}
        >
          <span
            className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            style={{ transform: theme === "dark" ? "translateX(16px)" : "translateX(0)" }}
          />
        </button>
      </div>

      {/* User Footer block */}
      <div className="p-4 border-t border-[#000000] flex items-center justify-between gap-3 bg-[#0A0A0A]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-bold text-[#FF3B30]">
            CF
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">Business Owner</div>
            <div className="text-[10px] text-[#CECDCA] truncate">CFO Live Agent</div>
          </div>
        </div>
        <button
          id="nav-logout-btn"
          onClick={onLogout}
          title="Logout"
          className="p-2 rounded-lg text-[#CECDCA] hover:text-[#FF3B30] hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export const BottomNav: React.FC<{
  currentView: ViewType;
  setView: (view: ViewType) => void;
}> = ({ currentView, setView }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "ledger", label: "Ledger", icon: BookOpen },
    { id: "chat", label: "Chat", icon: Bot, isElevated: true },
    { id: "billing", label: "Billing", icon: FileText },
    { id: "more", label: "More", icon: MoreHorizontal },
  ];

  const moreOptions = [
    { id: "intelligence", label: "Revenue Intel", icon: TrendingUp, description: "Forecasting & growth analytics" },
    { id: "audit", label: "Audit Trail", icon: History, description: "Verifiable log & active events" },
    { id: "settings", label: "Settings", icon: Settings, description: "System configuration & metadata" },
  ];

  const isMoreActive = ["intelligence", "audit", "settings"].includes(currentView);

  return (
    <>
      {/* Backdrop for More menu */}
      <AnimatePresence>
        {isMoreOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsMoreOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* More Options Popover Menu */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="lg:hidden fixed bottom-[90px] left-4 right-4 bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xl z-40 space-y-2.5"
          >
            <div className="px-1 pb-1.5 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#141414] uppercase tracking-wider font-heading">
                More Intelligence Modules
              </span>
              <button 
                onClick={() => setIsMoreOpen(false)}
                className="text-[10px] text-neutral-400 hover:text-neutral-700 font-medium"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-1">
              {moreOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = currentView === option.id;
                return (
                  <button
                    key={option.id}
                    id={`mobile-more-option-${option.id}`}
                    onClick={() => {
                      setView(option.id as ViewType);
                      setIsMoreOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? "bg-[#141414]/5 text-[#141414]"
                        : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-[#141414] text-[#FF3B30]"
                        : "bg-neutral-100 text-neutral-500"
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-neutral-900">{option.label}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{option.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center">
        <nav id="mobile-bottom-nav" className="w-full max-w-md bg-[#141414] rounded-full px-3 py-2 flex items-center justify-around text-white shadow-2xl border border-neutral-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isMore = tab.id === "more";
            const isActive = isMore ? isMoreActive : currentView === tab.id;

            if (tab.isElevated) {
              return (
                <button
                  key={tab.id}
                  id={`mobile-tab-${tab.id}`}
                  onClick={() => {
                    setView(tab.id as ViewType);
                    setIsMoreOpen(false);
                  }}
                  className="flex flex-col items-center justify-center transition-transform active:scale-95 mx-1"
                >
                  <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-all bg-neutral-950 border border-neutral-800 shadow-lg ${
                    isActive ? "ring-2 ring-[#FF3B30]" : ""
                  }`}>
                    <Bot className="w-5.5 h-5.5 text-[#FF3B30]" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => {
                  if (isMore) {
                    setIsMoreOpen(!isMoreOpen);
                  } else {
                    setView(tab.id as ViewType);
                    setIsMoreOpen(false);
                  }
                }}
                className={`flex items-center gap-1.5 py-2 px-3 rounded-full text-xs min-w-[48px] transition-all duration-200 ${
                  isActive 
                    ? "bg-white text-[#141414] font-bold shadow-sm" 
                    : "text-[#CECDCA] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {isActive && (
                  <span className="text-[10px] tracking-tight font-medium hidden xs:inline">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
