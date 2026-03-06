import { useMemo, useState } from 'react';
import { useNav } from '../App';
import { useDemoData, type ServiceRequest } from '../context/DemoDataContext';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

function createUpcomingDates(days = 8) {
  const labels = ['日', '一', '二', '三', '四', '五', '六'];
  const options: Array<{ value: string; month: string; day: string; week: string }> = [];
  const toLocalDateKey = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  for (let i = 1; i <= days; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    options.push({
      value: toLocalDateKey(date),
      month: `${date.getMonth() + 1}月`,
      day: String(date.getDate()),
      week: `周${labels[date.getDay()]}`,
    });
  }

  return options;
}

interface GpIntakeForm {
  fullName: string;
  dateOfBirth: string;
  gender: '' | 'male' | 'female' | 'other';
  nationality: string;
  phoneNumber: string;
  email: string;
  emergencyName: string;
  emergencyPhone: string;
}

const initialGpForm: GpIntakeForm = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  phoneNumber: '',
  email: '',
  emergencyName: '',
  emergencyPhone: '',
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isLikelyPhone(value: string) {
  const normalized = value.replace(/[^\d+]/g, '');
  return normalized.length >= 8;
}

function shouldCollectGpInfo(title: string) {
  return /gp|全科|注册|建档/i.test(title);
}

function buildGpSummaryNote(form: GpIntakeForm) {
  return [
    '【GP 建档信息】',
    `姓名: ${form.fullName}`,
    `出生日期: ${form.dateOfBirth}`,
    `性别: ${form.gender === 'male' ? '男' : form.gender === 'female' ? '女' : '其他 / 不便透露'}`,
    `国籍: ${form.nationality}`,
    `联系电话: ${form.phoneNumber}`,
    `电子邮箱: ${form.email}`,
    `紧急联系人: ${form.emergencyName}（${form.emergencyPhone}）`,
  ].join('\n');
}

