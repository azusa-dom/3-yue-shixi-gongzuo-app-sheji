import { useNav } from '../App';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export function PrivacyPolicy() {
  const { pop } = useNav();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">隐私政策</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">我们如何保护你的数据</p>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">我们仅在提供医疗服务所需范围内收集和使用信息，并采取加密存储与访问权限控制。</p>
        </div>

        <PolicyCard
          title="1. 收集信息范围"
          text="用于服务提供的信息包括：账号信息、联系方式、服务申请记录、就医沟通记录、学业文件申请信息。"
        />
        <PolicyCard
          title="2. 信息使用目的"
          text="用于客服响应、服务分诊、预约协同、文件处理、服务质量优化，不用于与服务无关的商业用途。"
        />
        <PolicyCard
          title="3. 信息存储与安全"
          text="我们采用安全存储与访问审计机制。涉及敏感信息的处理遵循最小必要原则，确保仅授权人员可访问。"
        />
        <PolicyCard
          title="4. 信息共享说明"
          text="仅在履行医疗服务需要时，与相关合作医疗机构进行必要信息同步；不会对外出售用户个人信息。"
        />
        <PolicyCard
          title="5. 你的权利"
          text="你可申请查询、更正、删除个人资料，或撤回部分授权；如影响服务提供，系统将明确提示。"
        />
      </div>
    </div>
  );
}

function PolicyCard({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-600 leading-relaxed mt-2">{text}</p>
    </section>
  );
}
