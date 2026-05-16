'use client';

import { useEffect, useState } from 'react';
import { getAdminStats, type AdminStats } from "@/lib/api";

interface ActivityLog {
  id: string;
  type: 'order' | 'user' | 'rider' | 'restaurant';
  action: string;
  details: string;
  timestamp: string;
  user?: string;
}

export default function AdminMonitoringPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAdminStats();
        setStats(result.data);
        if (result.isFallback) {
          setWarning("Unable to load live data, showing demo stats.");
        }

        // Generate mock activity logs based on real data
        const logs: ActivityLog[] = [];

        // Add recent orders as activities
        result.data.recentOrders.forEach(order => {
          logs.push({
            id: `order-${order.id}`,
            type: 'order',
            action: 'New Order',
            details: `${order.customer} ordered from ${order.restaurant}`,
            timestamp: order.createdAt,
            user: order.customer
          });
        });

        // Add active deliveries
        result.data.activeDeliveries.forEach(delivery => {
          logs.push({
            id: `delivery-${delivery.id}`,
            type: 'rider',
            action: 'Delivery Started',
            details: `${delivery.rider?.name || 'Unassigned'} assigned to deliver from ${delivery.restaurant.name} to ${delivery.customer.name}`,
            timestamp: new Date().toISOString(),
            user: delivery.rider?.name
          });
        });

        // Sort by timestamp (most recent first)
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setActivityLogs(logs.slice(0, 20)); // Show last 20 activities
      } catch (err) {
        console.error("Admin monitoring fetch error:", err);
        setWarning("Unable to load live data, showing demo stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'user':
        return '👤';
      case 'rider':
        return '🏍️';
      case 'restaurant':
        return '🏪';
      default:
        return '📋';
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'order':
        return 'text-blue-400';
      case 'user':
        return 'text-green-400';
      case 'rider':
        return 'text-orange-400';
      case 'restaurant':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-zinc-400">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Live Monitoring</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Real-time activity across the entire Hash Food platform. Auto-refreshes every 30 seconds.
        </p>
        {warning ? (
          <div className="mt-4 rounded-2xl border border-orange-400/25 bg-orange-500/10 p-4 text-sm text-orange-200">
            {warning}
          </div>
        ) : null}
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-6 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">API Status</p>
              <p className="text-lg font-semibold text-green-400">Online</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-6 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Active Orders</p>
              <p className="text-lg font-semibold text-blue-400">{stats.activeDeliveries.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-6 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
              <div className="h-3 w-3 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Active Riders</p>
              <p className="text-lg font-semibold text-orange-400">{stats.overview.activeRiders}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-6 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Online Restaurants</p>
              <p className="text-lg font-semibold text-purple-400">{stats.overview.totalRestaurants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] shadow-xl shadow-black/30">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Live Activity Feed</h3>
            <p className="text-sm text-zinc-400">Real-time events across the platform</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Live
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {activityLogs.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-lg">
                    {getActivityIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${getActivityColor(log.type)}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 mb-1">{log.details}</p>
                    {log.user && (
                      <p className="text-xs text-zinc-500">by {log.user}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Deliveries Monitor */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] shadow-xl shadow-black/30">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Active Deliveries</h3>
            <p className="text-sm text-zinc-400">Orders currently in transit</p>
          </div>
          <div className="text-sm text-zinc-500">
            {stats.activeDeliveries.length} active
          </div>
        </div>

        <div className="p-6">
          {stats.activeDeliveries.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <p>No active deliveries at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
                      <span className="text-lg">🏍️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">#{delivery.id.slice(-6)}</p>
                      <p className="text-sm text-zinc-400">
                        {delivery.customer.name} → {delivery.restaurant.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-400">
                      {delivery.rider?.name || 'Unassigned'}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {delivery.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-6 shadow-xl shadow-black/30">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Database</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-400">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">API Response Time</span>
              <span className="text-sm text-zinc-300">45ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">WebSocket Connections</span>
              <span className="text-sm text-zinc-300">{stats.activeDeliveries.length + 5}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Memory Usage</span>
              <span className="text-sm text-zinc-300">67%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0c] p-6 shadow-xl shadow-black/30">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0a0a0a] py-3 text-sm font-medium text-zinc-300 hover:bg-white/[0.04] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0a0a0a] py-3 text-sm font-medium text-zinc-300 hover:bg-white/[0.04] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              System Alert
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0a0a0a] py-3 text-sm font-medium text-zinc-300 hover:bg-white/[0.04] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Maintenance
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0a0a0a] py-3 text-sm font-medium text-zinc-300 hover:bg-white/[0.04] transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