export function BookingDemo({ title }: { title: string }) {
  const { pop, push } = useNav();
  const { createServiceRequest } = useDemoData();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [gpForm, setGpForm] = useState<GpIntakeForm>(initialGpForm);
  const [formError, setFormError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  const isEmergency = /紧急|urgent/i.test(title);
  const requiresGpInfo = shouldCollectGpInfo(title);
  const dateOptions = useMemo(() => createUpcomingDates(8), []);
  const isGpRequiredFieldsFilled = useMemo(
    () =>
      Boolean(
        gpForm.fullName.trim() &&
          gpForm.dateOfBirth &&
          gpForm.gender &&
          gpForm.nationality.trim() &&
          gpForm.phoneNumber.trim() &&
          gpForm.email.trim() &&
          gpForm.emergencyName.trim() &&
          gpForm.emergencyPhone.trim(),
      ),
    [gpForm],
  );
  const timeOptions = isEmergency
    ? ['立即回呼', '30 分钟内回呼', '1 小时内回呼', '2 小时内回呼']
    : ['09:00 - 11:00', '11:00 - 13:00', '14:00 - 16:00', '16:00 - 18:00'];

  if (submittedRequest) {
    const successTitle = requiresGpInfo ? '建档申请已提交' : isEmergency ? '紧急支持已发起' : '预约申请已提交';
    const successDesc = requiresGpInfo
      ? '服务团队将基于你提交的信息完成建档并联系确认。'
      : isEmergency
        ? '客服将按你选择的时段优先回呼。'
        : '服务团队将尽快联系你确认具体安排。';

    return (
      <div className="flex-1 flex flex-col bg-white h-full items-center justify-center p-6 text-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isEmergency ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
          }`}
        >
          {isEmergency ? <AlertTriangle size={36} /> : <CheckCircle2 size={40} />}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{successTitle}</h2>
        <p className="text-slate-500 mb-2">
          申请编号：<span className="font-semibold text-slate-700">{submittedRequest.requestNo}</span>
        </p>
        <p className="text-slate-500 mb-8">{successDesc}</p>

        <div className="w-full max-w-xs space-y-3">
          {/病假|sick|note/i.test(title) && (
            <button
              onClick={() => push({ id: 'academic-docs' })}
              className="w-full bg-blue-500 text-white rounded-full py-3 font-medium active:bg-blue-600 transition-colors"
            >
              查看学业文件进度
            </button>
          )}
          <button
            onClick={pop}
            className="w-full bg-slate-100 text-slate-800 rounded-full py-3 font-medium active:bg-slate-200 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {isEmergency && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-red-700 text-sm leading-relaxed">
            若出现危及生命症状（胸痛、呼吸困难、意识丧失），请立即拨打 999。当前表单用于非致命但需快速支持的情况。
          </div>
        )}

        {requiresGpInfo && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="font-bold text-slate-800 mb-1">GP 建档基础信息</h2>
            <p className="text-xs text-slate-500 mb-4">请先完成建档字段，便于服务团队快速完成处理。</p>

            <div className="space-y-3">
              <LabeledInput
                label="姓名"
                value={gpForm.fullName}
                placeholder="例如：张三"
                onChange={value => setGpForm(prev => ({ ...prev, fullName: value }))}
              />
              <div>
                <p className="text-xs text-slate-500 mb-2">出生日期</p>
                <input
                  type="date"
                  value={gpForm.dateOfBirth}
                  onChange={event => setGpForm(prev => ({ ...prev, dateOfBirth: event.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">性别</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'male', label: '男' },
                    { value: 'female', label: '女' },
                    { value: 'other', label: '其他' },
                  ].map(option => {
                    const selected = gpForm.gender === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setGpForm(prev => ({ ...prev, gender: option.value as GpIntakeForm['gender'] }))}
                        className={`rounded-xl py-2.5 text-sm border transition-colors ${
                          selected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <LabeledInput
                label="国籍"
                value={gpForm.nationality}
                placeholder="例如：中国"
                onChange={value => setGpForm(prev => ({ ...prev, nationality: value }))}
              />
            </div>

            <h3 className="font-semibold text-slate-700 mt-5 mb-3">联系方式</h3>
            <div className="space-y-3">
              <LabeledInput
                label="电话号码"
                value={gpForm.phoneNumber}
                placeholder="例如：+44 7123 456789"
                inputMode="tel"
                onChange={value => setGpForm(prev => ({ ...prev, phoneNumber: value }))}
              />
              <LabeledInput
                label="电子邮箱"
                value={gpForm.email}
                placeholder="例如：name@email.com"
                type="email"
                onChange={value => setGpForm(prev => ({ ...prev, email: value }))}
              />
              <LabeledInput
                label="紧急联系人姓名"
                value={gpForm.emergencyName}
                placeholder="例如：李四"
                onChange={value => setGpForm(prev => ({ ...prev, emergencyName: value }))}
              />
              <LabeledInput
                label="紧急联系人电话"
                value={gpForm.emergencyPhone}
                placeholder="例如：+86 139 0000 0000"
                inputMode="tel"
                onChange={value => setGpForm(prev => ({ ...prev, emergencyPhone: value }))}
              />
            </div>
          </div>
        )}

        {!requiresGpInfo && (
          <>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CalendarIcon size={18} className="text-blue-500" />
                选择期望日期
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {dateOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDate(option.value)}
                    className={`py-3 rounded-xl flex flex-col items-center justify-center border transition-colors ${
                      selectedDate === option.value
                        ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200'
                    }`}
                  >
                    <span className="text-[10px] opacity-80 mb-1">{option.month}</span>
                    <span className="font-bold text-lg leading-none">{option.day}</span>
                    <span className="text-[10px] mt-1 opacity-80">{option.week}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                选择期望时间段
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl text-sm font-medium border transition-colors ${
                      selectedTime === time
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <h2 className="font-bold text-slate-800 mb-4">补充说明（选填）</h2>
          <textarea
            value={note}
            onChange={event => setNote(event.target.value)}
            placeholder={requiresGpInfo ? '可补充过敏史、既往病史、当前不适等信息...' : '请简要描述您的需求、症状开始时间、是否影响上课/考试等信息...'}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px] resize-none"
          />
        </div>

        {formError && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{formError}</div>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 pb-safe">
        <button
          onClick={() => {
            if (requiresGpInfo) {
              if (!isGpRequiredFieldsFilled) {
                setFormError('请完整填写 GP 建档所需的基础信息和联系方式。');
                return;
              }
              if (!isValidEmail(gpForm.email)) {
                setFormError('电子邮箱格式不正确，请检查后重试。');
                return;
              }
              if (!isLikelyPhone(gpForm.phoneNumber) || !isLikelyPhone(gpForm.emergencyPhone)) {
                setFormError('电话号码格式可能不完整，请补充区号或完整号码。');
                return;
              }
            } else if (!selectedDate || !selectedTime) {
              return;
            }

            setFormError('');
            const noteParts = [requiresGpInfo ? buildGpSummaryNote(gpForm) : '', note.trim()].filter(Boolean);
            const request = createServiceRequest({
              title,
              preferredDate: requiresGpInfo ? '资料建档' : selectedDate || '',
              preferredTime: requiresGpInfo ? '无需预约' : selectedTime || '',
              note: noteParts.join('\n'),
            });
            setSubmittedRequest(request);
          }}
          disabled={requiresGpInfo ? !isGpRequiredFieldsFilled : !selectedDate || !selectedTime}
          className={`w-full py-4 rounded-full font-medium text-lg transition-all ${
            requiresGpInfo ? isGpRequiredFieldsFilled : selectedDate && selectedTime
              ? 'bg-blue-500 text-white shadow-md shadow-blue-200 active:bg-blue-600'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {requiresGpInfo ? '提交建档信息' : '提交申请'}
        </button>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'email';
  inputMode?: 'text' | 'tel' | 'email';
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
