import { useMemo } from 'react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import { ChevronLeft, MessageCircle, CircleCheckBig, Clock3, CircleDashed } from 'lucide-react';
import { openCustomerSupport } from '../lib/contact';
import type { ReactNode } from 'react';

function toStatus(status: string) {
  if (status === 'submitted') return '已提交';
  if (status === 'processing') return '处理中';
  if (status === 'completed') return '已完成';
  return status;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(+date)) return value;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

export function RequestProgress({ requestId }: { requestId: string }) {
  const { pop } = useNav();
  const { serviceRequests } = useDemoData();

  const request = useMemo(() => serviceRequests.find(item => item.id === requestId), [serviceRequests, requestId]);

  if (!request) {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
        <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
          <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold ml-2">服务进度</h1>
        </div>
        <div className="flex-1 p-6 text-sm text-slate-500">未找到该服务记录，请返回后重试。</div>
      </div>
    );
  }

  const status = request.status;
  const hasSchedule = Boolean(request.preferredDate && request.preferredTime && request.preferredTime !== '无需预约');

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">服务进度</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-4">
        <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <p className="text-xs text-slate-400 tracking-wide">最近服务</p>
          <h2 className="text-xl font-bold text-slate-800 mt-1">{request.title}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {request.requestNo} · {toStatus(request.status)}
          </p>
        </section>

        <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">处理节点</h3>
          <ProgressStep icon={<CircleCheckBig size={15} />} active={true} title="需求已提交" desc={`${formatDate(request.createdAt)} 已进入服务队列`} />
          <ProgressStep
            icon={<Clock3 size={15} />}
            active={status === 'processing' || status === 'completed'}
            title="客服处理中"
            desc={status === 'submitted' ? '等待客服联系中' : '正在评估并安排后续服务'}
          />
          <ProgressStep
            icon={<CircleDashed size={15} />}
            active={status === 'completed'}
            title="服务完成"
            desc={status === 'completed' ? '该申请已完成处理' : '完成后将更新记录'}
            isLast
          />
        </section>

        <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">{hasSchedule ? '期望时间' : '申请信息'}</p>
          {hasSchedule ? (
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {request.preferredDate} · {request.preferredTime}
            </p>
          ) : (
            <p className="text-sm font-semibold text-slate-800 mt-1">该申请为资料提交，不涉及预约时段。</p>
          )}
          {request.note && <p className="text-xs text-slate-500 mt-2 leading-relaxed">备注：{request.note}</p>}
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
        <button
          onClick={() => openCustomerSupport()}
          className="w-full bg-blue-500 text-white rounded-2xl py-3.5 font-semibold inline-flex items-center justify-center gap-2"
        >
          <MessageCircle size={15} />
          联系客服跟进
        </button>
      </div>
    </div>
  );
}

function ProgressStep({
  icon,
  active,
  title,
  desc,
  isLast = false,
}: {
  icon: ReactNode;
  active: boolean;
  title: string;
  desc: string;
  isLast?: boolean;
}) {
  return (
    <div className={`relative pl-9 ${isLast ? '' : 'pb-5'}`}>
      {!isLast && <div className={`absolute left-[13px] top-6 w-[2px] h-8 ${active ? 'bg-blue-200' : 'bg-slate-200'}`} />}
      <div className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center ${active ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
        {icon}
      </div>
      <p className={`text-sm font-semibold ${active ? 'text-slate-800' : 'text-slate-500'}`}>{title}</p>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
  );
}
