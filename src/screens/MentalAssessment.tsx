import { useMemo, useState } from 'react';
import { useNav } from '../App';
import { ChevronLeft, CircleAlert, CircleCheck, HeartPulse, MessageCircle, PhoneCall, RefreshCw, ClipboardList } from 'lucide-react';
import { openCustomerSupport } from '../lib/contact';

type ScaleKey = 'phq9' | 'gad7' | 'pss10';
type Option = { label: string; value: number };
type Question = { id: number; text: string };
type ScreenMode = 'hub' | 'assessment';

interface SeverityLevel {
  label: string;
  color: string;
  desc: string;
}

interface ScaleConfig {
  key: ScaleKey;
  code: string;
  title: string;
  subtitle: string;
  intro: string;
  options: Option[];
  questions: Question[];
  maxScore: number;
  reverseQuestionIds?: number[];
}

interface ScaleActionPlan {
  level: 'low' | 'watch' | 'medium' | 'high';
  title: string;
  desc: string;
  actions: string[];
  shouldBook: boolean;
  showHotline: boolean;
}

const frequencyOptions: Option[] = [
  { label: '完全没有', value: 0 },
  { label: '几天', value: 1 },
  { label: '一半以上天数', value: 2 },
  { label: '几乎每天', value: 3 },
];

const stressOptions: Option[] = [
  { label: '从不', value: 0 },
  { label: '几乎不', value: 1 },
  { label: '有时', value: 2 },
  { label: '经常', value: 3 },
  { label: '总是', value: 4 },
];

const SCALE_CONFIGS: Record<ScaleKey, ScaleConfig> = {
  phq9: {
    key: 'phq9',
    code: 'PHQ-9',
    title: '抑郁风险筛查',
    subtitle: '过去两周内你被以下问题困扰的频率',
    intro: 'PHQ-9 用于抑郁症状初筛，不能替代临床诊断。',
    options: frequencyOptions,
    maxScore: 27,
    questions: [
      { id: 1, text: '做事时提不起劲或没有兴趣' },
      { id: 2, text: '感到心情低落、沮丧或绝望' },
      { id: 3, text: '入睡困难、睡不安稳或睡眠过多' },
      { id: 4, text: '感到疲倦或没有活力' },
      { id: 5, text: '食欲不振或吃太多' },
      { id: 6, text: '觉得自己很糟，或让自己或家人失望' },
      { id: 7, text: '对事物专注有困难（例如阅读/看视频）' },
      { id: 8, text: '动作或说话变慢，或烦躁到难以安坐' },
      { id: 9, text: '有过“不如死掉或伤害自己”的想法' },
    ],
  },
  gad7: {
    key: 'gad7',
    code: 'GAD-7',
    title: '焦虑风险筛查',
    subtitle: '过去两周内你出现以下感受的频率',
    intro: 'GAD-7 用于焦虑症状初筛，适合与 PHQ-9 联合观察。',
    options: frequencyOptions,
    maxScore: 21,
    questions: [
      { id: 1, text: '感到紧张、焦虑或坐立不安' },
      { id: 2, text: '无法停止或控制担忧' },
      { id: 3, text: '对各种事情担忧过多' },
      { id: 4, text: '很难放松下来' },
      { id: 5, text: '烦躁不安，难以静坐' },
      { id: 6, text: '变得容易恼火或易怒' },
      { id: 7, text: '感到好像会有可怕的事情发生' },
    ],
  },
  pss10: {
    key: 'pss10',
    code: 'PSS-10',
    title: '压力感知评估',
    subtitle: '过去一个月内你出现以下情况的频率',
    intro: 'PSS-10 用于评估主观压力水平，部分题目会反向计分。',
    options: stressOptions,
    maxScore: 40,
    reverseQuestionIds: [4, 5, 7, 8],
    questions: [
      { id: 1, text: '你是否因突发事件而感到心烦意乱？' },
      { id: 2, text: '你是否感到无法控制生活中重要的事情？' },
      { id: 3, text: '你是否因为紧张或压力而感到不堪重负？' },
      { id: 4, text: '你是否有信心处理个人问题？' },
      { id: 5, text: '你是否觉得事情正朝着你希望的方向发展？' },
      { id: 6, text: '你是否觉得无法应对需要做的事情？' },
      { id: 7, text: '你是否能控制生活中的烦心事？' },
      { id: 8, text: '你是否觉得自己能够掌控局面？' },
      { id: 9, text: '你是否因无法掌控的事情而生气？' },
      { id: 10, text: '你是否觉得困难堆积，难以克服？' },
    ],
  },
};

