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
    <div className="px-6 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-slate-50 p-2.5 rounded-lg text-slate-400 border border-slate-100">
          <Calendar size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {moment(report.checkInTime).format('dddd, MMMM Do YYYY')}
          </h3>
          <div className="flex items-center gap-4 mt-1">
            {type !== 'worker' && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={10} />
                {moment(report.checkInTime).format('h:mm A')}
              </p>
            )}

            {/* Insight Pills */}
            <div className="flex items-center gap-2">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border tracking-widest',
                    insight.color.replace('bg-', 'text-').replace('-50', '-600'),
                    "bg-slate-50 border-slate-100"
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
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200 bg-white text-slate-600">
            {report.approved ? (
              <Fingerprint size={12} className="text-emerald-500" />
            ) : (
              <Activity size={12} className="text-amber-500" />
            )}
            <span>
              {report.approved ? 'System Certified' : 'Pending Audit'}
            </span>
          </div>
        ) : (
          <ApproveAccountReport id={report.id} approved={report.approved} />
        )}
      </div>
    </div>
  );
};

export default ReportCardHeader;
