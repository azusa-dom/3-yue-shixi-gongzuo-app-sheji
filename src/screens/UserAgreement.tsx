import { useNav } from '../App';
import { ChevronLeft, FileText } from 'lucide-react';

export function UserAgreement() {
  const { pop } = useNav();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">用户服务协议</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">服务使用说明</p>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">本协议用于说明你与平台之间的服务关系、使用边界、责任划分与免责声明。</p>
        </div>

        <AgreementCard
          title="1. 服务内容"
          text="平台提供医疗咨询协助、就医路径指导、服务预约协同、学业文件协助等会员服务，具体以页面展示为准。"
        />
        <AgreementCard
          title="2. 使用规范"
          text="用户应确保提交信息真实、准确、完整；不得上传违法违规内容，不得冒用他人身份发起服务。"
        />
        <AgreementCard
          title="3. 预约与响应"
          text="平台将根据服务类型与实际情况安排响应时间。紧急医疗风险请优先拨打 999 或 NHS 111。"
        />
        <AgreementCard
          title="4. 免责声明"
          text="平台提供的是服务协调与建议，不替代医生面诊与临床诊断。涉及医疗决策请以执业医生意见为准。"
        />
        <AgreementCard
          title="5. 协议生效"
          text="用户注册、登录或使用平台服务即视为同意本协议。平台有权在法律允许范围内更新协议条款。"
        />
      </div>
    </div>
  );
}

function AgreementCard({ title, text }: { title: string; text: string }) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-600 leading-relaxed mt-2">{text}</p>
    </section>
  );
}
