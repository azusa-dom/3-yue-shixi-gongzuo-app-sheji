import { useState, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LoginFlow } from './screens/LoginFlow';
import { MainTabs } from './screens/MainTabs';
import { Benefits } from './screens/Benefits';
import { ServicePortal } from './screens/ServicePortal';
import { BookingDemo } from './screens/BookingDemo';
import { AboutUs } from './screens/AboutUs';
import { MedicalGuide } from './screens/MedicalGuide';
import { FAQ } from './screens/FAQ';
import { AcademicDocs } from './screens/AcademicDocs';
import { DemoDataProvider } from './context/DemoDataContext';
import { MentalAssessment } from './screens/MentalAssessment';
import { PrivacyPolicy } from './screens/PrivacyPolicy';
import { UserAgreement } from './screens/UserAgreement';
import { RequestProgress } from './screens/RequestProgress';

export type Screen = 
  | { id: 'login' }
  | { id: 'bind-phone' }
  | { id: 'invite-code' }
  | { id: 'main' }
  | { id: 'benefits' }
  | { id: 'service-portal' }
  | { id: 'booking', title: string }
  | { id: 'request-progress', requestId: string }
  | { id: 'about' }
  | { id: 'privacy' }
  | { id: 'user-agreement' }
  | { id: 'medical-guide' }
  | { id: 'faq' }
  | { id: 'academic-docs' }
  | { id: 'mental-assessment' };

interface NavContextType {
  push: (screen: Screen) => void;
  pop: () => void;
  reset: (screen: Screen) => void;
}

export const NavContext = createContext<NavContextType | null>(null);

export const useNav = () => {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('Missing NavContext');
  return ctx;
};

export default function App() {
  const [stack, setStack] = useState<Screen[]>([{ id: 'login' }]);
  const [activeTab, setActiveTab] = useState<'home' | 'assistant' | 'profile'>('home');

  const push = (screen: Screen) => setStack(prev => [...prev, screen]);
  const pop = () => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  const reset = (screen: Screen) => setStack([screen]);

  const currentScreen = stack[stack.length - 1];
  const screenKey =
    currentScreen.id === 'booking'
      ? `${currentScreen.id}-${currentScreen.title}`
      : currentScreen.id === 'request-progress'
        ? `${currentScreen.id}-${currentScreen.requestId}`
        : currentScreen.id;

  let topBg = 'bg-white';
  let statusText = 'text-black';
  let bottomBg = 'bg-white';

  if (currentScreen.id === 'main') {
    if (activeTab === 'home') {
      topBg = 'bg-blue-500';
      statusText = 'text-white';
    } else if (activeTab === 'profile') {
      topBg = 'bg-slate-50';
    }
    bottomBg = 'bg-white';
  } else if (currentScreen.id === 'benefits') {
    topBg = 'bg-blue-500';
    statusText = 'text-white';
  } else if (currentScreen.id === 'invite-code') {
    topBg = 'bg-slate-50';
    bottomBg = 'bg-slate-50';
  }

  return (
    <DemoDataProvider>
      <NavContext.Provider value={{ push, pop, reset }}>
        <div className="w-full min-h-dvh bg-slate-50 md:bg-[#121212] flex md:items-center md:justify-center font-sans text-slate-900">
        {/* Mobile-first viewport; desktop keeps iPhone frame preview */}
        <div className="w-full h-dvh md:w-[440px] md:h-[956px] bg-black relative overflow-hidden flex flex-col md:shadow-2xl md:rounded-[38px]">
          
          {/* Top Safe Area (Status Bar & Dynamic Island) */}
          <div className={`hidden md:flex h-[59px] w-full shrink-0 relative z-50 items-end justify-between px-8 pb-2 transition-colors duration-300 ${topBg} ${statusText}`}>
             <span className="text-[16px] font-semibold tracking-tight">9:41</span>
             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[125px] h-[37px] bg-black rounded-full z-[100]"></div>
             <div className="flex items-center gap-1.5 pb-0.5">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 11H3V8H1V11ZM5 11H7V5H5V11ZM9 11H11V2H9V11ZM13 11H15V0H13V11Z" fill="currentColor"/></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12C9.10457 12 10 11.1046 10 10C10 8.89543 9.10457 8 8 8C6.89543 8 6 8.89543 6 10C6 11.1046 6.89543 12 8 12Z" fill="currentColor"/><path d="M12 6.5C12 4.01472 9.98528 2 7.5 2C5.01472 2 3 4.01472 3 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M16 3.5C16 -0.642136 12.6421 -4 8.5 -4C4.35786 -4 1 -0.642136 1 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="20" height="10" rx="3" stroke="currentColor" strokeWidth="1"/><rect x="3" y="3" width="16" height="6" rx="1.5" fill="currentColor"/><path d="M23 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
             </div>
          </div>

          {/* App Content Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-50">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={screenKey}
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-20%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                className="absolute inset-0 bg-slate-50 flex flex-col"
              >
                {currentScreen.id === 'login' && <LoginFlow step="login" />}
                {currentScreen.id === 'bind-phone' && <LoginFlow step="bind-phone" />}
                {currentScreen.id === 'invite-code' && <LoginFlow step="invite-code" />}
                {currentScreen.id === 'main' && <MainTabs activeTab={activeTab} setActiveTab={setActiveTab} />}
                {currentScreen.id === 'benefits' && <Benefits />}
                {currentScreen.id === 'service-portal' && <ServicePortal />}
                {currentScreen.id === 'booking' && <BookingDemo title={currentScreen.title} />}
                {currentScreen.id === 'request-progress' && <RequestProgress requestId={currentScreen.requestId} />}
                {currentScreen.id === 'about' && <AboutUs />}
                {currentScreen.id === 'privacy' && <PrivacyPolicy />}
                {currentScreen.id === 'user-agreement' && <UserAgreement />}
                {currentScreen.id === 'medical-guide' && <MedicalGuide />}
                {currentScreen.id === 'faq' && <FAQ />}
                {currentScreen.id === 'academic-docs' && <AcademicDocs />}
                {currentScreen.id === 'mental-assessment' && <MentalAssessment />}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Bottom Safe Area (Home Indicator) */}
          <div className={`hidden md:flex h-[34px] w-full shrink-0 relative z-50 justify-center items-end pb-2 transition-colors duration-300 ${bottomBg}`}>
            <div className="w-[140px] h-[5px] bg-black rounded-full"></div>
          </div>
        </div>
      </div>
      </NavContext.Provider>
    </DemoDataProvider>
  );
}
