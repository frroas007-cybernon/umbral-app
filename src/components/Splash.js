import React from 'react';

function Splash({ visible }) {
  if (!visible) return null;

  return (
    <div className="splash-overlay">
      <svg viewBox="0 0 300 175" xmlns="http://www.w3.org/2000/svg" style={{ width: 220, height: 'auto' }}>
        <ellipse cx="150" cy="120" rx="42" ry="7" fill="#7AACB5" opacity="0.30"/>
        <ellipse cx="150" cy="125" rx="28" ry="4" fill="#7AACB5" opacity="0.18"/>
        <ellipse cx="150" cy="129" rx="16" ry="2.5" fill="#7AACB5" opacity="0.12"/>
        <path d="M 110 114 A 40 40 0 0 1 190 114 Z" fill="#C4977A"/>
        <line x1="84" y1="114" x2="216" y2="114" stroke="#3D3530" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="150" y1="66" x2="150" y2="82" stroke="#C4977A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="129" y1="71" x2="135.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="171" y1="71" x2="164.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
        <line x1="111" y1="87" x2="120" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="189" y1="87" x2="180" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="92" y1="108" x2="106" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="208" y1="108" x2="194" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M 124 114 A 26 26 0 0 1 176 114 Z" fill="#7AACB5" opacity="0.22"/>
        <text x="150" y="158" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fill="#3D3530" letterSpacing="9">UMBRAL</text>
      </svg>
    </div>
  );
}

export default Splash;