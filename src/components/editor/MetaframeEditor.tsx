import Editor from '@monaco-editor/react';
import { useSupportedLanguages } from './useSupportedLanguages';
import { useEffect } from 'react';

export type EditorProps = {
  mode: string;
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  theme: string;
  readOnly?: boolean;
};

export const SupportedLanguages: {languages: string[]} = {languages: []};

export const MetaframeEditor: React.FC<EditorProps> = ({
  mode,
  value,
  setValue,
  theme,
  readOnly,
}) => {
  const [languages, onMount] = useSupportedLanguages();
  useEffect(() => {
    if (languages) {
      SupportedLanguages.languages = languages;
    }
  }, [languages]);
  const setEditorTheme = (monaco: any) => {
    monaco.editor.defineTheme('mf-default', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
          'editor.background': '#f8f8f8',
      },
      fontFamily: `'JetBrains Mono Variable', monospace`,
    });
    monaco.theme = theme
  }

  // TODO: pull content height from mf chakra theme so we
  // don't have to use 3rem as a magic number
  return (
    <Editor
      onMount={onMount}
      beforeMount={setEditorTheme}
      language={mode}
      theme={theme}
      options={{
        minimap: { enabled: false },
        readOnly,
      }}
      onChange={setValue}
      value={value}
      width="100%"
      // height="calc(100vh - 3rem)"
      height="100%"
    />
  );
}