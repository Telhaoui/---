import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Headphones, 
  HelpCircle, 
  Phone, 
  CheckCircle2 
} from 'lucide-react';
import { Language } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const LiveSupportWidget: React.FC<{ language: Language }> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'السلام عليكم ورحمة الله وبركاته! مرحباً بكم في خدمة الدعم الفني الفوري لمنارة الجزائر (24/7). كيف يمكنني مساعدتكم اليوم؟',
      time: 'الآن'
    }
  ]);

  const quickQuestions = [
    'كيف أجد أقرب مدرسة قرآنية لموقعي؟',
    'ما هي شروط نيل إجازة برواية ورش؟',
    'كيف أستخدم الخرائط دون إنترنت؟',
    'كيف أسجل ابني في الحلقات المسائية؟'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent instant support response
    setTimeout(() => {
      let reply = 'شكراً لتواصلك. فريق الدعم الفني والمرشد الذكي لمنارة الجزائر رهن إشارتكم على مدار الساعة.';
      const lower = text.toLowerCase();

      if (lower.includes('أقرب') || lower.includes('موقع') || lower.includes('خريطة')) {
        reply = 'يمكنك الضغط على زر "أقرب مؤسسة إليّ" بالأعلى في شاشة الخريطة، وسيقوم النظام بتحديد موقعك عبر GPS وعرض أقرب المدارس والزوايا مع مسافة الكيلومترات ورابط الملاحة المباشر.';
      } else if (lower.includes('ورش') || lower.includes('إجازة') || lower.includes('سند')) {
        reply = 'للحصول على إجازة بالسند المتصل برواية ورش عن نافع، يمكنك تصفية المدارس بالضغط على خيار "إجازات بالسند" (مثل جامع الجزائر، معهد ابن باديس، والزاوية البلقايدية) والتواصل مباشرة مع الشيخ المشرف عبر الهاتف المدرج.';
      } else if (lower.includes('إنترنت') || lower.includes('offline') || lower.includes('أوفلاين')) {
        reply = 'يوفر التطبيق ميزة "حفظ أوفلاين" عبر زر التنزيل في شريط البحث. بمجرد الضغط عليه، تُحفظ بيانات المدارس والخرائط الأساسية في ذاكرة جهازك لتعمل معك في أي مكان بدون اتصال.';
      } else if (lower.includes('تسجيل') || lower.includes('ابن') || lower.includes('حلقات')) {
        reply = 'التسجيل في المدارس القرآنية مفتوح للأطفال واليافعين عبر زيارة المؤسسة أو الاتصال بالرقم الموضح في بطاقة المدرسة. كما يتيح لك فضاء "متابعة الطالب وولي الأمر" متابعة الأوراد اليومية وتقارير التقييم لحظياً.';
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 start-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 cursor-pointer border-2 border-amber-300"
          title="مساعد الدعم الفني الفوري 24/7"
        >
          <div className="relative">
            <Headphones className="w-5 h-5 text-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -end-1 animate-ping"></span>
          </div>
          <span className="font-bold text-xs sm:text-sm">الدعم الفني 24/7</span>
        </button>
      )}

      {/* Support Chat Dialog */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col h-[480px] overflow-hidden animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-amber-400 text-amber-300 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                  <span>مرشد منارة الجزائر الفوري</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-emerald-200">دعم فني وتوجيه قرآني متاح 24/7</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ Pills */}
          <div className="bg-slate-50 p-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[10px] text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium transition cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    م
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[9px] opacity-70 block text-end mt-1">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استفسارك الفني أو الديني هنا..."
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
