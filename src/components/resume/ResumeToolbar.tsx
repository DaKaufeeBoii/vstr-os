"use client";

import Link from "next/link";

export default function ResumeToolbar() {
  const handleDownload = () => {
    // Open the PDF in a new tab for download
    window.open("/assets/resume/Sai_Tarun_Reddy_Velagala_Resume.pdf", "_blank");
  };

  return (
    <div className="resume-toolbar no-print">
      <Link href="/" className="resume-back">← Back to VSTR-OS</Link>
      <a
        href="/assets/resume/Sai_Tarun_Reddy_Velagala_Resume.pdf"
        download="Sai_Tarun_Reddy_Velagala_Resume.pdf"
        className="resume-print"
      >
        Download PDF
      </a>
      <a 
        href="/assets/resume/Sai_Tarun_Reddy_Velagala_Resume.pdf" 
        download="Sai_Tarun_Reddy_Velagala_Resume.pdf"
        className="resume-download"
      >
        Download PDF
      </a>
    </div>
  );
}
