"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useEditorContext } from "./editor-context"
import CodeMirror from "@uiw/react-codemirror"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { EditorView } from "@codemirror/view"
import { useTheme } from "next-themes"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { githubLight } from "@uiw/codemirror-theme-github"

interface EditorProps {
  style?: CSSProperties
  autoFocus?: boolean
}

export default function Editor({ style, autoFocus = false }: EditorProps) {
  const { theme } = useTheme()
  const { value, setValue, editorRef, placeholder, readOnly } = useEditorContext()
  const skipSyncRef = useRef(false)

  // Set editor reference
  useEffect(() => {
    if (editorRef.current === null) {
      editorRef.current = {}
    }
  }, [editorRef])

  const handleChange = (value: string) => {
    skipSyncRef.current = true
    setValue(value)
  }

  return (
    <div className="w-full overflow-hidden" style={style}>
      <CodeMirror
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          EditorView.placeholder(placeholder),
        ]}
        theme={theme === "dark" ? vscodeDark : githubLight}
        readOnly={readOnly}
      />
    </div>
  )
}
