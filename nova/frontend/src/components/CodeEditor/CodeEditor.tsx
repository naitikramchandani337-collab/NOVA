// src/components/CodeEditor/CodeEditor.tsx
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  defaultValue: string;
  language?: string;
  height?: string;
  onChange?: (value: string) => void;
}

export default function CodeEditor({
  defaultValue,
  language = 'python',
  height = '280px',
  onChange,
}: CodeEditorProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (val: string | undefined) => {
    const newVal = val ?? '';
    setValue(newVal);
    onChange?.(newVal);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl overflow-hidden border border-gray-700 bg-[#1e1e1e]"
    >
      {/* Editor toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-gray-400 ml-2 font-mono">script.py</span>
      </div>

      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          padding: { top: 12, bottom: 12 },
          wordWrap: 'on',
          automaticLayout: true,
          tabSize: 4,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </motion.div>
  );
}
