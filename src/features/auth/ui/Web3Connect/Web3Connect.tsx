import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '../../model/store';
import { Web3Provider } from '../../model/types';

interface Web3ConnectProps {
  className?: string;
  buttonText?: string;
  onConnect?: (address: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Компонент подключения к Web3 кошелькам
 * Позволяет пользователю выбрать и подключить кошелек
 */
export const Web3Connect = ({
  className = '',
  buttonText = 'Подключить кошелек',
  onConnect,
  onError
}: Web3ConnectProps) => {
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  
  const { 
    walletAddress,
    web3Provider,
    setWalletAddress, 
    setWeb3Provider,
    setLoading: setStoreLoading,
    setError: setStoreError
  } = useAuthStore();

  // Проверяем, поддерживаются ли Web3 кошельки в браузере
  const isWeb3Supported = typeof window !== 'undefined' && 
    (window.ethereum || (window as any).walletconnect);

  const connectWallet = async (provider: Web3Provider) => {
    if (!isWeb3Supported) {
      const error = new Error('Web3 не поддерживается в этом браузере');
      setLastError(error.message);
      setStoreError(error.message);
      onError?.(error);
      return;
    }

    try {
      setLoading(true);
      setStoreLoading(true);
      setLastError(null);
      setStoreError(null);

      let address: string;
      
      // Подключение к кошельку в зависимости от выбранного провайдера
      if (provider === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask не установлен');
        }

        // Запрашиваем доступ к аккаунтам
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
      } 
      else if (provider === 'walletconnect') {
        // Заглушка для WalletConnect - в реальном проекте здесь будет интеграция
        address = '0x' + Math.random().toString(16).slice(2, 42);
      }
      else if (provider === 'coinbase') {
        // Заглушка для Coinbase Wallet - в реальном проекте здесь будет интеграция
        address = '0x' + Math.random().toString(16).slice(2, 42);
      } else {
        throw new Error('Неизвестный провайдер');
      }

      // Обновляем состояние
      setWalletAddress(address);
      setWeb3Provider(provider);
      
      // Вызываем колбэк при успешном подключении
      onConnect?.(address);
      
      return address;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка подключения кошелька';
      setLastError(errorMessage);
      setStoreError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  // Если кошелек уже подключен, показываем информацию о нем
  if (walletAddress && web3Provider) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="text-sm text-muted-foreground">
          Подключен: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setWalletAddress(null);
            setWeb3Provider(null);
          }}
        >
          Отключить
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={loading || !isWeb3Supported}>
            {loading ? 'Подключение...' : buttonText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => connectWallet('metamask')}>
            MetaMask
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => connectWallet('walletconnect')}>
            WalletConnect
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => connectWallet('coinbase')}>
            Coinbase Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {lastError && (
        <div className="text-sm text-destructive mt-2">{lastError}</div>
      )}
      
      {!isWeb3Supported && (
        <div className="text-sm text-destructive mt-2">
          Web3 не поддерживается в этом браузере. Установите MetaMask или используйте совместимый браузер.
        </div>
      )}
    </div>
  );
}; 