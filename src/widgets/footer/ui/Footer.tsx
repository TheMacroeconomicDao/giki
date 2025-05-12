'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import { useSettingsStore } from '@/entities/settings';

/**
 * Виджет подвала (футера) приложения
 * Содержит навигационные ссылки, информацию об авторских правах и контакты
 */
export const Footer: React.FC = () => {
  const { systemSettings } = useSettingsStore();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t w-full py-6 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О проекте */}
          <div>
            <h3 className="text-base font-medium mb-4">О проекте</h3>
            <p className="text-sm text-muted-foreground">
              {systemSettings?.site_description || 'Giki.js - это открытая платформа для создания и обмена знаниями с интегрированным AI-переводом.'}
            </p>
          </div>
          
          {/* Навигация */}
          <div>
            <h3 className="text-base font-medium mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/pages" className="text-muted-foreground hover:text-foreground transition-colors">
                  Страницы
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Дашборд
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Документация */}
          <div>
            <h3 className="text-base font-medium mb-4">Документация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/getting-started" className="text-muted-foreground hover:text-foreground transition-colors">
                  Начало работы
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/docs/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Соцсети */}
          <div>
            <h3 className="text-base font-medium mb-4">Присоединяйтесь</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/giki-org" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://twitter.com/gikiorg" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="mailto:info@giki.org" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Нижняя часть с копирайтом */}
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {systemSettings?.site_name || 'Giki.js'}. Все права защищены.
          </p>
          <div className="flex items-center mt-4 md:mt-0 text-sm text-muted-foreground">
            <span>Сделано с</span>
            <Heart className="h-4 w-4 mx-1 text-red-500" />
            <span>командой разработчиков</span>
          </div>
        </div>
      </div>
    </footer>
  );
}; 