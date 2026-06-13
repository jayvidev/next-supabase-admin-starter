import { FileText } from 'lucide-react'

import { Button } from '@landing/components/ui/button'

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-x-hidden px-6 py-20 text-white sm:px-20"
      style={{
        background:
          'radial-gradient(ellipse 80% 80% at 20% 0%, rgba(244, 244, 245, 0.12), transparent), radial-gradient(ellipse 60% 60% at 80% -10%, rgba(62, 207, 142, 0.18), transparent), rgb(9, 9, 11)',
      }}
    >
      <div className="relative flex flex-nowrap items-center justify-center gap-8 sm:gap-12">
        <svg viewBox="0 0 180 180" className="size-16 sm:size-20" aria-label="Next.js" role="img">
          <mask
            id="nextjs-icon-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="180"
            height="180"
            style={{ maskType: 'alpha' }}
          >
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#nextjs-icon-mask)">
            <circle cx="90" cy="90" r="90" fill="black" />
            <path
              d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
              fill="url(#nextjs-icon-paint0)"
            />
            <rect x="115" y="54" width="12" height="72" fill="url(#nextjs-icon-paint1)" />
          </g>
          <defs>
            <linearGradient
              id="nextjs-icon-paint0"
              x1="109"
              y1="116.5"
              x2="144.5"
              y2="160.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="nextjs-icon-paint1"
              x1="121"
              y1="54"
              x2="120.799"
              y2="106.875"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <h6 className="text-3xl font-bold">+</h6>
        <svg viewBox="0 0 109 113" className="size-16 sm:size-20" aria-label="Supabase" role="img">
          <path
            d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
            fill="url(#supabase-paint0)"
          />
          <path
            d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
            fill="url(#supabase-paint1)"
            fillOpacity="0.2"
          />
          <path
            d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
            fill="#3ECF8E"
          />
          <defs>
            <linearGradient
              id="supabase-paint0"
              x1="53.9738"
              y1="54.974"
              x2="94.1635"
              y2="71.8295"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#249361" />
              <stop offset="1" stopColor="#3ECF8E" />
            </linearGradient>
            <linearGradient
              id="supabase-paint1"
              x1="36.1558"
              y1="30.578"
              x2="54.4844"
              y2="65.0806"
              gradientUnits="userSpaceOnUse"
            >
              <stop />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative mx-auto max-w-xl space-y-4 text-center">
        <h2 className="text-2xl font-bold">Welcome to your Next.js + Supabase Admin starter!</h2>
        <p className="text-sm text-white/70 sm:text-base">
          This is a clean starter template. Start building your project by editing{' '}
          <code className="rounded bg-white/10 px-1 py-0.5 font-semibold">
            app/(landing)/page.tsx
          </code>
          .
        </p>
      </div>

      <div className="relative flex flex-wrap justify-center gap-4">
        <Button
          href="https://github.com/jayvidev/landing-admin-starter"
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <path
              d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.372 6.839 9.728.5.095.682-.223.682-.495 0-.244-.009-.892-.014-1.75-2.782.615-3.369-1.372-3.369-1.372-.454-1.176-1.11-1.49-1.11-1.49-.908-.642.069-.63.069-.63 1.004.073 1.532 1.058 1.532 1.058.892 1.565 2.341 1.113 2.91.851.092-.667.35-1.113.636-1.37-2.22-.262-4.555-1.139-4.555-5.07 0-1.12.39-2.034 1.03-2.75-.103-.262-.446-1.315.097-2.741 0 0 .84-.275 2.75 1.05.798-.228 1.655-.342 2.505-.346.85.004 1.707.118 2.505.346 1.909-1.325 2.748-1.05 2.748-1.05.544 1.426.201 2.479.098 2.741.64.716 1.028 1.63 1.028 2.75 0 3.941-2.339 4.805-4.566 5.062.359.317.678.944.678 1.903 0 1.374-.012 2.48-.012 2.817 0 .274.18.594.688.494C19.137 20.62 22 16.781 22 12.253 22 6.59 17.523 2 12 2z"
              fill="currentColor"
            />
          </svg>
          GitHub
        </Button>
        <Button
          href="https://github.com/jayvidev/landing-admin-starter/tree/main/docs"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
        >
          <FileText className="size-4" aria-hidden="true" />
          Readme
        </Button>
      </div>
    </main>
  )
}
