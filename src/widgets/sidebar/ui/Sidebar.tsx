'use client';

import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full bg-background border-r p-4">
      <div className="flex items-center h-12 mb-6">
        <h2 className="font-bold text-xl">Giki.js</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <a 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
            >
              <span>Главная</span>
            </a>
          </li>
          <li>
            <a 
              href="/dashboard" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
            >
              <span>Дашборд</span>
            </a>
          </li>
          <li>
            <a 
              href="/settings" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
            >
              <span>Настройки</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}; 