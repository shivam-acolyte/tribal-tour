"use client";

interface InstagramCTAProps {
  url?: string;
  className?: string;
}

export const InstagramCTA = ({
  url = "https://www.instagram.com/tribal_discovery?stkn=YXNwcXF0enBnZmdv",
  className = ""
}: InstagramCTAProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-24 right-6 z-50 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${className}`}
      aria-label="Follow us on Instagram"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    </a>
  );
};

export default InstagramCTA;
