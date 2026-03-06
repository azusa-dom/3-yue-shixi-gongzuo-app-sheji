import type { DocumentRecord, ServiceRequest } from '../context/DemoDataContext';

export type AssistantIntent =
  | 'emergency'
  | 'gp-booking'
  | 'sick-note'
  | 'benefits'
  | 'mental-health'
  | 'status'
  | 'cost'
  | 'nhs-process'
  | 'general';

export interface AssistantAction {
  type:
    | 'open-booking'
    | 'open-medical-guide'
    | 'open-faq'
    | 'open-academic-docs'
    | 'open-mental-assessment'
    | 'open-benefits'
    | 'open-request-progress';
  label: string;
  payload?: string;
}

export interface AssistantContextData {
  membershipExpiry: string;
  serviceRequests: ServiceRequest[];
  documentRecords: DocumentRecord[];
}

export interface AssistantReply {
  intent: AssistantIntent;
  text: string;
  followUps: string[];
  action?: AssistantAction;
  urgency: 'normal' | 'urgent';
}

const intentRules: Array<{ intent: AssistantIntent; keywords: string[] }> = [
  {
    intent: 'emergency',
    keywords: ['紧急情况', '紧急', '急救', '急诊', '胸痛', '昏迷', '呼吸困难', '大出血', '救护车', '999', '111', '休克', '抽搐'],
  },
  {
    intent: 'sick-note',
    keywords: ['sick note', 'fit note', '病假', '请假证明', 'medical certificate', '延期考试', '缺勤'],
  },
  {
    intent: 'gp-booking',
    keywords: ['gp', '全科', '注册', '挂号', '预约医生', '诊所', '建档'],
  },
  {
    intent: 'mental-health',
    keywords: ['焦虑', '抑郁', '压力', '失眠', '情绪', 'panic', '心理', '心情'],
  },
  {
    intent: 'status',
    keywords: ['进度', '状态', '什么时候', '多久', '回访', '已提交', '申请记录', '催办'],
  },
  {
    intent: 'benefits',
    keywords: ['权益', '会员', '套餐', '有效期', '服务包含', '包括什么'],
  },
  {
    intent: 'cost',
    keywords: ['费用', '多少钱', '价格', '收费', '自费', '报销'],
  },
  {
    intent: 'nhs-process',
    keywords: ['nhs', '111', 'walk-in', 'urgent care', 'a&e', '流程', '看病流程'],
  },
];

function inferIntent(input: string, lastIntent?: AssistantIntent): AssistantIntent {
  const normalized = input.replace(/\s+/g, '').toLowerCase();
  if (/紧急情况.*(电话|拨打)|拨打.*(999|111)|急救电话/.test(normalized)) {
    return 'emergency';
  }
  if (/如何预约gp|预约gp|gp怎么预约/.test(normalized)) {
    return 'gp-booking';
  }
  if (/什么是sicknote|fitnote|病假条是什么/.test(normalized)) {
    return 'sick-note';
  }

  const text = input.toLowerCase();
  let winner: AssistantIntent = 'general';
  let maxScore = 0;

  for (const rule of intentRules) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      winner = rule.intent;
    }
  }

  if (maxScore === 0 && lastIntent && /那|然后|接下来|怎么办|要多久|需要什么/.test(input)) {
    return lastIntent;
  }

  return winner;
}

function getLatestService(serviceRequests: ServiceRequest[]) {
  return [...serviceRequests].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];
}

function getLatestDoc(documentRecords: DocumentRecord[]) {
  return [...documentRecords].sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt))[0];
}

function toZhStatus(status: string) {
  if (status === 'submitted') return '已提交';
  if (status === 'processing') return '处理中';
  if (status === 'completed') return '已完成';
  return status;
}

function buildGeneralReply(input: string): AssistantReply {
  return {
    intent: 'general',
    urgency: 'normal',
    text:
      `我已收到你的问题：${input}。\n建议你先告诉我当前症状持续时间、严重程度、是否影响上课/日常活动，我会给你明确的下一步路径和对应服务入口。`,
    followUps: ['我想预约 GP', '我需要申请 Sick Note', '帮我判断是否紧急', '查看我的服务进度'],
    action: { type: 'open-faq', label: '查看常见问题' },
  };
}

