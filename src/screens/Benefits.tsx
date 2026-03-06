import { useState } from 'react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import { ChevronLeft, Shield, CheckCircle2, Activity, Heart, Stethoscope, FileText, GraduationCap, Video, Clock, Users, Award, AlertTriangle, Zap } from 'lucide-react';

export function Benefits() {
  const { pop } = useNav();
  const { membershipExpiry } = useDemoData();
  const [activeTab, setActiveTab] = useState<'package' | 'intro'>('package');

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-2 px-6 bg-white flex flex-col sticky top-0 z-10 shadow-sm">
        <div className="flex items-center mb-4">
          <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold ml-2">我的权益</h1>
        </div>
        
        <div className="flex gap-6 border-b border-slate-100 px-2">
          <button 
            onClick={() => setActiveTab('package')}
            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'package' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            我的套餐
            {activeTab === 'package' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('intro')}
            className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'intro' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            服务说明
            {activeTab === 'intro' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {activeTab === 'package' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="text-blue-500" size={20} />
                <h2 className="font-bold text-slate-800">套餐摘要</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">当前状态</span>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">已激活</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">有效期至</span>
                  <span className="font-medium text-slate-800">{membershipExpiry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">响应渠道</span>
                  <span className="font-medium text-slate-800">企业微信 / 热线</span>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-4 ml-2">核心服务权益</h3>
            
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100 mb-6">
              <BenefitItem icon={<CheckCircle2 />} title="全天候中文服务护航" desc="提供中文沟通支持与服务承接，帮助学生及家长快速获得协助" />
              <BenefitItem icon={<Activity />} title="症状初步评估与转诊协助" desc="学生/家长可通过热线或客服发起咨询，由服务团队进行初步分流，并协助对接 GP/专科就诊路径" />
              <BenefitItem icon={<Heart />} title="心理健康评估" tag="2次/年" desc="提供专业心理支持与评估服务，关注留学生情绪与心理状态" />
              <BenefitItem icon={<Stethoscope />} title="基础检测" tag="1次/年" desc="提供基础健康检查服务，用于日常健康管理与风险预警" />
              <BenefitItem icon={<FileText />} title="GP 注册与建档协助" desc="协助完成 GP 注册流程，并建立与 NHS 相关联的基础就诊档案" />
              <BenefitItem icon={<GraduationCap />} title="学业支持文件" desc="协助开具符合英国学校/大学规范要求的 Sick Note 或相关支持文件" />
            </div>

            <h3 className="text-sm font-bold text-slate-800 mb-4 ml-2">特色增值服务</h3>
            
            <div className="bg-blue-50/50 rounded-3xl p-6 shadow-sm border border-blue-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500"><Video size={18} /></div>
                  <span className="text-sm font-medium text-slate-700">视频/现场短期诊支持</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-500"><Clock size={18} /></div>
                  <span className="text-sm font-medium text-slate-700">快速预约挂号</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-500"><Users size={18} /></div>
                  <span className="text-sm font-medium text-slate-700">家长同步服务</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">什么是“健康护航计划”？</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                “健康护航计划”是 FCM 专家为在英学生打造的年度医疗会员服务体系。我们以英国 NHS 国家医疗标准为基准，在伦敦金融城提供高水准的医疗空间，通过稳健的会员制服务，为您建立长期可信赖的医疗档案，并提供全流程医疗照护服务+快速专科转诊的支持，覆盖疾病与休病假服务，实现从日常健康到突发健康问题的无缝对接。
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3">医疗资质</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"><Award size={14} className="text-blue-500"/> Doctify 认证</span>
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"><Award size={14} className="text-blue-500"/> 英国 NHS 标准</span>
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1"><Award size={14} className="text-blue-500"/> General Medical Council</span>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3">我们为谁服务？</h3>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <p className="text-sm font-bold text-blue-800 mb-1">16-25岁在英留学生</p>
                <p className="text-xs text-blue-600">高中 / 预科 / 本科 / 硕士 / 博士</p>
                <p className="text-xs text-blue-600 mt-2">及初到英国需要关注医疗服务的学生。</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4">痛点直击：海外留学的隐形危机</h2>
              <div className="space-y-3">
                <PainPoint 
                  title="预约难：流程繁琐，病情拖延" 
                  desc="英国 NHS 公立医疗预约周期漫长，普通 GP、验血、X-ray 甚至专家号等排期可达数月（2-8周）。" 
                />
                <PainPoint 
                  title="听不懂：语言隔阂，误诊风险" 
                  desc="90% 初到英国的学生难以用英语清晰描述症状，也不熟悉医疗诊疗用语。" 
                />
                <PainPoint 
                  title="没人管：家长焦虑，信息盲区" 
                  desc="孩子孤身赴英，家长远在国内无法掌握健康状况，只能在信息差下焦虑等待（24/7）。" 
                />
                <PainPoint 
                  title="乱投医：心理健康，容易忽视" 
                  desc="45% 的学生因环境改变易产生心理困扰，且因不重视心理健康而出现病征，缺乏专业指导。" 
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-4">健康护航计划为您解决一切</h2>
              <p className="text-sm text-slate-600 mb-4">从急症、体检，到长期慢病管理，全面一站式解决。</p>
              
              <div className="grid grid-cols-1 gap-4">
                <SolutionCard 
                  title="急诊快速响应" 
                  subtitle="Emergency Response"
                  items={["突发疾病处理（腹痛、发烧、肠胃炎、严重过敏、外伤）", "即时处理（当天门诊极速转诊，及时开具处方）"]}
                />
                <SolutionCard 
                  title="日常健康管理" 
                  subtitle="Daily Care"
                  items={["慢性病管理（哮喘、内分泌等定期随访与给药）", "定期体检（健康监测、早期预防、营养管理）"]}
                />
                <SolutionCard 
                  title="学业与心理支持" 
                  subtitle="Academic & Mental"
                  items={["心理评估（情绪与压力评估，提供专业辅导与支持）", "Sick Note（符合英国大学的正规病假证明）"]}
                />
                <SolutionCard 
                  title="筛查与免疫" 
                  subtitle="Screening & Immunization"
                  items={["风险筛查（癌症、肝病、血压监测、传染病检测）", "免疫与小手术（疫苗接种、伤口缝合等）", "两性健康（避孕与性健康）"]}
                />
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl p-6 border border-blue-100 shadow-sm">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Zap size={20} className="text-blue-600" />
                专科转诊绿色通道
              </h2>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                无需在 NHS 系统长时间排队等待，快速对接优质医疗资源。
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span><strong>高级影像检查：</strong>X光、CT、MRI 快速预约</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span><strong>专科医生转诊：</strong>骨科、皮肤科、眼科等提前沟通预订档期</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span><strong>辅助康复跟踪：</strong>物理治疗、康复指导、康复社区与跟进</span>
                </li>
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, desc, tag }: any) {
  return (
    <div className="flex gap-4 p-4 border-b border-slate-50 last:border-0">
      <div className="text-blue-500 shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          {tag && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{tag}</span>}
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PainPoint({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
      <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SolutionCard({ title, subtitle, items }: { title: string, subtitle: string, items: string[] }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="mb-3">
        <h4 className="font-bold text-blue-600 text-base">{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
            <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
