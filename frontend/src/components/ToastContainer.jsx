import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastEvent = (e) => {
      if (!e.detail) return;
      const newToast = {
        id: e.detail.id || Date.now() + Math.random().toString(),
        message: e.detail.message,
        type: e.detail.type || 'info',
        title: e.detail.title || ''
      };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('webfarm:toast', handleToastEvent);
    return () => window.removeEventListener('webfarm:toast', handleToastEvent);
  }, []);

  const handleDismiss = (id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          borderColor: 'border-emerald-200',
          badgeBg: 'bg-emerald-50 text-emerald-800',
          defaultTitle: 'Sucesso'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          iconColor: 'text-rose-600',
          borderColor: 'border-rose-200',
          badgeBg: 'bg-rose-50 text-rose-800',
          defaultTitle: 'Atenção'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: 'text-amber-600',
          borderColor: 'border-amber-200',
          badgeBg: 'bg-amber-50 text-amber-800',
          defaultTitle: 'Aviso'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          badgeBg: 'bg-blue-50 text-blue-800',
          defaultTitle: 'Informação'
        };
    }
  };

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);
        const IconComponent = config.icon;
        const displayTitle = toast.title || config.defaultTitle;

        return (
          <div
            key={toast.id}
            data-testid="toast-item"
            className={`pointer-events-auto bg-white/95 backdrop-blur-md border ${config.borderColor} shadow-lg shadow-slate-900/10 rounded-2xl p-3.5 flex items-start gap-3 transition-all duration-200 animate-page-enter`}
          >
            <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-slate-900">{displayTitle}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDismiss(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Fechar notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
