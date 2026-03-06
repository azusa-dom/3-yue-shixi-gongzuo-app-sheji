import { useState } from 'react';
import { useNav } from '../App';
import { useDemoData } from '../context/DemoDataContext';
import { Check, ChevronRight, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';

export function LoginFlow({ step }: { step: 'login' | 'bind-phone' | 'invite-code' }) {
  const { push, reset } = useNav();
  const { setInviteCode } = useDemoData();
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (step === 'login') {
    return (
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-50 via-[#F4F8FF] to-white px-6 py-8 flex flex-col items-center justify-center">
        <div className="absolute -top-20 -right-16 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-[360px]">
          <div className="bg-white/85 backdrop-blur-xl border border-white shadow-[0_22px_60px_rgba(37,90,230,0.16)] rounded-[32px] px-6 py-8">
            <div className="flex justify-center mb-5">
              <Logo variant="full" className="w-[245px] h-[208px]" />
            </div>

            <div className="mb-6 text-center">
              <div className="text-3xl font-extrabold text-slate-800 mb-1 tracking-widest">131 **** 6666</div>
              <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <ShieldCheck size={12} className="text-blue-500" />
                中国联通 提供认证服务
              </div>
            </div>

            <button
              onClick={() => {
                if (!agreed) return;
                push({ id: 'invite-code' });
              }}
              className={`w-full py-4 rounded-2xl text-white font-semibold text-base transition-all ${
                agreed ? 'bg-blue-500 active:bg-blue-600 shadow-lg shadow-blue-200/70' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              本机号码一键登录
            </button>

            <button className="mt-4 w-full text-slate-500 text-sm font-medium hover:text-blue-500 transition-colors">其他手机号登录</button>

            {!agreed && <p className="mt-3 text-xs text-amber-600 text-center">请先勾选用户协议与隐私政策</p>}

            <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
              <button
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  agreed ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'
                }`}
              >
                {agreed && <Check size={10} strokeWidth={3} />}
              </button>
              <span>
                登录即同意 <span className="text-blue-500">《用户协议》</span> 与 <span className="text-blue-500">《隐私政策》</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'invite-code') {
    return (
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-white via-[#F6F9FF] to-slate-50 px-8 py-10 flex flex-col items-center justify-center">
        <div className="absolute -top-20 -right-16 w-72 h-72 bg-blue-200/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-14 w-64 h-64 bg-blue-100/35 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-[360px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_22px_60px_rgba(37,90,230,0.13)] rounded-[30px] p-6">
          <div className="flex flex-col items-center mb-8">
            <Logo variant="full" className="w-[205px] h-[170px]" />
            <p className="text-slate-600 text-sm text-center mt-1">请输入邀请码以继续使用服务</p>
            <p className="text-xs text-slate-400 mt-2">若未收到邀请码，请联系平台客服获取。</p>
          </div>

          <div className="relative mb-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
            </div>
            <input
              type="text"
              value={code}
              onChange={event => {
                setCode(event.target.value.toUpperCase());
                setError('');
              }}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  const normalized = code.trim().toUpperCase();
                  const valid = /^[A-Z0-9]+$/.test(normalized);
                  if (!valid) {
                    setError('请输入字母或数字的邀请码');
                    return;
                  }
                  setInviteCode(normalized);
                  reset({ id: 'main' });
                }
              }}
              placeholder="邀请码"
              className="w-full bg-transparent border-b border-slate-200 pl-8 py-3 focus:outline-none focus:border-blue-500 transition-colors text-lg tracking-wide"
            />
          </div>
          {error && <p className="text-xs text-red-500 mb-6">{error}</p>}
          {!error && <div className="h-6" />}

          <button
            onClick={() => {
              const normalized = code.trim().toUpperCase();
              const valid = /^[A-Z0-9]+$/.test(normalized);
              if (!valid) {
                setError('请输入字母或数字的邀请码');
                return;
              }
              setInviteCode(normalized);
              reset({ id: 'main' });
            }}
            className="w-full bg-blue-500 text-white rounded-2xl py-4 font-semibold text-base shadow-lg shadow-blue-200/70 active:bg-blue-600 transition-colors"
          >
            确定
          </button>

          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="text-xs text-slate-400">还没有邀请码？</span>
            <button className="text-blue-500 text-sm font-medium flex items-center gap-1">
              来看看我们的产品 <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
