import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCreator } from '../hooks/useCreator';
import { api, DashboardStats } from '../lib/api';
import { Link } from 'react-router-dom';
import { CreatorSetup } from '../components/CreatorSetup';
import {
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  Plus,
  Eye,
  Edit,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { creator, isLoading: creatorLoading } = useCreator();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (creator) {
      loadDashboardStats();
    }
  }, [creator]);

  const loadDashboardStats = async () => {
    if (!creator?.id) return;

    try {
      setIsLoading(true);
      // Get dashboard stats from API
      const [statsResponse, transactionsResponse] = await Promise.all([
        api.getDashboardStats(creator.id),
        api.getLatestTransactions(creator.id, 10)
      ]);

      setStats(statsResponse.summary);
      setRecentTransactions(transactionsResponse.transactions || []);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard data');
      // Set empty stats on error
      setStats({
        totalRevenue: 0,
        totalTransactions: 0,
        publishedLinks: 0,
        revenueByCurrency: {},
        recentRevenue: 0,
      });
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Show creator setup if user doesn't have a creator profile
  if (!creatorLoading && !creator) {
    return <CreatorSetup />;
  }

  if (isLoading || creatorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%',
    },
    {
      title: 'Transactions',
      value: stats?.totalTransactions.toString() || '0',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8.2%',
    },
    {
      title: 'Payment Links',
      value: stats?.publishedLinks.toString() || '0',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+3',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {creator?.name}! Here's your monetization overview.
            </p>
          </div>
          <div className="flex space-x-3">
            {/* Landing page creation removed as per requirements */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Revenue Chart Coming Soon</p>
                <p className="text-sm">Detailed analytics will be available here</p>
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {recentTransactions.slice(0, 5).map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{transaction.customerName}</p>
                    <p className="text-sm text-gray-600">{transaction.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${transaction.amount} {transaction.currency}
                    </p>
                    <p className={`text-sm ${
                      transaction.status === 'successful'
                        ? 'text-green-600'
                        : transaction.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
              {(!recentTransactions || recentTransactions.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/payment-links" className="group">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-700">
                      Manage Payment Links
                    </h4>
                    <p className="text-sm text-gray-600">Create and edit payment options</p>
                  </div>
                </div>
              </Link>

              <Link to="/settings" className="group">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-green-700">
                      Profile Settings
                    </h4>
                    <p className="text-sm text-gray-600">Update your creator profile</p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}