const SCALE_ORDER: ScaleKey[] = ['phq9', 'gad7', 'pss10'];

function createInitialAnswers(): Record<ScaleKey, Record<number, number>> {
  return {
    phq9: {},
    gad7: {},
    pss10: {},
  };
}

function createInitialReports(): Record<ScaleKey, boolean> {
  return {
    phq9: false,
    gad7: false,
    pss10: false,
  };
}

function computeScaleScore(scale: ScaleConfig, answers: Record<number, number>) {
  const reverseSet = new Set(scale.reverseQuestionIds || []);
  const maxOptionValue = scale.options[scale.options.length - 1]?.value || 0;
  return scale.questions.reduce((sum, question) => {
    const raw = answers[question.id] ?? 0;
    const normalized = reverseSet.has(question.id) ? maxOptionValue - raw : raw;
    return sum + normalized;
  }, 0);
}

function getScaleSeverity(scale: ScaleKey, score: number): SeverityLevel {
  if (scale === 'phq9') {
    if (score <= 4) return { label: '最小程度', color: 'text-green-600', desc: '情绪波动较轻，建议保持规律作息并继续观察。' };
    if (score <= 9) return { label: '轻度', color: 'text-lime-600', desc: '建议加强睡眠管理与运动，1-2 周后复测。' };
    if (score <= 14) return { label: '中度', color: 'text-amber-600', desc: '建议尽快与心理支持团队沟通，评估后续干预。' };
    if (score <= 19) return { label: '中重度', color: 'text-orange-600', desc: '建议在 24-72 小时内安排专业心理咨询。' };
    return { label: '重度', color: 'text-red-600', desc: '建议立即联系专业人员，必要时启动紧急支持。' };
  }
  if (scale === 'gad7') {
    if (score <= 4) return { label: '最小程度', color: 'text-green-600', desc: '焦虑信号较弱，建议保持稳定作息。' };
    if (score <= 9) return { label: '轻度', color: 'text-lime-600', desc: '可先进行自助减压训练并观察变化。' };
    if (score <= 14) return { label: '中度', color: 'text-amber-600', desc: '建议在一周内安排心理支持沟通。' };
    return { label: '重度', color: 'text-red-600', desc: '焦虑风险较高，建议尽快安排专业咨询。' };
  }
  if (score <= 13) return { label: '低压力', color: 'text-green-600', desc: '当前压力总体可控，建议保持现有节奏。' };
  if (score <= 26) return { label: '中等压力', color: 'text-amber-600', desc: '建议优化时间管理并尽快进行减压干预。' };
  return { label: '高压力', color: 'text-red-600', desc: '压力负荷偏高，建议尽快与咨询师评估应对策略。' };
}

