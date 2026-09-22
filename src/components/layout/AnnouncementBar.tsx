import { forwardRef } from "react";

const AnnouncementBar = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="bg-navy text-navy-foreground py-2 px-4 text-center text-sm font-body">
      <span>🎉 Flat 20% OFF on all North East packages! | Call: <span className="font-semibold">94360 45075</span></span>
    </div>
  );
});

AnnouncementBar.displayName = "AnnouncementBar";

export default AnnouncementBar;
