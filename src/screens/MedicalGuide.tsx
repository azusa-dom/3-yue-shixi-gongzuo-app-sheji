import { useNav } from '../App';
import { ChevronLeft, BookOpen, Stethoscope, Hospital, AlertTriangle } from 'lucide-react';

export function MedicalGuide() {
  const { pop } = useNav();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">就医指南</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <BookOpen size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">NHS 体系介绍</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            英国国家医疗服务体系（NHS）为英国居民提供大部分免费的医疗服务。留学生在支付了IHS（移民健康附加费）后，即可享受与英国居民同等的NHS公立医疗服务。
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Stethoscope size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">GP (全科医生)</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            GP是您在英国看病的第一站。无论是感冒发烧还是慢性病，都需要先预约GP。
          </p>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
            <li>必须先注册GP才能看病</li>
            <li>通常需要提前几天到几周预约</li>
            <li>GP会根据病情决定是否将您转诊到专科医院</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Hospital size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Walk-in & Urgent Care</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            如果您的病情比较急，但没有生命危险，且预约不到GP，可以选择去Walk-in Centre或Urgent Care Centre。
          </p>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
            <li>无需预约，直接前往排队</li>
            <li>处理轻微外伤、突发感染等</li>
            <li>等待时间通常为1-4小时</li>
          </ul>
        </div>

        <div className="bg-red-50 rounded-3xl p-6 shadow-sm border border-red-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <AlertTriangle size={20} />
            </div>
            <h2 className="font-bold text-red-800 text-lg">A&E (急诊) 与 999</h2>
          </div>
          <p className="text-sm text-red-700 leading-relaxed mb-3">
            仅在遇到危及生命的紧急情况时使用。
          </p>
          <ul className="text-sm text-red-700 space-y-2 list-disc pl-4">
            <li>严重出血、呼吸困难、胸痛、失去意识等</li>
            <li>直接拨打999叫救护车，或直接前往医院的A&E部门</li>
            <li>非紧急情况去A&E可能会被拒绝或等待极长时间（4-12小时）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
