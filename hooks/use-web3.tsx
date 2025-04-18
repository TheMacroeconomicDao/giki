"use client"

import { Web3Context } from "@/components/web3-provider"
import { useContext } from "react"

export function useWeb3() {
  return useContext(Web3Context)
}
