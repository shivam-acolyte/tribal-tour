import { forwardRef } from "react";

const AnnouncementBar = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="bg-navy text-navy-foreground py-2 px-4 text-center text-sm font-body">
      <span>🎉 Flat 20% OFF on all North East packages! Use code <span className="font-bold text-gold">TRIBAL20</span> | Call: <span className="font-semibold">9928-559-575</span></span>
    </div>
  );
});

AnnouncementBar.displayName = "AnnouncementBar";

export default AnnouncementBar;
