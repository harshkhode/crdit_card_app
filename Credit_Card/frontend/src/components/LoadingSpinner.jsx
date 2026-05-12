export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sz = { sm: 32, md: 48, lg: 64 }[size] || 48;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      {/* Spinning gold ring */}
      <div className="relative" style={{ width: sz, height: sz }}>
        <svg
          className="animate-spin"
          style={{ width: sz, height: sz }}
          viewBox="0 0 48 48"
          fill="none"
        >
          <circle
            cx="24" cy="24" r="20"
            stroke="rgba(201,168,64,0.12)"
            strokeWidth="3"
          />
          <path
            d="M24 4 A20 20 0 0 1 44 24"
            stroke="url(#goldSpin)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="goldSpin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c9a840" />
              <stop offset="100%" stopColor="#f0c060" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center diamond */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: '#c9a840', fontSize: '0.75rem', opacity: 0.6 }}
        >
          ◆
        </div>
      </div>

      {text && (
        <p
          className="text-sm font-medium tracking-wide"
          style={{ color: 'rgba(240,239,232,0.35)', letterSpacing: '0.05em' }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
