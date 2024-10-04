import Editor from '@monaco-editor/react';

export type EditorProps = {
  mode: string;
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  theme: string;
  readOnly?: boolean;
};

export const MetaframeEditor: React.FC<EditorProps> = ({
  mode,
  value,
  setValue,
  theme,
  readOnly,
}) => {
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

  return (
    <Editor
      beforeMount={setEditorTheme}
      defaultLanguage={mode}
      theme={theme}
      options={{
        minimap: { enabled: false },
        readOnly,
      }}
      onChange={setValue}
      value={value}
      width="100%"
      height="90vh"
    />
  );
}