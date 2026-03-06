import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ServiceRequestStatus = 'submitted' | 'processing' | 'completed';
export type DocumentStatus = 'processing' | 'issued';

export interface UserProfile {
  name: string;
  uid: string;
  avatarUrl: string;
  phoneMasked: string;
}

export interface ServiceRequest {
  id: string;
  requestNo: string;
  title: string;
  preferredDate: string;
  preferredTime: string;
  note: string;
  status: ServiceRequestStatus;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  referenceNo: string;
  title: string;
  status: DocumentStatus;
  appliedAt: string;
  issuedAt?: string;
  relatedRequestNo?: string;
}

interface DemoDataState {
  membershipExpiry: string;
  inviteCode: string;
  profile: UserProfile;
  serviceRequests: ServiceRequest[];
  documentRecords: DocumentRecord[];
}

interface CreateServiceRequestInput {
  title: string;
  preferredDate: string;
  preferredTime: string;
  note: string;
}

interface DemoDataContextValue extends DemoDataState {
  setInviteCode: (code: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  createServiceRequest: (input: CreateServiceRequestInput) => ServiceRequest;
  markDocumentIssued: (id: string) => void;
}

const STORAGE_KEY = 'yuntu-demo-state-v1';

const initialState: DemoDataState = {
  membershipExpiry: '2026-04-01',
  inviteCode: '',
  profile: {
    name: '匿名用户',
    uid: '88294021',
    avatarUrl: '',
    phoneMasked: '131 **** 6666',
  },
  serviceRequests: [
    {
      id: 'service-seed-001',
      requestNo: 'SR-20260225-01',
      title: '心理在线评估',
      preferredDate: '2026-02-27',
      preferredTime: '14:00 - 16:00',
      note: '最近入学压力较大，睡眠波动明显。',
      status: 'processing',
      createdAt: '2026-02-25T10:30:00.000Z',
    },
  ],
  documentRecords: [
    {
      id: 'doc-seed-001',
      referenceNo: 'DOC-20251112-01',
      title: '流感病假证明',
      status: 'issued',
      appliedAt: '2025-11-12T09:00:00.000Z',
      issuedAt: '2025-11-12T15:30:00.000Z',
      relatedRequestNo: 'SR-20251112-01',
    },
    {
      id: 'doc-seed-002',
      referenceNo: 'DOC-20260228-01',
      title: '肠胃炎病假证明',
      status: 'processing',
      appliedAt: '2026-02-28T13:00:00.000Z',
      relatedRequestNo: 'SR-20260228-01',
    },
  ],
};

function parseStoredState(): DemoDataState {
  if (typeof window === 'undefined') {
    return initialState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoDataState>;
    return {
      membershipExpiry: parsed.membershipExpiry || initialState.membershipExpiry,
      inviteCode: parsed.inviteCode || '',
      profile: {
        ...initialState.profile,
        ...(parsed.profile || {}),
      },
      serviceRequests: Array.isArray(parsed.serviceRequests) ? parsed.serviceRequests : initialState.serviceRequests,
      documentRecords: Array.isArray(parsed.documentRecords) ? parsed.documentRecords : initialState.documentRecords,
    };
  } catch {
    return initialState;
  }
}

function createReference(prefix: 'SR' | 'DOC') {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const suffix = Math.floor(Math.random() * 90 + 10);
  return `${prefix}-${stamp}-${suffix}`;
}

function shouldCreateDocument(title: string, note: string) {
  return /病假|sick|note|证明|medical certificate/i.test(`${title} ${note}`);
}

function toDocumentTitle(title: string) {
  if (title.includes('病假条')) {
    return '病假条申请';
  }
  if (title.includes('病假')) {
    return title;
  }
  return `${title}相关医疗证明`;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoDataState>(() => parseStoredState());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setInviteCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, inviteCode: code.trim().toUpperCase() }));
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...patch,
      },
    }));
  }, []);

  const markDocumentIssued = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      documentRecords: prev.documentRecords.map(record =>
        record.id === id
          ? {
              ...record,
              status: 'issued',
              issuedAt: record.issuedAt || new Date().toISOString(),
            }
          : record,
      ),
    }));
  }, []);

  const createServiceRequest = useCallback(
    (input: CreateServiceRequestInput) => {
      const createdAt = new Date().toISOString();
      const requestNo = createReference('SR');
      const request: ServiceRequest = {
        id: `service-${requestNo}`,
        requestNo,
        title: input.title,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        note: input.note.trim(),
        status: /紧急|urgent/i.test(input.title) ? 'processing' : 'submitted',
        createdAt,
      };

      let createdDoc: DocumentRecord | null = null;
      if (shouldCreateDocument(input.title, input.note)) {
        const referenceNo = createReference('DOC');
        createdDoc = {
          id: `doc-${referenceNo}`,
          referenceNo,
          title: toDocumentTitle(input.title),
          status: 'processing',
          appliedAt: createdAt,
          relatedRequestNo: requestNo,
        };
      }

      setState(prev => ({
        ...prev,
        serviceRequests: [request, ...prev.serviceRequests],
        documentRecords: createdDoc ? [createdDoc, ...prev.documentRecords] : prev.documentRecords,
      }));

      if (createdDoc) {
        window.setTimeout(() => {
          markDocumentIssued(createdDoc.id);
        }, 12000);
      }

      return request;
    },
    [markDocumentIssued],
  );

  const value = useMemo<DemoDataContextValue>(
    () => ({
      ...state,
      setInviteCode,
      updateProfile,
      createServiceRequest,
      markDocumentIssued,
    }),
    [state, setInviteCode, updateProfile, createServiceRequest, markDocumentIssued],
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) {
    throw new Error('Missing DemoDataContext');
  }
  return ctx;
}
