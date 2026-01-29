"use client";

interface RejectionScreenProps {
  message: string;
  onReset: () => void;
}

export default function RejectionScreen({
  message,
  onReset,
}: RejectionScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center animate-fade-in">
        {/* X symbol */}
        <div className="text-danger-red text-6xl font-bold mb-8 animate-pulse-red">
          X
        </div>

        {/* Rejection message */}
        <div className="border border-danger-red p-8 bg-danger-red/5">
          <h2 className="text-danger-red text-sm uppercase tracking-widest mb-6">
            ACCESS DENIED
          </h2>
          <p className="text-text-light whitespace-pre-line leading-relaxed">
            {message}
          </p>
        </div>

        {/* Try again */}
        <button
          onClick={onReset}
          className="mt-8 text-accent-dim text-xs tracking-wider hover:text-text-grey transition-colors uppercase"
        >
          [ TRY AGAIN ]
        </button>
      </div>
    </div>
  );
}
