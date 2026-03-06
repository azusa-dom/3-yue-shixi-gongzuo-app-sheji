import { Sparkles } from 'lucide-react';

function formatDateDot(value: string) {
  return value.replaceAll('-', '.');
}

export function MembershipCard({
  membershipExpiry,
  onOpenBenefits,
}: {
  membershipExpiry: string;
  onOpenBenefits: () => void;
}) {
  return (
    <section className="bg-gradient-to-br from-[#5C8EFB] via-[#3E76F0] to-[#245FE2] rounded-3xl p-6 text-white shadow-[0_18px_40px_rgba(50,102,227,0.35)] relative overflow-hidden">
      <div className="absolute -right-12 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute -left-16 -bottom-12 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute right-6 bottom-5 w-24 h-24 rounded-full border border-white/20" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] text-blue-100 tracking-[0.18em] uppercase">Membership</p>
            <h2 className="text-[26px] leading-tight font-black tracking-wide mt-1">云途护航会员</h2>
          </div>
          <button
            onClick={onOpenBenefits}
            className="inline-flex items-center gap-1 rounded-full bg-white/20 border border-white/30 px-3 py-1.5 text-[11px] font-semibold"
          >
            <Sparkles size={12} />
            会员权益
          </button>
        </div>
        <div className="rounded-2xl bg-white/12 border border-white/20 px-4 py-3">
          <p className="text-xs text-blue-100">状态：已激活</p>
          <p className="text-sm text-white mt-1">有效期至 {formatDateDot(membershipExpiry)}</p>
        </div>
      </div>
    </section>
  );
}
