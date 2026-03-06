import { useRef, useState } from 'react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import {
  User,
  Globe,
  Phone,
  Bell,
  ShieldCheck,
  FileText,
  Info,
  Activity,
  ChevronRight,
  GraduationCap,
  Pencil,
  Camera,
  X,
  MessageCircle,
} from 'lucide-react';
import { openCustomerSupport } from '../lib/contact';
import { MembershipCard } from '../components/MembershipCard';

export function ProfileScreen() {
  const { push, reset } = useNav();
  const { membershipExpiry, inviteCode, profile, updateProfile } = useDemoData();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [notice, setNotice] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const openEditor = () => {
    setDraftName(profile.name);
    setShowEditor(true);
  };

  return (
    <div className="relative h-full overflow-hidden bg-slate-50">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800">我的</h1>
      </div>

      <div className="h-full overflow-y-auto p-6 pb-24">
        <button
          onClick={openEditor}
          className="w-full flex items-center gap-4 mb-8 bg-white border border-slate-100 rounded-3xl p-4 shadow-sm active:bg-slate-50"
        >
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="头像" className="w-16 h-16 rounded-full object-cover border border-blue-100" />
          ) : (
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <User size={32} />
            </div>
          )}
          <div className="text-left flex-1">
            <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
            <p className="text-sm text-slate-400">UID: {profile.uid} {inviteCode ? `· INVITE: ${inviteCode}` : ''}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Pencil size={14} />
          </div>
        </button>

        <div className="mb-4">
          <MembershipCard membershipExpiry={membershipExpiry} onOpenBenefits={() => push({ id: 'benefits' })} />
        </div>
        <button
          onClick={() => {
            openCustomerSupport();
            showNotice('正在进入即时咨询...');
          }}
          className="w-full mb-8 bg-white border border-slate-100 text-blue-600 rounded-2xl py-3 font-semibold inline-flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle size={15} />
          即时咨询
        </button>

        {notice && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">{notice}</div>
        )}

        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase ml-2">基础设置</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <SettingItem icon={<Pencil />} label="编辑个人资料" value="头像 / 昵称" onClick={openEditor} />
          <SettingItem icon={<Globe />} label="语言设置" value="简体中文" />
          <SettingItem icon={<Phone />} label="联系方式" value={profile.phoneMasked} />
          <SettingItem icon={<Bell />} label="消息提醒开关" isToggle={true} toggleValue={notificationsOn} onClick={() => setNotificationsOn(prev => !prev)} />
          <SettingItem icon={<GraduationCap />} label="学业文件" onClick={() => push({ id: 'academic-docs' })} />
        </div>

        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase ml-2">协议说明</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <SettingItem icon={<ShieldCheck />} label="隐私政策" onClick={() => push({ id: 'privacy' })} />
          <SettingItem icon={<FileText />} label="用户服务协议" onClick={() => push({ id: 'user-agreement' })} />
          <SettingItem icon={<Info />} label="关于我们" onClick={() => push({ id: 'about' })} />
          <SettingItem icon={<Activity />} label="版本号" value="v0.1.0" hideArrow />
        </div>

        <button
          onClick={() => reset({ id: 'login' })}
          className="w-full bg-red-50 text-red-500 rounded-full py-4 font-medium flex items-center justify-center gap-2 active:bg-red-100 transition-colors mb-8"
        >
          退出登录
        </button>
      </div>

      {showEditor && (
        <>
          <button
            className="absolute inset-0 bg-black/40 z-40"
            onClick={() => setShowEditor(false)}
            aria-label="关闭编辑"
          />
          <div className="absolute bottom-0 left-0 right-0 mx-3 mb-3 bg-white z-50 rounded-3xl p-6 shadow-2xl max-h-[84%] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">编辑个人资料</h3>
              <button
                onClick={() => setShowEditor(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="头像预览" className="w-16 h-16 rounded-full object-cover border border-blue-100" />
                ) : (
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                    <User size={28} />
                  </div>
                )}
                <div className="flex-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-700 text-sm rounded-xl py-2.5 font-medium active:bg-slate-200 inline-flex items-center justify-center gap-2"
                  >
                    <Camera size={14} />
                    上传头像
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={event => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = typeof reader.result === 'string' ? reader.result : '';
                        if (!result) return;
                        updateProfile({ avatarUrl: result });
                        showNotice('头像已更新');
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">昵称</p>
                <input
                  value={draftName}
                  onChange={event => setDraftName(event.target.value.slice(0, 20))}
                  placeholder="请输入昵称"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setShowEditor(false)}
                className="bg-slate-100 text-slate-700 rounded-xl py-3 font-medium active:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const nextName = draftName.trim() || '匿名用户';
                  updateProfile({ name: nextName });
                  setShowEditor(false);
                  showNotice('个人资料已保存');
                }}
                className="bg-blue-500 text-white rounded-xl py-3 font-medium active:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SettingItem({ icon, label, value, isToggle, toggleValue, hideArrow, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 flex items-center gap-4 border-b border-slate-50 last:border-0 text-left active:bg-slate-50 transition-colors"
    >
      <div className="text-blue-500 shrink-0">{icon}</div>
      <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
      {value && <span className="text-sm text-slate-400">{value}</span>}
      {isToggle && (
        <div className={`w-12 h-6 rounded-full relative transition-colors ${toggleValue ? 'bg-blue-500' : 'bg-slate-300'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${toggleValue ? 'right-1' : 'left-1'}`} />
        </div>
      )}
      {!isToggle && !hideArrow && <ChevronRight size={18} className="text-slate-300" />}
    </button>
  );
}
