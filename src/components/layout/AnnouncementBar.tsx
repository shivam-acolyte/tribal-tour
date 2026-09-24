import { forwardRef } from "react";

const AnnouncementBar = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="bg-navy text-navy-foreground py-1.5 sm:py-2 px-2 sm:px-4 text-center text-[11px] min-[360px]:text-xs sm:text-sm font-body">
      <span>
        🎉 Flat 20% OFF on all North East packages! | <span className="whitespace-nowrap">Call: <span className="font-semibold">94360 45075</span></span>
      </span>
    </div>
  );
});

AnnouncementBar.displayName = "AnnouncementBar";

export default AnnouncementBar;