export function generateAssistantReply(params: {
  input: string;
  context: AssistantContextData;
  lastIntent?: AssistantIntent;
}): AssistantReply {
  const intent = inferIntent(params.input, params.lastIntent);
  const latestService = getLatestService(params.context.serviceRequests);
  const latestDoc = getLatestDoc(params.context.documentRecords);

  if (intent === 'emergency') {
    return {
      intent,
      urgency: 'urgent',
      text:
        '你描述的情况可能涉及紧急风险。请先按英国紧急分级处理：\n1) 若出现胸痛、呼吸困难、意识丧失或大出血，请立即拨打 999。\n2) 非致命但需要当日医疗建议，请拨打 NHS 111。\n3) 同时你可以在 App 发起「紧急热线 24h」路径，我们会协助后续分诊与就医衔接。',
      followUps: ['我现在需要发起紧急支持', '111 和 999 的使用区别是什么？', '去 A&E 前要准备什么？'],
      action: { type: 'open-booking', label: '发起紧急支持', payload: '紧急支持 (24小时)' },
    };
  }

  if (intent === 'gp-booking') {
    return {
      intent,
      urgency: 'normal',
      text:
        'GP 建档建议按这个顺序：\n1) 填写基础信息与联系方式。\n2) 补充当前症状或既往病史（选填）。\n3) 提交建档申请后等待服务团队回访确认。\n4) 完成建档后再进入后续 GP 就诊安排。',
      followUps: ['帮我发起 GP 注册与建档', '预约 GP 一般要等多久？', '初诊需要准备哪些材料？'],
      action: { type: 'open-booking', label: '发起 GP 注册申请', payload: 'GP 注册与建档' },
    };
  }

  if (intent === 'sick-note') {
    const docStatusText = latestDoc
      ? `你最近一条病假条记录：${latestDoc.title}（${latestDoc.referenceNo}），当前状态为「${latestDoc.status === 'issued' ? '已出具' : '处理中'}」。`
      : '你当前还没有病假条申请记录。';

    return {
      intent,
      urgency: 'normal',
      text:
        `可以申请。Sick Note（Fit Note）通常需要医生根据病情评估后开具。\n${docStatusText}\n建议你提交时写清楚：症状起始时间、影响学习/考试的具体情况、需要请假的时间段。`,
      followUps: ['现在就发起病假条申请', '病假条多久可以出具？', '学校一般需要什么格式？'],
      action: { type: 'open-booking', label: '申请病假条', payload: '申请病假条' },
    };
  }

  if (intent === 'benefits') {
    return {
      intent,
      urgency: 'normal',
      text:
        `你的会员服务当前为激活状态，有效期至 ${params.context.membershipExpiry}。核心权益包括：中文医疗沟通支持、GP 注册与分诊协助、心理评估支持、学业文件协助（如 Sick Note）以及紧急情况下就医指引。`,
      followUps: ['打开我的权益页面', '学业文件支持具体包含什么？', '紧急支持是 24 小时在线吗？'],
      action: { type: 'open-benefits', label: '查看会员权益' },
    };
  }

  if (intent === 'mental-health') {
    return {
      intent,
      urgency: 'normal',
      text:
        '如果你近期有持续焦虑、失眠或情绪低落，建议尽快完成心理测评中心（PHQ-9 / GAD-7 / PSS-10）。评估后系统会给出分级动作建议，必要时可协助转接心理咨询或 GP 路径。',
      followUps: ['帮我预约心理在线评估', '评估大概需要多长时间？', '家长可以同步收到结果吗？'],
      action: { type: 'open-mental-assessment', label: '开始心理测评' },
    };
  }

  if (intent === 'status') {
    if (!latestService) {
      return {
        intent,
        urgency: 'normal',
        text: '你目前还没有服务申请记录。可以告诉我你要办理哪项服务，我会引导你一步提交完成。',
        followUps: ['我要预约医生', '我要申请病假条', '我要心理支持'],
        action: { type: 'open-booking', label: '发起服务申请', payload: '找医生与科室' },
      };
    }

    const hasSchedule = Boolean(
      latestService.preferredDate &&
        latestService.preferredTime &&
        latestService.preferredTime !== '无需预约' &&
        latestService.preferredDate !== '资料建档',
    );
    const scheduleText = hasSchedule
      ? `期望时间：${latestService.preferredDate} ${latestService.preferredTime}。`
      : '该申请为资料提交，不涉及预约时段。';

    return {
      intent,
      urgency: 'normal',
      text:
        `你最近的服务申请是「${latestService.title}」（${latestService.requestNo}），当前状态：${toZhStatus(latestService.status)}。\n${scheduleText}\n如你希望加急，我建议补充症状严重程度和可接听回访时间。`,
      followUps: ['帮我催办这条申请', '我想修改预约时间', '查看病假条记录'],
      action: { type: 'open-request-progress', label: '查看这条服务进度', payload: latestService.id },
    };
  }

  if (intent === 'cost') {
    return {
      intent,
      urgency: 'normal',
      text:
        '费用通常分为两部分：\n1) 会员服务内项目：按套餐权益执行。\n2) 套餐外项目：如私立专科、药品费用等，按实际发生费用结算。\n如果你告诉我具体需求（例如“心理咨询”或“影像检查”），我可以给你更精确的费用范围说明。',
      followUps: ['药品费用是否包含在套餐里？', 'NHS 转诊是否免费？', '私立专科大概多少钱？'],
      action: { type: 'open-faq', label: '查看费用说明' },
    };
  }

  if (intent === 'nhs-process') {
    return {
      intent,
      urgency: 'normal',
      text:
        '英国常见就医路径是：日常问题先 GP，紧急但非致命用 111 / Urgent Care，危及生命用 999 / A&E。你可以先描述当前症状和持续时间，我会帮你判断优先级并给出更具体的就医路径。',
      followUps: ['我现在发烧 3 天该走哪条路径？', 'A&E 和 Urgent Care 区别是什么？', '先看 GP 还是先去药店？'],
      action: { type: 'open-medical-guide', label: '查看就医指南' },
    };
  }

  return buildGeneralReply(params.input);
}
