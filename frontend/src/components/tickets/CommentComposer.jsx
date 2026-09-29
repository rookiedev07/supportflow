import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Send } from 'lucide-react';

export const CommentComposer = ({ onSubmit, isSubmitting = false, placeholder = 'Write a response...' }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    await onSubmit(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative rounded-xl border border-surface-border bg-surface-100 overflow-hidden focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSubmitting}
          className="w-full p-3.5 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between px-3 py-2 bg-surface-card border-t border-surface-border/60">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-50 border border-surface-border font-mono text-[10px]">Ctrl+Enter</kbd> to send
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isSubmitting}
            isLoading={isSubmitting}
            icon={Send}
          >
            Send Reply
          </Button>
        </div>
      </div>
    </form>
  );
};
