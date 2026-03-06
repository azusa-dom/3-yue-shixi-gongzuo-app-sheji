import { useMemo, useState, type ReactNode } from 'react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import {
  ChevronLeft,
  MessageCircle,
  PhoneCall,
  Search,
  ClipboardCheck,
  GitBranch,
  HeartPulse,
  GraduationCap,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { openCustomerSupport } from '../lib/contact';

function toStatus(status: string) {
  if (status === 'submitted') return '已提交';
  if (status === 'processing') return '处理中';
  if (status === 'completed') return '已完成';
  return status;
}

export function ServicePortal() {
  const { pop, push } = useNav();
  const { serviceRequests } = useDemoData();
  const [notice, setNotice] = useState('');

  const latestRequest = useMemo(
    () => [...serviceRequests].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0],
    [serviceRequests],
  );

  const openSupport = () => {
    openCustomerSupport();
    setNotice('已进入即时咨询（企微文字客服）');
    window.setTimeout(() => setNotice(''), 2200);
  };

  const callHotline = () => {
    window.location.href = 'tel:+442012345678';
    setNotice('正在呼叫 24 小时紧急热线：+44 (0) 20 1234 5678');
    window.setTimeout(() => setNotice(''), 2800);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">服务入口</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-5">
        <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-800">即时咨询</h2>
          <p className="text-xs text-slate-500 mt-1">企微文字客服，适用于常规咨询与问诊沟通。</p>
          <button
            onClick={openSupport}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle size={16} />
            进入文字咨询
          </button>
        </section>

        <section className="bg-red-50 border border-red-100 rounded-3xl p-5">
          <h2 className="text-base font-bold text-red-700">紧急热线 24h</h2>
          <p className="text-xs text-red-500 mt-1">电话直连值班团队。仅用于突发急症；非紧急请优先使用文字咨询。若危及生命请立即拨打 999。</p>
          <button
            onClick={callHotline}
            className="mt-4 w-full bg-white border border-red-200 text-red-600 rounded-2xl py-3 font-semibold flex items-center justify-center gap-2"
          >
            <PhoneCall size={16} />
            呼叫紧急热线
          </button>
        </section>

        {notice && <div className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-600">{notice}</div>}

        {latestRequest && (
          <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-[11px] text-blue-500 font-bold tracking-wide mb-1">最近服务</p>
            <p className="text-sm font-semibold text-blue-900">{latestRequest.title}</p>
            <p className="text-xs text-blue-700 mt-1">
              {latestRequest.requestNo} · {toStatus(latestRequest.status)}
            </p>
            <button onClick={() => push({ id: 'request-progress', requestId: latestRequest.id })} className="mt-3 text-sm font-semibold text-blue-600 inline-flex items-center gap-1">
              查看该申请
              <ChevronRight size={14} />
            </button>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-1">核心服务入口</h3>
          <PortalActionCard
            icon={<Search size={18} />}
            title="找医生与科室"
            desc="描述症状后快速匹配门诊路径"
            onClick={() => push({ id: 'booking', title: '找医生与科室' })}
          />
          <PortalActionCard
            icon={<ClipboardCheck size={18} />}
            title="GP注册与建档"
            desc="建立 NHS 关联档案并完成首诊准备"
            onClick={() => push({ id: 'booking', title: 'GP 注册与建档' })}
          />
          <PortalActionCard
            icon={<GitBranch size={18} />}
            title="专科转诊绿色通道"
            desc="优先衔接影像检查与专家门诊"
            onClick={() => push({ id: 'booking', title: '专科转诊绿色通道' })}
          />
          <PortalActionCard
            icon={<HeartPulse size={18} />}
            title="心理测评中心"
            desc="PHQ-9 / GAD-7 / PSS-10 结果联动动作建议"
            onClick={() => push({ id: 'mental-assessment' })}
          />
          <PortalActionCard
            icon={<GraduationCap size={18} />}
            title="学业文件"
            desc="申请病假条（Sick Note）并查看进度"
            onClick={() => push({ id: 'academic-docs' })}
          />
        </section>

        <button
          onClick={() => push({ id: 'faq' })}
          className="w-full bg-white border border-slate-200 text-slate-700 rounded-2xl py-3 font-medium inline-flex items-center justify-center gap-2"
        >
          <FileText size={16} />
          查看常见问题
        </button>
      </div>
    </div>
  );
}

function PortalActionCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-500 mt-1">{desc}</p>
        </div>
        <ChevronRight size={18} className="text-slate-300 shrink-0" />
      </div>
    </button>
  );
}
