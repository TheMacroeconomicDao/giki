import React, { useState } from 'react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card';
import { Alert, AlertDescription } from '@shared/ui/alert';
import { Spinner } from '@shared/ui/spinner';
import { useAuthStore } from '../../model/store';
import { Web3Connect } from '../Web3Connect';

interface SignMessageProps {
  message: string;
  className?: string;
  onSignComplete?: (signature: string) => void;
  onSignError?: (error: Error) => void;
}

/**
 * Компонент для подписи сообщения через Web3 кошелек
 */
export const SignMessage = ({
  message,
  className = '',
  onSignComplete,
  onSignError
}: SignMessageProps) => {
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { walletAddress, web3Provider } = useAuthStore();

  const signMessage = async () => {
    if (!walletAddress || !web3Provider) {
      setError('Кошелек не подключен');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let signedMessage: string;
      
      if (web3Provider === 'metamask') {
        if (!window.ethereum) {
          throw new Error('MetaMask не установлен');
        }
        
        // Подписываем сообщение через Web3
        signedMessage = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, walletAddress]
        });
      } else {
        // Заглушка для других кошельков - в реальном проекте здесь будет интеграция
        signedMessage = '0x' + Array(130).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('');
      }
      
      setSignature(signedMessage);
      onSignComplete?.(signedMessage);
      
      return signedMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при подписи сообщения';
      setError(errorMessage);
      onSignError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Подпись сообщения</CardTitle>
      </CardHeader>
      
      <CardContent>
        {!walletAddress && (
          <>
            <p className="mb-4 text-muted-foreground">
              Для подписи сообщения необходимо подключить кошелек
            </p>
            <Web3Connect />
          </>
        )}

        {walletAddress && (
          <>
            <div className="mb-4">
              <p className="font-medium mb-2">Сообщение для подписи:</p>
              <div className="p-3 bg-muted rounded-md overflow-auto max-h-40">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {message}
                </pre>
              </div>
            </div>

            {signature && (
              <div className="mb-4">
                <p className="font-medium mb-2">Подпись:</p>
                <div className="p-3 bg-muted rounded-md overflow-auto max-h-40">
                  <pre className="text-sm whitespace-pre-wrap break-all">
                    {signature}
                  </pre>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>

      {walletAddress && !signature && (
        <CardFooter>
          <Button 
            onClick={signMessage}
            disabled={loading || !walletAddress}
          >
            {loading && <Spinner className="mr-2" />}
            {loading ? 'Подписываем...' : 'Подписать сообщение'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}; 