'use client';
import { cn } from '@/app/lib/utils';
import { Calendar, Clock, Activity, Fingerprint } from 'lucide-react';
import moment from 'moment';
import ApproveAccountReport from '@/app/admin/components/ApproveAccountReport';
import {
  CreditCard,
  Wallet,
  Zap,
  TrendingUp,
  Users,
  Gem,
  Award,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={10} />,
  CreditCard: <CreditCard size={10} />,
  Wallet: <Wallet size={10} />,
  Zap: <Zap size={10} />,
  TrendingUp: <TrendingUp size={10} />,
  Gem: <Gem size={10} />,
  Award: <Award size={10} />,
};

const ReportCardHeader = ({
  report,
  type,
  insights,
}: {
  report: any;
  type?: string;
  insights: { label: string; icon: string; color: string }[];
}) => {
  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-primary">
          <Calendar size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {moment(report.checkInTime).format('dddd, MMMM Do YYYY')}
          </h3>
          <div className="flex items-center gap-4 mt-1">
            {type !== 'worker' && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={10} className="text-primary" />
                {moment(report.checkInTime).format('h:mm A')}
              </p>
            )}

            {/* Insight Pills */}
            <div className="flex items-center gap-2">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border tracking-wider',
                    insight.color,
                  )}
                >
                  {iconMap[insight.icon]}
                  {insight.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {type === 'worker' ? (
          <div
            className={cn(
              'relative group cursor-default transition-all duration-500',
              report.approved ? 'hover:scale-105' : 'hover:rotate-1',
            )}
          >
            <div
              className={cn(
                'absolute -inset-1 blur opacity-25 rounded-full transition duration-500 group-hover:opacity-50',
                report.approved ? 'bg-emerald-400' : 'bg-amber-400',
              )}
            />
            <div
              className={cn(
                'relative flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border shadow-2xl transition-all duration-500',
                report.approved
                  ? 'bg-white/80 text-emerald-600 border-emerald-200/50 shadow-emerald-500/10'
                  : 'bg-white/80 text-amber-600 border-amber-200/50 shadow-amber-500/10',
              )}
            >
              {report.approved ? (
                <Fingerprint size={12} className="animate-pulse" />
              ) : (
                <Activity size={12} className="animate-pulse" />
              )}
              <span>
                {report.approved ? 'System Certified' : 'Pending Audit'}
              </span>
            </div>
          </div>
        ) : (
          <ApproveAccountReport id={report.id} approved={report.approved} />
        )}
      </div>
    </div>
  );
};

export default ReportCardHeader;
