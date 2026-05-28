import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import { formatTHB } from '../utils/format'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import RecentOrdersList from '../components/dashboard/RecentOrdersList'
import StockAlertCard from '../components/dashboard/StockAlertCard'
import RecentWasteCard from '../components/dashboard/RecentWasteCard'
import PromotionPerformanceCard from '../components/dashboard/PromotionPerformanceCard'

export default function Dashboard() {
  const [period, setPeriod] = useState('week');
  const { summary, isLoading } = useDashboard(period);

  const periodLabels = {
    today: 'วันนี้',
    week: 'สัปดาห์นี้',
    month: 'เดือนนี้',
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header Bar */}
      <div className="pt-4 px-6 pb-[14px] bg-white border-b border-brand-border-outer flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <div className="text-[20px] font-bold text-brand-text-primary">Dashboard Overview</div>
          <div className="text-[12px] text-brand-text-secondary mt-0.5">Welcome back, Thanachot. Here is what is happening today.</div>
        </div>

        <div className="flex items-center gap-6 hidden md:flex">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Revenue</span>
            </div>
            <div className="text-[18px] font-bold text-brand-text-primary">
              {isLoading ? '...' : formatTHB(summary?.revenue ?? 0)}
            </div>
          </div>
          <div className="w-[1px] h-8 bg-brand-border-inner"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] text-brand-text-secondary uppercase tracking-wider font-semibold">Total Orders</span>
            </div>
            <div className="text-[18px] font-bold text-brand-text-primary">
              {isLoading ? '...' : summary?.orders}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex flex-col gap-6">

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          {['today', 'week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                period === p
                  ? 'bg-brand-active-nav border-brand-border-active text-brand-text-primary shadow-sm'
                  : 'bg-white border-brand-border-outer text-brand-text-secondary hover:bg-brand-hover-row'
              }`}
            >
              {periodLabels[p]}
              {period === p && <ChevronDown size={11} className="text-brand-text-secondary" />}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={isLoading ? '...' : formatTHB(summary?.revenue ?? 0)}
            change="+12.5% from last week"
            changeColor="#1D9E75"
            dotColor="#1D9E75"
          />
          <StatCard
            label="Total Orders"
            value={isLoading ? '...' : summary?.orders ?? 0}
            change="+5.2% from last week"
            changeColor="#1D9E75"
            dotColor="#3D4A5C"
            href="/orders"
          />
          <StatCard
            label="Avg. Order Value"
            value={isLoading ? '...' : formatTHB(summary?.aov ?? 0)}
            change="-2.1% from last week"
            changeColor="#E24B4A"
            dotColor="#E24B4A"
          />
          <StatCard
            label="Active Tables"
            value={isLoading ? '...' : summary?.activeTables ?? 0}
            change="Currently occupied"
            changeColor="#6B7A8D"
            dotColor="#C96A00"
            href="/tables"
          />
        </div>

        {/* Middle Section: Chart and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Card */}
          <div className="lg:col-span-2 bg-white border border-brand-border-outer rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[14px] font-bold text-brand-text-primary">Revenue Trends</h3>
              <span className="text-[11px] text-brand-text-tertiary">Daily breakdown for this {period}</span>
            </div>
            <RevenueChart />
          </div>

          {/* Recent Orders List */}
          <div className="h-full">
            <RecentOrdersList />
          </div>
        </div>

        {/* Bottom Section: Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StockAlertCard />
          <RecentWasteCard />
          <PromotionPerformanceCard />
        </div>

      </div>
    </div>
  )
}
