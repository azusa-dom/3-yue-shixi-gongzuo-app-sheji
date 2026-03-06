import { Home, MessageSquare, User } from 'lucide-react';
import { HomeScreen } from './Home';
import { AssistantScreen } from './Assistant';
import { ProfileScreen } from './Profile';

export function MainTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'home' | 'assistant' | 'profile';
  setActiveTab: (tab: 'home' | 'assistant' | 'profile') => void;
}) {
  return (
    <div className="flex-1 relative bg-slate-50">
      <div className="absolute inset-0 pb-[72px] overflow-hidden">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'assistant' && <AssistantScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>
      
      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] pt-2 pb-2 px-6 flex justify-between items-center z-40 h-[60px]">
        <TabItem icon={<Home />} label="主页" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <TabItem icon={<MessageSquare />} label="智能助手" active={activeTab === 'assistant'} onClick={() => setActiveTab('assistant')} />
        <TabItem icon={<User />} label="我的" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </div>
    </div>
  );
}

function TabItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${active ? 'text-blue-500' : 'text-slate-400'}`}>
      <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform duration-200`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
