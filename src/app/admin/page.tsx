'use client';

import { useState, useEffect } from 'react';
import { 
  Tag, 
  FileText, 
  MessageSquare, 
  Mail, 
  ArrowUpRight,
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  deals: number;
  blogPosts: number;
  contacts: number;
  unreadContacts: number;
  subscribers: number;
}

interface RecentActivity {
  type: 'deal' | 'blog' | 'contact' | 'subscriber';
  title: string;
  time: string;
  id?: number;
}

const quickActions = [
  { label: 'הוסף דיל חדש', href: '/admin/deals/new', icon: Tag, color: 'bg-blue-500' },
  { label: 'כתוב פוסט', href: '/admin/blog/new', icon: FileText, color: 'bg-purple-500' },
  { label: 'צפה בפניות', href: '/admin/contacts', icon: MessageSquare, color: 'bg-green-500' },
];

function formatTimeAgo(date: Date | string | null): string {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'עכשיו';
  if (diffInSeconds < 3600) return `לפני ${Math.floor(diffInSeconds / 60)} דקות`;
  if (diffInSeconds < 86400) return `לפני ${Math.floor(diffInSeconds / 3600)} שעות`;
  if (diffInSeconds < 172800) return 'אתמול';
  return `לפני ${Math.floor(diffInSeconds / 86400)} ימים`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    deals: 0,
    blogPosts: 0,
    contacts: 0,
    unreadContacts: 0,
    subscribers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [dealsRes, blogRes, contactsRes, subscribersRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/blog'),
        fetch('/api/contacts'),
        fetch('/api/subscribers'),
      ]);

      const [deals, blogPosts, contacts, subscribers] = await Promise.all([
        dealsRes.json(),
        blogRes.json(),
        contactsRes.json(),
        subscribersRes.json(),
      ]);

      // Calculate stats
      const activeDeals = Array.isArray(deals) ? deals.filter((d: any) => d.isActive).length : 0;
      const totalBlogPosts = Array.isArray(blogPosts) ? blogPosts.length : 0;
      const totalContacts = Array.isArray(contacts) ? contacts.length : 0;
      const unreadContacts = Array.isArray(contacts) ? contacts.filter((c: any) => !c.isRead).length : 0;
      const totalSubscribers = Array.isArray(subscribers) ? subscribers.filter((s: any) => s.isActive).length : 0;

      setStats({
        deals: activeDeals,
        blogPosts: totalBlogPosts,
        contacts: unreadContacts,
        unreadContacts,
        subscribers: totalSubscribers,
      });

      // Build recent activity from real data
      const activities: RecentActivity[] = [];

      // Add recent deals
      if (Array.isArray(deals)) {
        deals.slice(0, 2).forEach((deal: any) => {
          activities.push({
            type: 'deal',
            title: `דיל: ${deal.title}`,
            time: formatTimeAgo(deal.createdAt),
            id: deal.id,
          });
        });
      }

      // Add recent blog posts
      if (Array.isArray(blogPosts)) {
        blogPosts.slice(0, 2).forEach((post: any) => {
          activities.push({
            type: 'blog',
            title: `פוסט: ${post.title}`,
            time: formatTimeAgo(post.createdAt),
            id: post.id,
          });
        });
      }

      // Add recent contacts
      if (Array.isArray(contacts)) {
        contacts.slice(0, 2).forEach((contact: any) => {
          activities.push({
            type: 'contact',
            title: `פנייה מ${contact.name}`,
            time: formatTimeAgo(contact.createdAt),
            id: contact.id,
          });
        });
      }

      // Add recent subscribers
      if (Array.isArray(subscribers)) {
        const recentSubs = subscribers.slice(0, 2);
        if (recentSubs.length > 0) {
          activities.push({
            type: 'subscriber',
            title: `${recentSubs.length} מנויים חדשים לניוזלטר`,
            time: formatTimeAgo(recentSubs[0]?.subscribedAt),
          });
        }
      }

      // Sort by most recent (this is a simple sort, in real app you'd parse dates)
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { 
      label: 'דילים פעילים', 
      value: stats.deals,
      icon: Tag, 
      color: 'bg-blue-500',
      href: '/admin/deals'
    },
    { 
      label: 'פוסטים בבלוג', 
      value: stats.blogPosts,
      icon: FileText, 
      color: 'bg-purple-500',
      href: '/admin/blog'
    },
    { 
      label: 'פניות חדשות', 
      value: stats.contacts,
      icon: MessageSquare, 
      color: 'bg-green-500',
      href: '/admin/contacts'
    },
    { 
      label: 'מנויי ניוזלטר', 
      value: stats.subscribers,
      icon: Mail, 
      color: 'bg-orange-500',
      href: '/admin/subscribers'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">שלום! 👋</h1>
        <p className="text-primary-100 text-lg">
          ברוכים הבאים למערכת הניהול של S-Tours. כאן תוכלו לנהל את כל התוכן באתר.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 ${stat.color} rounded-xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.value > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800">{stat.value.toLocaleString()}</div>
              <div className="text-slate-500">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">פעולות מהירות</h2>
          <div className="grid gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
              >
                <div className={`p-3 ${action.color} rounded-xl text-white`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">
                  {action.label}
                </span>
                <Plus className="w-5 h-5 text-slate-400 mr-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">פעילות אחרונה</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'deal' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'blog' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'contact' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'deal' && <Tag className="w-4 h-4" />}
                    {activity.type === 'blog' && <FileText className="w-4 h-4" />}
                    {activity.type === 'contact' && <MessageSquare className="w-4 h-4" />}
                    {activity.type === 'subscriber' && <Mail className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-700">{activity.title}</div>
                    <div className="text-sm text-slate-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>אין פעילות אחרונה</p>
              <p className="text-sm mt-2">התחל להוסיף תוכן לאתר!</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">💡 טיפ</h3>
          <p className="text-blue-100">
            הוסיפו דילים חדשים באופן קבוע כדי לשמור על האתר מעודכן ולמשוך לקוחות חדשים.
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">📝 SEO</h3>
          <p className="text-purple-100">
            כתיבת פוסטים בבלוג באופן קבוע תעזור לקידום האתר במנועי החיפוש.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">📞 פניות</h3>
          <p className="text-green-100">
            השתדלו לענות לפניות תוך 24 שעות לשביעות רצון מקסימלית של הלקוחות.
          </p>
        </div>
      </div>
    </div>
  );
}