function getScaleActionPlan(scale: ScaleKey, score: number, hasSelfHarmSignal: boolean): ScaleActionPlan {
  if (scale === 'phq9') {
    if (hasSelfHarmSignal || score >= 20) {
      return {
        level: 'high',
        title: '建议立即启动人工支持',
        desc: '检测到高风险信号，请优先联系专业人员并确保身边有人陪伴。',
        actions: ['立即联系 24h 紧急热线；若出现现实危险请直接拨打 999。', '今天内预约心理咨询师，优先进行风险评估。', '通知可信任联系人，避免独处。'],
        shouldBook: true,
        showHotline: true,
      };
    }
    if (score >= 10) {
      return {
        level: 'medium',
        title: '建议尽快预约心理咨询',
        desc: '当前风险信号较明确，建议 24-72 小时内安排咨询。',
        actions: ['提交心理咨询师预约，优先最近时段。', '记录近 7 天睡眠与情绪变化，咨询时可更快定位问题。', '如症状突然恶化，立即转入紧急热线流程。'],
        shouldBook: true,
        showHotline: false,
      };
    }
    if (score >= 5) {
      return {
        level: 'watch',
        title: '建议短周期跟进',
        desc: '可先进行自助管理，必要时再预约咨询。',
        actions: ['先执行一周规律作息与减压计划。', '7-14 天后复测 PHQ-9。', '若分数升高或出现明显恶化，及时预约咨询。'],
        shouldBook: false,
        showHotline: false,
      };
    }
    return {
      level: 'low',
      title: '当前状态较稳',
      desc: '暂不需要预约，建议按周期复测。',
      actions: ['维持规律作息和运动。', '遇到考试周可提前做一次复测。', '若出现持续低落、失眠再启动咨询。'],
      shouldBook: false,
      showHotline: false,
    };
  }

  if (scale === 'gad7') {
    if (score >= 15) {
      return {
        level: 'high',
        title: '焦虑风险较高',
        desc: '建议尽快预约心理咨询，优先做焦虑管理评估。',
        actions: ['24-72 小时内预约心理咨询师。', '避免高压情境叠加，保证基本睡眠。', '若出现惊恐发作或明显恶化，转入紧急热线。'],
        shouldBook: true,
        showHotline: false,
      };
    }
    if (score >= 10) {
      return {
        level: 'medium',
        title: '中度焦虑信号',
        desc: '建议一周内安排一次专业沟通。',
        actions: ['预约一次心理咨询评估。', '记录焦虑触发场景与身体反应。', '同步执行呼吸放松和睡眠管理。'],
        shouldBook: true,
        showHotline: false,
      };
    }
    if (score >= 5) {
      return {
        level: 'watch',
        title: '轻度焦虑信号',
        desc: '可先自助管理并观察变化。',
        actions: ['先不强制预约，持续 7 天记录。', '每天安排固定放松时间。', '若分数上升，转为预约咨询。'],
        shouldBook: false,
        showHotline: false,
      };
    }
    return {
      level: 'low',
      title: '焦虑风险较低',
      desc: '当前状态稳定，可继续保持。',
      actions: ['维持当前节奏。', '重要考试或事件前可复测。', '出现持续紧张再考虑预约。'],
      shouldBook: false,
      showHotline: false,
    };
  }

  if (score >= 27) {
    return {
      level: 'high',
      title: '压力负荷偏高',
      desc: '建议尽快预约心理咨询，优化压力应对策略。',
      actions: ['优先预约心理咨询师。', '将学习任务拆分，降低短期负荷。', '必要时联系支持团队协助减压。'],
      shouldBook: true,
      showHotline: false,
    };
  }
  if (score >= 14) {
    return {
      level: 'watch',
      title: '中等压力水平',
      desc: '可以先自助减压，再决定是否预约。',
      actions: ['先执行一周作息调整与任务重排。', '7 天后复测 PSS-10。', '若压力持续上升，再预约咨询。'],
      shouldBook: false,
      showHotline: false,
    };
  }
  return {
    level: 'low',
    title: '压力总体可控',
    desc: '当前可先不预约，建议按月监测。',
    actions: ['维持当前学习与生活节奏。', '保持每周运动与社交连接。', '压力升高时及时复测并评估预约。'],
    shouldBook: false,
    showHotline: false,
  };
}

