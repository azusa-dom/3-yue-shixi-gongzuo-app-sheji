import { useNav } from '../App';
import { ChevronLeft, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const { pop } = useNav();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const faqs = [
    {
      q: "服务有效期多久?",
      a: "自购买之日起12个月内有效。所有方案均包含完整12个月的医疗服务保障。"
    },
    {
      q: "和NHS GP的区别?",
      a: "我们的全科医生(GP)遵循英国医疗专业标准执业，服务可对接NHS及私立专科资源。我们主要提供中文沟通、分诊协助、预约衔接与后续跟进支持，帮助你更高效地使用英国医疗体系。"
    },
    {
      q: "如何建立我在英国的医疗档案?",
      a: "通过我们的官方APP注册后，您的医疗档案将与英国NHS国民医疗保健体系挂钩。这是进入英国医疗保健体系的正式入口。在我们诊所诊治的健康问题和开具的转诊单(Referral)，因所属NHS组已缴纳IHS医疗附加费，因此在NHS公立医院预约就诊完成免费;若选择私立医院则需自费。我们的服务帮助您快速、规范地建档并融入英国医疗体系。"
    },
    {
      q: "如何续约?续约有优惠吗?",
      a: "购买套餐后，医疗档案和服务将自动延续12个月有效期。续约客户享受专属折扣，具体优惠幅度请在到期前咨询客服团队，我们将根据您的续约时长和使用情况提供最优方案。"
    },
    {
      q: "我没有IHS保险，也能使用这个服务吗?",
      a: "可以。我们的服务分为两部分:\n1.基础全科诊疗:在我们诊所的问诊、处方、转诊等服务，无论是否有IHS均可使用，费用按套餐包含。\n2.NHS转诊:若您持有有效IHS，通过我们开具的转诊单可免费对接NHS公立医院;若无IHS，仍可通过我们对接私立医院或自费在NHS就诊。"
    },
    {
      q: "可以开具病假证明(SickNote)吗?",
      a: "可以。我们的全科医生可根据您的病情开具符合英国大学和雇主要求的正规病假证明(SickNote)，用于学业请假或工作请假。"
    },
    {
      q: "急诊情况如何处理?",
      a: "我们提供急诊快速响应服务:\n非危及生命的急症(如严重腹痛、高烧、外伤等)可通过APP预约当日门诊;若出现危及生命的紧急情况，请立即拨打999或前往最近的A&E(急诊)，我们的医生可协助后续跟进和转诊。"
    },
    {
      q: "可以开处方药吗?药品费用包含吗?",
      a: "可以。我们的医生可根据病情开具处方，您可凭处方到英国任意药店(Boots、Superdrug等)购药。药品费用不包含在套餐内，需自行支付。"
    },
    {
      q: "心理支持服务包含哪些内容?",
      a: "我们提供:\n·情绪与压力评估;\n·短期心理咨询与辅导;\n·若需要更深度的心理治疗，我们可协助转诊至NHS或私立心理专科医生。"
    }
  ];

  const filteredFaqs = faqs.filter(item => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return true;
    return item.q.toLowerCase().includes(keyword) || item.a.toLowerCase().includes(keyword);
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">常见问题</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setOpenIndex(null);
            }}
            placeholder="搜索问题关键词，如：Sick Note、999、续约"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-blue-500 shrink-0" />
                  <span className="font-bold text-slate-800 text-sm">{faq.q}</span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              {openIndex === index && (
                <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="bg-white rounded-2xl p-6 text-sm text-slate-500 border border-slate-100">
              没有找到匹配的问题，请尝试更换关键词或前往智能助手继续提问。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
