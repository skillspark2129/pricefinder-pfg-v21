import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Inbox, Loader2, MessageCircle, RotateCcw } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import { useComplaints, type Complaint, type ComplaintStatus } from '@/hooks/useComplaints';
import { hasAdminDatabaseSession } from '@/lib/adminDatabaseSession';
import { buildWhatsAppChatUrl } from '@/lib/whatsapp';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  if (status === 'solved') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Solved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
      <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Pending
    </span>
  );
}

interface ComplaintCardProps {
  complaint: Complaint;
  busy: boolean;
  onStatusChange: (id: string, status: ComplaintStatus) => void;
}

function ComplaintCard({ complaint, busy, onStatusChange }: ComplaintCardProps) {
  const replyUrl = buildWhatsAppChatUrl(
    complaint.whatsapp,
    `Hi ${complaint.name}, this is Price Finder Globally replying to your message.`
  );

  return (
    <article className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6 dark:border-ink-700 dark:bg-ink-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-ink-900 dark:text-ink-50">{complaint.name}</h2>
          <p className="mt-1 text-sm tabular-nums text-ink-600 dark:text-ink-300">{complaint.whatsapp}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <time dateTime={complaint.created_at} className="text-xs text-ink-500 dark:text-ink-400">
            {formatDate(complaint.created_at)}
          </time>
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-800 dark:text-ink-100">{complaint.message}</p>

      {complaint.product_link && (
        <a
          href={complaint.product_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block break-all text-sm font-medium text-primary-700 underline-offset-2 hover:underline dark:text-primary-300"
        >
          {complaint.product_link}
        </a>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4 dark:border-ink-800">
        <button
          type="button"
          disabled={busy || complaint.status === 'solved'}
          onClick={() => onStatusChange(complaint.id, 'solved')}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Mark Solved
        </button>
        <button
          type="button"
          disabled={busy || complaint.status === 'pending'}
          onClick={() => onStatusChange(complaint.id, 'pending')}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-950/40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Pending
        </button>
        <a
          href={replyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Reply on WhatsApp
        </a>
      </div>
    </article>
  );
}

export default function AdminMessages() {
  const { complaints, status, reload, updateStatus } = useComplaints();
  const [hasWriteAccess, setHasWriteAccess] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    hasAdminDatabaseSession()
      .then((ok) => {
        if (active) setHasWriteAccess(ok);
      })
      .catch(() => {
        if (active) setHasWriteAccess(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const pendingCount = complaints.filter((item) => item.status === 'pending').length;

  const handleStatusChange = async (id: string, next: ComplaintStatus) => {
    setActionError(null);
    setBusyId(id);
    try {
      await updateStatus(id, next);
    } catch (error) {
      console.error('Complaint status failed to update', error);
      setActionError('The status could not be updated. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl dark:text-ink-50">Complains</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Messages from the contact page. Refreshes automatically.</p>
      </header>

      {!hasWriteAccess && (
        <div role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          You are not connected to the database, so complaints may not load. Sign out and sign in again.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-600 dark:text-ink-300">
          <span className="font-semibold text-ink-900 dark:text-ink-50">{pendingCount}</span> pending of{' '}
          {complaints.length} complain{complaints.length === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={() => void reload()}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Refresh
        </button>
      </div>

      {actionError && (
        <p role="alert" className="mb-4 text-sm font-medium text-red-600 dark:text-red-400">
          {actionError}
        </p>
      )}

      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading complains...
        </div>
      )}

      {status === 'error' && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          Complains could not be loaded. Please refresh the page.
        </p>
      )}

      {status === 'ready' && complaints.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-300 bg-white px-6 py-16 text-center dark:border-ink-700 dark:bg-ink-900">
          <Inbox className="h-10 w-10 text-ink-400" aria-hidden="true" />
          <p className="font-semibold text-ink-900 dark:text-ink-50">No complains yet</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">New messages from the contact page will appear here.</p>
        </div>
      )}

      {status === 'ready' && complaints.length > 0 && (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              busy={busyId === complaint.id}
              onStatusChange={(id, next) => void handleStatusChange(id, next)}
            />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
