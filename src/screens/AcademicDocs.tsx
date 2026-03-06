import { useMemo, useState } from 'react';
import { useNav } from '../App';
import { useDemoData, type DocumentRecord } from '../context/DemoDataContext';
import { ChevronLeft, FileText, Plus, Clock, CheckCircle2, X } from 'lucide-react';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(+date)) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function downloadRecordFile(record: DocumentRecord) {
  const content = [
    'FCM - Medical Certificate',
    `Reference: ${record.referenceNo}`,
    `Title: ${record.title}`,
    `Applied At: ${formatDate(record.appliedAt)}`,
    `Issued At: ${record.issuedAt ? formatDate(record.issuedAt) : 'Pending'}`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${record.referenceNo}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function AcademicDocs() {
  const { pop, push } = useNav();
  const { documentRecords, markDocumentIssued } = useDemoData();
  const [notice, setNotice] = useState('');
  const [activeRecord, setActiveRecord] = useState<DocumentRecord | null>(null);

  const records = useMemo(
    () => [...documentRecords].sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt)),
    [documentRecords],
  );

  const showNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden relative">
      <div className="pt-12 pb-4 px-6 bg-white flex items-center sticky top-0 z-10 shadow-sm">
        <button onClick={pop} className="p-2 -ml-2 text-slate-800 active:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2">学业文件</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>

          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">病假条申请</h2>
              <p className="text-blue-100 text-sm">Sick Note / Medical Certificate</p>
            </div>
          </div>

          <p className="text-sm text-blue-50 leading-relaxed mb-6 relative z-10">
            可用于学业请假、延期考试或缺勤说明。提交申请后将自动出现在下方记录中。
          </p>

          <button
            onClick={() => push({ id: 'booking', title: '申请病假条' })}
            className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-colors rounded-full py-3 font-bold flex items-center justify-center gap-2 relative z-10 shadow-sm"
          >
            <Plus size={20} />
            申请病假条
          </button>
        </div>

        {notice && (
          <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
            {notice}
          </div>
        )}

        <div className="flex items-center justify-between mb-4 ml-2">
          <h3 className="font-bold text-slate-800">申请记录</h3>
          <span className="text-xs text-slate-400">共 {records.length} 条</span>
        </div>

        <div className="space-y-4">
          {records.map(record => (
            <div
              key={record.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${
                record.status === 'processing' ? 'border-slate-100' : 'border-blue-100'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className={record.status === 'issued' ? 'text-blue-500' : 'text-slate-400'} />
                  <span className="font-bold text-slate-800 text-sm">{record.title}</span>
                </div>
                {record.status === 'issued' ? (
                  <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    已出具
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <Clock size={12} />
                    处理中
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 mb-3 space-y-1">
                <p>申请日期: {formatDate(record.appliedAt)}</p>
                <p>编号: {record.referenceNo}</p>
                {record.relatedRequestNo && <p>关联申请: {record.relatedRequestNo}</p>}
              </div>

              {record.status === 'issued' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveRecord(record)}
                    className="flex-1 bg-slate-50 text-slate-600 text-xs font-medium py-2 rounded-lg border border-slate-100 active:bg-slate-100 transition-colors"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => {
                      downloadRecordFile(record);
                      showNotice('文件已下载（.txt）');
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 rounded-lg border border-blue-100 active:bg-blue-100 transition-colors"
                  >
                    下载文件
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    markDocumentIssued(record.id);
                    showNotice('已为你催办，该记录状态已更新为“已出具”');
                  }}
                  className="w-full bg-slate-50 text-slate-600 text-xs font-medium py-2 rounded-lg border border-slate-100 active:bg-slate-100 transition-colors"
                >
                  催办并刷新状态
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeRecord && (
        <>
          <button
            onClick={() => setActiveRecord(null)}
            className="absolute inset-0 bg-black/40 z-40"
            aria-label="关闭详情"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">文件详情</h3>
              <button
                onClick={() => setActiveRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>标题：{activeRecord.title}</p>
              <p>编号：{activeRecord.referenceNo}</p>
              <p>申请日期：{formatDate(activeRecord.appliedAt)}</p>
              <p>签发日期：{activeRecord.issuedAt ? formatDate(activeRecord.issuedAt) : '待签发'}</p>
              <p>状态：{activeRecord.status === 'issued' ? '已出具' : '处理中'}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
