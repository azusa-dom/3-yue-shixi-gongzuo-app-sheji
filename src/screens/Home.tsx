import { useMemo } from 'react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import { MessageCircle, ChevronRight, ClipboardCheck, GitBranch, HeartPulse, FileText, Siren, HelpCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { openCustomerSupport } from '../lib/contact';
import { MembershipCard } from '../components/MembershipCard';

function statusLabel(status: string) {
  if (status === 'processing') return '处理中';
  if (status === 'submitted') return '已提交';
  if (status === 'completed') return '已完成';
  return status;
}

export function HomeScreen() {
  const { push } = useNav();
  const { membershipExpiry, serviceRequests } = useDemoData();

  const latestRequest = useMemo(
    () => [...serviceRequests].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0],
    [serviceRequests],
  );

  return (
    <div className="flex-1 h-full overflow-hidden bg-slate-50">
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b border-slate-100 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-blue-500 uppercase">Home</p>
            <h1 className="text-xl font-black text-slate-800 tracking-wide">云途护航</h1>
          </div>
        </div>
      </div>

      <div className="h-full overflow-y-auto p-6 pb-28 space-y-5">
        <MembershipCard membershipExpiry={membershipExpiry} onOpenBenefits={() => push({ id: 'benefits' })} />

        <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">需要医疗帮助？</h3>
          <p className="text-sm text-slate-500 mt-1">常规问题走文字咨询，急症请直接使用 24h 电话热线。</p>
          <button
            onClick={() => openCustomerSupport()}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3.5 font-semibold transition-colors inline-flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            发起即时咨询
          </button>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">服务卡片</h3>
          <div className="grid grid-cols-3 gap-3">
            <ServiceGridCard
              icon={<ClipboardCheck size={16} />}
              title="GP注册与建档"
              desc="快速建立 NHS 医疗档案"
              onClick={() => push({ id: 'booking', title: 'GP 注册与建档' })}
            />
            <ServiceGridCard
              icon={<GitBranch size={16} />}
              title="专科转诊绿色通道"
              desc="优先衔接影像检查与专家门诊"
              onClick={() => push({ id: 'booking', title: '专科转诊绿色通道' })}
            />
            <ServiceGridCard
              icon={<HeartPulse size={16} />}
              title="心理测评中心"
              desc="PHQ-9 / GAD-7 / PSS-10 综合评估"
              onClick={() => push({ id: 'mental-assessment' })}
            />
            <ServiceGridCard
              icon={<FileText size={16} />}
              title="学业文件"
              desc="申请病假条与查看进度"
              onClick={() => push({ id: 'academic-docs' })}
            />
            <ServiceGridCard
              icon={<Siren size={16} />}
              title="紧急热线 24h"
              desc="电话直连值班团队，危及生命请拨 999"
              onClick={() => push({ id: 'booking', title: '紧急支持 (24小时)' })}
            />
            <ServiceGridCard
              icon={<HelpCircle size={16} />}
              title="常见问题"
              desc="高频问题解答"
              onClick={() => push({ id: 'faq' })}
            />
          </div>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase">最近服务</h3>
          {latestRequest ? (
            <div className="mt-2">
              <p className="text-sm font-semibold text-slate-800">{latestRequest.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {latestRequest.requestNo} · {statusLabel(latestRequest.status)}
              </p>
              <button
                onClick={() => push({ id: 'request-progress', requestId: latestRequest.id })}
                className="mt-2 text-blue-600 text-xs font-semibold inline-flex items-center gap-1"
              >
                联系客服跟进
                <ChevronRight size={13} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-2">还没有服务记录，需要帮助可随时联系客服。</p>
          )}
        </section>
      </div>
    </div>
  );
}

function ServiceGridCard({ icon, title, desc, onClick }: { icon: ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-[132px] bg-white border border-slate-100 rounded-2xl p-3 shadow-sm text-center active:scale-[0.99] transition-transform flex flex-col items-center"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center mb-2">{icon}</div>
      <h4 className="text-[12px] leading-tight font-bold text-slate-800 line-clamp-2">{title}</h4>
      <p className="text-[10px] leading-[1.35] text-slate-500 mt-1 line-clamp-3">{desc}</p>
    </button>
  );
}
