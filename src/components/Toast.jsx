import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  if (!message) return null;

  return (
    <div className="toast-wrap">
      {type === 'success' && <CheckCircle2 size={16} />}
      {type === 'sparkle' && <Sparkles size={16} />}
      {type === 'error' && <AlertCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}
