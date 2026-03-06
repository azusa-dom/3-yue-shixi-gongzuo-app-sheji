import { useNav } from '../App';
import { ChevronLeft, Award, ShieldCheck, Stethoscope, AlertTriangle, Zap } from 'lucide-react';
import type { ReactNode } from 'react';

const painPoints = [
  {
    title: '预约难',
    subtitle: '流程繁琐，病情拖延',
    value: '2-8周',
    desc: '英国 NHS 公立医疗预约周期漫长，普通 GP、验血、X-ray 甚至专家号等排期可达数月。',
  },
  {
    title: '听不懂',
    subtitle: '语言隔阂，误诊风险',
    value: '90%',
    desc: '初到英国，难以用英语清晰描述症状，也不熟悉医疗诊疗用语。',
  },
  {
    title: '没人管',
    subtitle: '家长焦虑，信息盲区',
    value: '24/7',
    desc: '孩子孤身赴英，家长远在国内，无法掌握健康状况，只能在信息差下焦虑等待。',
  },
  {
    title: '乱投医',
    subtitle: '心理健康，容易忽视',
    value: '45%',
    desc: '环境改变易产生心理困扰，学生因不重视心理健康出现病征，缺乏专业指导。',
  },
];

const solutionCards = [
  {
    title: '急诊快速响应',
    subtitle: 'Emergency Response',
    items: ['突发疾病（腹痛、发烧、肠胃炎、严重过敏、外伤）即时处理', '当天门诊极速转诊，及时开具处方'],
  },
  {
    title: '日常健康管理',
    subtitle: 'Daily Care',
    items: ['慢性病管理（哮喘、内分泌等长期随访与给药）', '定期体检（健康监测、早期预防、营养管理）'],
  },
  {
    title: '学业与心理支持',
    subtitle: 'Academic & Mental',
    items: ['心理评估（情绪与压力评估，提供专业辅导与支持）', 'Sick Note（符合英国大学的正规病假证明）'],
  },
  {
    title: '筛查与免疫',
    subtitle: 'Screening & Immunization',
    items: ['风险筛查（癌症、肝病、血压监测、传染病检测）', '免疫与小手术（疫苗接种、伤口缝合等）', '两性健康（避孕与性健康，专业支持）'],
  },
];

export function AboutUs() {
  const { pop } = useNav();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">关于云途护航</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        <section className="bg-gradient-to-br from-[#5E8FFB] via-[#447DF2] to-[#2C68E7] text-white rounded-3xl p-6 shadow-[0_16px_36px_rgba(59,111,234,0.35)]">
          <p className="text-xs text-blue-100 tracking-[0.16em] uppercase">About Us</p>
          <h2 className="text-2xl font-black mt-1">健康护航计划</h2>
          <p className="text-sm text-blue-100 leading-relaxed mt-2">
            “健康护航计划”是 FCM 专家为在英学生打造的年度医疗会员服务体系。以英国 NHS 国家医疗标准为基准，提供全流程医疗照护服务与快速专科转诊支持，实现从日常健康到突发问题的无缝衔接。
          </p>
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-3">医疗资质</h2>
          <div className="grid grid-cols-2 gap-2">
            <Badge icon={<Award size={14} />} text="Doctify 认证" />
            <Badge icon={<ShieldCheck size={14} />} text="英国 NHS 标准" />
            <Badge icon={<Stethoscope size={14} />} text="General Medical Council" />
            <Badge icon={<Award size={14} />} text="临床流程规范" />
          </div>
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-3">我们为谁服务？</h2>
          <p className="text-sm font-semibold text-blue-700">16-25 岁在英留学生</p>
          <p className="text-xs text-slate-500 mt-1">高中 / 预科 / 本科 / 硕士 / 博士</p>
          <p className="text-xs text-slate-500 mt-1">尤其适合初到英国、需要关注医疗服务衔接的学生。</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800">痛点直击：海外留学的隐形危机</h2>
          {painPoints.map(item => (
            <div key={item.title} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-1">{item.value}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800">健康护航计划为您解决一切</h2>
          <div className="flex flex-wrap gap-2">
            {['预约难', '听不懂', '没人管', '乱投医'].map(tag => (
              <span key={tag} className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">{tag}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500">从急症、体检，到长期慢病管理，全面一站式解决。</p>

          <div className="grid grid-cols-1 gap-3">
            {solutionCards.map(card => (
              <div key={card.title} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <p className="text-sm font-bold text-blue-700">{card.title}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">{card.subtitle}</p>
                <ul className="mt-2 space-y-1.5">
                  {card.items.map(item => (
                    <li key={item} className="text-xs text-slate-600 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl p-5 border border-blue-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Zap size={16} className="text-blue-600" />
            专科转诊绿色通道
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mt-2">无需在 NHS 系统长时间排队等待，快速对接优质医疗资源。</p>
          <ul className="mt-3 space-y-2 text-xs text-slate-700">
            <li>• 高级影像检查：X 光、CT、MRI 快速预约</li>
            <li>• 专科医生转诊：骨科、皮肤科、眼科等提前预订档期</li>
            <li>• 辅助康复跟踪：物理治疗、康复指导、康复社区与跟进</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-blue-600" />
            联系我们
          </h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p>服务热线：+44 (0) 20 1234 5678</p>
            <p>企业微信：云途护航客服</p>
            <p>支持时段：7 x 24 小时（紧急热线）</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Badge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5">
      <span className="text-blue-600">{icon}</span>
      {text}
    </div>
  );
}
