"use client";

import { useLiveCms } from "@/lib/cms-data";

export function AnnouncementBar() {
  const { cms } = useLiveCms();
  const { message1, message2, message3, message4 } = cms.announcement;

  return (
    <div className="announce-bar" id="announce-bar">
      <div className="announce-track">
        <span>{message1}</span>
        <span className="ann-sep">•</span>
        <span>{message2}</span>
        <span className="ann-sep">•</span>
        <span>{message3}</span>
        <span className="ann-sep">•</span>
        <span>{message4}</span>
        <span className="ann-sep">•</span>
        <span>{message1}</span>
        <span className="ann-sep">•</span>
        <span>{message2}</span>
        <span className="ann-sep">•</span>
        <span>{message3}</span>
        <span className="ann-sep">•</span>
        <span>{message4}</span>
      </div>
    </div>
  );
}