export function MentalAssessment() {
  const { pop, push } = useNav();
  const [mode, setMode] = useState<ScreenMode>('hub');
  const [activeScale, setActiveScale] = useState<ScaleKey>('phq9');
  const [answersByScale, setAnswersByScale] = useState<Record<ScaleKey, Record<number, number>>>(createInitialAnswers);
  const [reportedByScale, setReportedByScale] = useState<Record<ScaleKey, boolean>>(createInitialReports);
  const [notice, setNotice] = useState('');

  const activeConfig = SCALE_CONFIGS[activeScale];
  const activeAnswers = answersByScale[activeScale];
  const answeredCount = useMemo(() => Object.keys(activeAnswers).length, [activeAnswers]);
  const score = useMemo(() => computeScaleScore(activeConfig, activeAnswers), [activeConfig, activeAnswers]);
  const severity = useMemo(() => getScaleSeverity(activeScale, score), [activeScale, score]);
  const hasSelfHarmSignal = activeScale === 'phq9' && (activeAnswers[9] || 0) > 0;
  const actionPlan = useMemo(() => getScaleActionPlan(activeScale, score, hasSelfHarmSignal), [activeScale, score, hasSelfHarmSignal]);
  const reported = reportedByScale[activeScale];
  const completedReports = useMemo(() => SCALE_ORDER.filter(key => reportedByScale[key]).length, [reportedByScale]);

  const handleBack = () => {
    if (mode === 'assessment') {
      setMode('hub');
      return;
    }
    pop();
  };

  const updateAnswer = (questionId: number, value: number) => {
    setAnswersByScale(prev => ({
      ...prev,
      [activeScale]: {
        ...prev[activeScale],
        [questionId]: value,
      },
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">{mode === 'hub' ? '心理支持' : '心理测评'}</h1>
      </div>

      {mode === 'hub' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-3xl p-5 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white shadow-lg">
            <p className="text-base font-semibold">心理功能入口</p>
            <p className="text-xs mt-1 text-blue-100">你可以先做测评再决定是否预约，也可以直接进入心理咨询预约。</p>
          </div>

          <button
            onClick={() => setMode('assessment')}
            className="w-full bg-white rounded-3xl border border-slate-100 p-5 text-left shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
              <ClipboardList size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800">先做心理测评</h2>
            <p className="text-xs text-slate-500 mt-1">PHQ-9 / GAD-7 / PSS-10，每个量表单独生成报告。</p>
          </button>

          <button
            onClick={() => push({ id: 'booking', title: '心理咨询师预约' })}
            className="w-full bg-white rounded-3xl border border-slate-100 p-5 text-left shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
              <HeartPulse size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800">直接预约心理咨询</h2>
            <p className="text-xs text-slate-500 mt-1">不做测评，直接提交心理咨询师预约申请。</p>
          </button>

          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-500">测评进度</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">已生成 {completedReports}/3 份量表报告</p>
          </div>
        </div>
      )}

      {mode === 'assessment' && (
        <>
          <div className="flex-1 overflow-y-auto p-6 pb-28 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {SCALE_ORDER.map(key => {
                const config = SCALE_CONFIGS[key];
                const selected = key === activeScale;
                const answered = Object.keys(answersByScale[key]).length;
                const hasReport = reportedByScale[key];
                return (
                  <button
                    key={config.code}
                    onClick={() => setActiveScale(key)}
                    className={`rounded-2xl border p-3 text-left transition-colors ${
                      selected ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <p className="text-xs font-bold">{config.code}</p>
                    <p className={`text-[11px] mt-1 ${selected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {answered}/{config.questions.length}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${selected ? 'text-blue-100' : hasReport ? 'text-green-600' : 'text-slate-400'}`}>
                      {hasReport ? '已出报告' : '未出报告'}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-blue-500">{activeConfig.code}</p>
              <h2 className="text-base font-bold text-slate-800 mt-1">{activeConfig.title}</h2>
              <p className="text-xs text-slate-500 mt-1">{activeConfig.subtitle}</p>
              <p className="text-xs text-slate-400 mt-2">{activeConfig.intro}</p>
            </div>

            {notice && <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">{notice}</div>}

            {activeConfig.questions.map(question => (
              <div key={question.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  {question.id}. {question.text}
                </p>
                <div className={activeConfig.options.length === 5 ? 'grid grid-cols-5 gap-1.5' : 'grid grid-cols-2 gap-2'}>
                  {activeConfig.options.map(option => {
                    const selected = activeAnswers[question.id] === option.value;
                    return (
                      <button
                        key={option.label}
                        onClick={() => updateAnswer(question.id, option.value)}
                        className={`rounded-xl border transition-colors px-1 py-2.5 ${
                          selected ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                        } ${activeConfig.options.length === 5 ? 'text-[11px]' : 'text-xs'}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {reported && (
              <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4">{activeConfig.code} 报告</h3>

                <div className="rounded-2xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{activeConfig.code} 分数</p>
                    <p className={`text-xs font-bold ${severity.color}`}>{severity.label}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {score}/{activeConfig.maxScore} · 已答 {answeredCount}/{activeConfig.questions.length}
                  </p>
                  <div className="w-full h-2 rounded-full bg-slate-100 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${Math.max(Math.round((score / activeConfig.maxScore) * 100), 4)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{severity.desc}</p>
                </div>

                <div className={`mt-4 rounded-2xl p-4 border ${actionPlan.level === 'high' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                  <p className={`text-sm font-bold ${actionPlan.level === 'high' ? 'text-red-700' : 'text-blue-700'}`}>{actionPlan.title}</p>
                  <p className={`text-xs mt-1 ${actionPlan.level === 'high' ? 'text-red-600' : 'text-blue-600'}`}>{actionPlan.desc}</p>
                  <div className="mt-3 space-y-2">
                    {actionPlan.actions.map(item => (
                      <p key={item} className={`text-xs ${actionPlan.level === 'high' ? 'text-red-700' : 'text-blue-700'}`}>
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>

                {hasSelfHarmSignal && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                    <div className="flex items-center gap-1 font-semibold">
                      <CircleAlert size={14} />
                      风险提醒
                    </div>
                    <p className="mt-1">PHQ-9 第 9 题出现阳性信号。请优先联系人工支持，必要时立即拨打 999。</p>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-2">
                  {actionPlan.shouldBook ? (
                    <button
                      onClick={() => push({ id: 'booking', title: '心理咨询师预约' })}
                      className="w-full bg-blue-500 text-white rounded-xl py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={14} />
                      预约心理咨询师
                    </button>
                  ) : (
                    <button
                      className="w-full bg-green-50 text-green-700 border border-green-100 rounded-xl py-2.5 text-sm font-semibold"
                      disabled
                    >
                      当前状态较稳，可先不预约
                    </button>
                  )}

                  {actionPlan.showHotline && (
                    <button
                      onClick={() => {
                        window.location.href = 'tel:+442012345678';
                      }}
                      className="w-full bg-white border border-red-200 text-red-600 rounded-xl py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <PhoneCall size={14} />
                      呼叫 24h 紧急热线
                    </button>
                  )}

                  <button
                    onClick={() => openCustomerSupport()}
                    className="w-full bg-white border border-blue-100 text-blue-600 rounded-xl py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} />
                    联系心理支持
                  </button>

                  <button
                    onClick={() => {
                      setAnswersByScale(prev => ({ ...prev, [activeScale]: {} }));
                      setReportedByScale(prev => ({ ...prev, [activeScale]: false }));
                      setNotice('');
                    }}
                    className="w-full bg-slate-100 text-slate-700 rounded-xl py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    重做当前量表
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
            <button
              onClick={() => {
                if (answeredCount !== activeConfig.questions.length) {
                  setNotice(`仍有未作答题目，系统会先按默认值生成 ${activeConfig.code} 报告。`);
                  window.setTimeout(() => setNotice(''), 2000);
                }
                setReportedByScale(prev => ({ ...prev, [activeScale]: true }));
              }}
              className="w-full rounded-2xl py-3.5 font-semibold text-sm transition-colors bg-blue-500 text-white active:bg-blue-600"
            >
              生成 {activeConfig.code} 报告（{answeredCount}/{activeConfig.questions.length}）
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2 inline-flex items-center justify-center w-full gap-1">
              <CircleCheck size={12} />
              测评结果仅供参考，不替代专业医疗诊断
            </p>
          </div>
        </>
      )}
    </div>
  );
}
