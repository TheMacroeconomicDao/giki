"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, ChevronDown, Loader2, ExternalLink, Copy, Check } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { formatAddress, getEtherscanLink } from "@/lib/wallet-utils"
import { toast } from "@/components/ui/use-toast"
import { UserRoleBadge } from "@/components/user-role-badge"

export function WalletConnectButton() {
  const { wallet, isConnected, connectWallet, disconnectWallet, isMetaMaskInstalled } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await connectWallet()
    } catch (err) {
      console.error("Connection failed:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  const copyToClipboard = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isConnected && wallet.address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
          >
            <Wallet className="h-4 w-4" />
            {formatAddress(wallet.address)}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <span>Connected Wallet</span>
              <span className="text-xs text-muted-foreground">MetaMask</span>
              <UserRoleBadge />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy address"}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2" asChild>
            <a href={getEtherscanLink(wallet.address)} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View on Etherscan
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-red-500" onClick={disconnectWallet}>
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleConnect}
      disabled={isConnecting || !isMetaMaskInstalled}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          {isMetaMaskInstalled ? "Connect Wallet" : "MetaMask Not Installed"}
        </>
      )}
    </Button>
  )
}
