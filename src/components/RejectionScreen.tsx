"use client";

interface RejectionScreenProps {
  message: string;
}

export default function RejectionScreen({
  message,
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

      </div>
    </div>
  );
}
