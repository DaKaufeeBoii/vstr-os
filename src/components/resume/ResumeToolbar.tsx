"use client";

import Link from "next/link";

export default function ResumeToolbar() {
  return (
    <div className="resume-toolbar no-print">
      <Link href="/" className="resume-back">← Back to VSTR-OS</Link>
      <button type="button" onClick={() => window.print()} className="resume-print">
        Print / Save as PDF
      </button>
    </div>
  );
}
