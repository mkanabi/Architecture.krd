import React from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  type?: 'default' | 'success' | 'error' | 'warning';
}

interface ToasterState {
  toasts: Toast[];
}

const ToastContext = React.createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {},
});

export function Toaster() {
  const [state, setState] = React.useState<ToasterState>({
    toasts: [],
  });

  const addToast = React.useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      setState((prev) => ({
        toasts: [...prev.toasts, { ...toast, id }],
      }));

      if (toast.duration !== Infinity) {
        setTimeout(() => {
          setState((prev) => ({
            toasts: prev.toasts.filter((t) => t.id !== id),
          }));
        }, toast.duration || 3000);
      }
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {state.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              p-4 rounded-lg shadow-lg max-w-sm
              ${
                toast.type === 'success'
                  ? 'bg-green-500'
                  : toast.type === 'error'
                  ? 'bg-red-500'
                  : toast.type === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-black'
              }
              text-white
            `}
          >
            {toast.title && (
              <div className="font-bold mb-1">{toast.title}</div>
            )}
            {toast.description && <div>{toast.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};