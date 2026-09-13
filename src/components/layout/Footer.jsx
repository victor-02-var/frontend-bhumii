import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-6 text-xs no-print mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/emblem.svg" alt="Emblem" className="h-8 w-8 object-contain" />
            <div>
              <p className="font-bold text-slate-800">
                Department of Land Resources (DoLR) | Ministry of Rural Development
              </p>
              <p className="text-[10px] text-slate-500">
                Government of India | Smart India Hackathon (SIH) 2024 Solution for PS-25017
              </p>
            </div>
          </div>
          <div className="text-center md:text-right text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} National Informatics Centre (NIC) / LandGuard AI Project</p>
            <p className="text-[10px] text-slate-600">Designed for Early Delay Detection & Proactive Governance</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
