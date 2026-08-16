import React from 'react';

export default function DocsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-4xl font-bold mb-6">VSTR-OS Documentation</h1>
      <p className="text-lg mb-8 opacity-80">
        Welcome to the technical documentation for VSTR-OS. Here you'll find guides for development, 
        architecture overview, and user instructions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-white/10 rounded-xl bg-white/5">
          <h2 className="text-xl font-semibold mb-2">User Guide</h2>
          <p className="opacity-60 mb-4">Learn how to navigate and use the VSTR-OS environment.</p>
        </div>
        
        <div className="p-6 border border-white/10 rounded-xl bg-white/5">
          <h2 className="text-xl font-semibold mb-2">Technical Architecture</h2>
          <p className="opacity-60 mb-4">Deep dive into the window manager and state management.</p>
        </div>
      </div>
    </div>
  );
}
