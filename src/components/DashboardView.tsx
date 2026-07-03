import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Send,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Receipt,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { BusinessState, LedgerItem, Invoice, Activity } from "../types";

interface DashboardProps {
  state: BusinessState;
  onAskNova: (prompt: string) => void;
  onQuickViewCustomer: (customerName: string) => void;
  setView: (view: any) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ state, onAskNova, onQuickViewCustomer, setView }) => {
  const [prompt, setPrompt] = useState("");

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onAskNova(prompt);
    setPrompt("");
  };

  // Calculations for KPI numbers based on state ledger and invoices
  const totalDues = state.ledger
    .filter(item => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalCredits = state.ledger
    .filter(item => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const monthlyRevenue = state.invoices
    .filter(inv => inv.status === "Paid" && inv.date.includes("2026-06") || inv.date.includes("2026-05"))
    .reduce((sum, inv) => sum + inv.amount, 0) || 18245.30; // default/simulated value

  const overdueAmount = state.invoices
    .filter(inv => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Simulated cash flow timeline for chart (4 weeks)
  const chartData = [
    { name: "Week 1", Balance: state.startingBalance * 0.72 },
    { name: "Week 2", Balance: state.startingBalance * 0.88 },
    { name: "Week 3", Balance: state.startingBalance * 0.79 },
    { name: "Week 4", Balance: state.startingBalance },
  ];

  return (
    <div id="dashboard-view-container" className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 text-neutral-900 bg-[#EAE7E4]">
      {/* Ask A.A.R.Y.A bar - Pinned top */}
      <div className="mb-8">
        <form onSubmit={handleAskSubmit} className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#141414]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider hidden sm:inline bg-[#141414]/10 px-1.5 py-0.5 rounded text-[#141414]">A.A.R.Y.A AI</span>
          </div>
          <input
            type="text"
            id="dashboard-prompt-input"
            placeholder="Ask A.A.R.Y.A: 'Who owes me money?' or 'How can I optimize cash flow?'..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full pl-12 sm:pl-32 pr-12 py-4 bg-white border border-[#E5E7EB] hover:border-neutral-300 focus:border-[#141414] focus:ring-1 focus:ring-[#141414] rounded-2xl text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            id="dashboard-prompt-send"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#141414] text-[#FF3B30] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Greeting + Primary Cash Position */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest">
            {state.industry.toUpperCase()} &bull; CAPITAL DASHBOARD
          </p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 tracking-tight mt-1">
            Good day, {state.userEmail?.split("@")[0] || "Partner"}
          </h2>
        </div>

        {/* Total Cash Position Display Card */}
        <div className="bg-[#141414] border border-[#000000] rounded-3xl p-6 min-w-[280px] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF3B30]/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-center text-[#CECDCA] relative z-10">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">CASH LIQUIDITY POSITION</span>
            <span className="text-[10px] bg-[#FF3B30] text-white px-2 py-0.5 rounded-full font-mono font-bold">OPERATIONAL</span>
          </div>
          <div className="text-4xl font-heading font-bold text-[#FF3B30] tracking-tight mt-2 tabular-nums relative z-10">
            {state.currencySymbol}{state.startingBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-[#CECDCA] mt-1 relative z-10">
            Linked ledger bank balance. Last synchronized just now.
          </p>
        </div>
      </div>

      {/* Row of 3 Stat Cards (Total Dues, Month Revenue, Overdue Amount) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Dues */}
        <div className="bg-white border border-[#E2E1DE] hover:border-neutral-400 transition-all rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Ledger Owed</span>
            <div className="w-8 h-8 rounded-xl bg-[#F4F2F0] flex items-center justify-center text-[#141414]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-heading font-bold text-neutral-900 tracking-tight tabular-nums">
              {state.currencySymbol}{totalDues.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="text-[#FF3B30] font-semibold font-mono">-{state.currencySymbol}{totalCredits.toLocaleString("en-US", { maximumFractionDigits: 0 })} our credits</span>
              <span className="text-neutral-400">&bull; {state.ledger.length} customer nodes</span>
            </div>
          </div>
        </div>

        {/* Card 2: This Month Revenue */}
        <div className="bg-white border border-[#E2E1DE] hover:border-neutral-400 transition-all rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-[#F4F2F0] flex items-center justify-center text-[#141414]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-heading font-bold text-neutral-900 tracking-tight tabular-nums">
              {state.currencySymbol}{monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-500">
              <span className="text-[#FF3B30] font-semibold font-mono">+14.2%</span>
              <span>from previous business quarter</span>
            </div>
          </div>
        </div>

        {/* Card 3: Overdue Amount */}
        <div className="bg-[#FF3B30] text-white border border-[#FF3B30] hover:scale-[1.01] transition-all rounded-3xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between text-white/80 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">Overdue Amount</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <div className="text-3xl font-heading font-bold text-white tracking-tight tabular-nums">
              {state.currencySymbol}{overdueAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-white/90">
              <span className="font-semibold font-mono bg-white text-[#FF3B30] px-1.5 py-0.5 rounded-md">Action required</span>
              <span>&bull; Uncollected invoices past term</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Line Chart Bento & Top Debtor summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left 2 Cols: Cash Flow Area Chart */}
        <div className="bg-white border border-[#E2E1DE] rounded-3xl p-6 lg:col-span-2 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">Operational Cash Cycles</h3>
              <p className="text-[11px] text-neutral-500">Weekly trend based on starting liquidity and collections</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] inline-block shadow shadow-[#FF3B30]/25"></span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold uppercase">Cash Level</span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F2F0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#8E8D8A" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#8E8D8A" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#E2E1DE", borderRadius: "16px", color: "#111827", fontSize: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)" }}
                  formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, "Cash Balance"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="Balance" 
                  stroke="#141414" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCash)" 
                  dot={{ r: 4, strokeWidth: 2, stroke: "#141414", fill: "#FF3B30" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#FF3B30" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Top Debtors quick summary */}
        <div className="bg-white border border-[#E2E1DE] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-base text-neutral-900">Ledger Risks</h3>
              <button 
                onClick={() => setView("ledger")}
                className="text-[10px] text-[#FF3B30] hover:underline font-mono font-bold uppercase tracking-wider"
              >
                Go to Ledger
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 mb-4">Outstanding customer accounts sorted by priority action.</p>

            <div className="space-y-3.5">
              {state.ledger.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onQuickViewCustomer(item.name)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F2F0]/50 border border-[#E2E1DE] hover:border-neutral-400 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      item.overdue ? "bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/20" : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {item.initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-neutral-900 truncate">{item.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {item.overdue ? "OVERDUE TERM" : "PENDING TERM"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-heading font-bold tabular-nums ${item.amount < 0 ? "text-[#141414]" : item.overdue ? "text-[#FF3B30]" : "text-neutral-700"}`}>
                      {item.amount < 0 ? "" : state.currencySymbol}{item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-neutral-500 font-mono">due {item.dueDate || "N/A"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E1DE] mt-4">
            <button 
              onClick={() => onAskNova("Who owes me money?")}
              className="w-full py-2.5 rounded-xl bg-[#F4F2F0] border border-[#E2E1DE] hover:border-[#141414] hover:bg-[#EAE7E4] text-[#141414] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF3B30]" />
              <span>Simulate collection dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white border border-[#E2E1DE] rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-heading font-bold text-base text-neutral-900">Active Audit Log</h3>
            <p className="text-[11px] text-neutral-500">Verifiable trace of ledger entries, billings, and cfo operations</p>
          </div>
          <button 
            onClick={() => setView("audit")}
            className="text-[10px] text-neutral-500 hover:text-[#FF3B30] font-mono font-bold uppercase tracking-wider"
          >
            Full Trail
          </button>
        </div>

        <div className="space-y-4">
          {state.activities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-start justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  {activity.actionType === "billing" && <Receipt className="w-4 h-4 text-neutral-400" />}
                  {activity.actionType === "ledger" && <CheckCircle className="w-4 h-4 text-[#FF3B30]" />}
                  {activity.actionType === "chat" && <Sparkles className="w-4 h-4 text-[#FF3B30]" />}
                  {activity.actionType === "onboarding" && <Clock className="w-4 h-4 text-neutral-400" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-800">
                    {activity.description}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {activity.timestamp} &bull; action: {activity.actionType.toUpperCase()} {activity.customer && `• Customer: ${activity.customer}`}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs font-mono font-semibold tabular-nums text-neutral-600">
                {state.currencySymbol}{activity.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
