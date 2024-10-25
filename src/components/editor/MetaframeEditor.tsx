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

  // TODO: pull content height from mf chakra theme so we
  // don't have to use 3rem as a magic number
  return (
    <Editor
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
      height="calc(100vh - 3rem)"
    />
  );
}