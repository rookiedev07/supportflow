import React from 'react';
import { formatRelativeTime } from '../../utils/constants';
import { ShieldCheck, User as UserIcon } from 'lucide-react';

export const CommentList = ({ comments = [] }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-surface-border rounded-xl">
        No comments yet. Be the first to share an update.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isStaff =
          comment.author?.role === 'AGENT' || comment.author?.role === 'ADMIN';

        return (
          <div
            key={comment._id}
            className={`p-4 rounded-xl border transition-all ${
              isStaff
                ? 'bg-surface-card/90 border-brand-500/25 shadow-xs'
                : 'bg-surface-100/80 border-surface-border'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    isStaff
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      : 'bg-surface-hover text-slate-300 border border-surface-border'
                  }`}
                >
                  {comment.author?.name ? (
                    comment.author.name.charAt(0).toUpperCase()
                  ) : (
                    <UserIcon className="w-3 h-3" />
                  )}
                </div>

                <span className="text-xs font-semibold text-slate-200">
                  {comment.author?.name || 'Support User'}
                </span>

                {isStaff && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full border border-brand-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    {comment.author?.role}
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pl-8">
              {comment.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
