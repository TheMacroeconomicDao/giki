"use client"

import { createContext, useContext, type MutableRefObject } from "react"

interface EditorContextType {
  value: string
  setValue: (value: string) => void
  editorRef: MutableRefObject<any>
  handleUndo: () => void
  handleRedo: () => void
  placeholder: string
  readOnly: boolean
  canUndo: boolean
  canRedo: boolean
}

export const EditorContext = createContext<EditorContextType>({
  value: "",
  setValue: () => {},
  editorRef: { current: null },
  handleUndo: () => {},
  handleRedo: () => {},
  placeholder: "",
  readOnly: false,
  canUndo: false,
  canRedo: false,
})

export const useEditorContext = () => useContext(EditorContext)
