import { CheckCircle2, Fingerprint, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminShell from '@/components/AdminShell';
import { getFingerprintId, removeFingerprintId, saveFingerprintId } from '@/lib/adminAuth';
import { APP_NAME } from '@/lib/constants';
import { isFingerprintSupported, registerFingerprint } from '@/lib/webauthn';

type Feedback = { tone: 'success' | 'error'; message: string } | null;

export default function AdminSettings() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Device sign-in for this admin panel.</p>
      </div>
      <div className="max-w-2xl space-y-6">
        <FingerprintCard />
      </div>
    </AdminShell>
  );
}


function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  const tone =
    feedback.tone === 'success'
      ? 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300'
      : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300';
  return (
    <p role="alert" className={`rounded-xl px-4 py-3 text-sm font-medium ${tone}`}>
      {feedback.message}
    </p>
  );
}

function FingerprintCard() {
  const [fingerprintId, setFingerprintId] = useState<string | null>(() => getFingerprintId());
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const supported = isFingerprintSupported();

  const handleRegister = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const id = await registerFingerprint(`${APP_NAME} admin`);
      saveFingerprintId(id);
      setFingerprintId(id);
      setFeedback({ tone: 'success', message: 'Fingerprint / Face ID is now set up on this device.' });
    } catch (error) {
      console.error('Fingerprint setup failed', error);
      setFeedback({ tone: 'error', message: 'Fingerprint setup was cancelled or is not available on this device.' });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = () => {
    removeFingerprintId();
    setFingerprintId(null);
    setFeedback({ tone: 'success', message: 'Fingerprint sign-in has been removed from this device.' });
  };

  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Fingerprint className="h-5 w-5 text-primary-500" /> Fingerprint / Face ID
      </h2>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        Sign in on this device with your fingerprint or face instead of typing your password.
      </p>

      <div className="mt-6 space-y-4">
        {!supported && (
          <p className="rounded-xl bg-ink-100 px-4 py-3 text-sm text-ink-600 dark:bg-ink-800 dark:text-ink-300">
            This browser does not support fingerprint or Face ID sign-in.
          </p>
        )}

        {supported && fingerprintId && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/40">
            <span className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" /> Enabled on this device
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        )}

        {supported && !fingerprintId && (
          <button type="button" onClick={handleRegister} disabled={busy} className="btn-primary">
            <Fingerprint className="h-4 w-4" />
            Set up fingerprint / Face ID
          </button>
        )}

        <FeedbackMessage feedback={feedback} />
      </div>
    </section>
  );
}
