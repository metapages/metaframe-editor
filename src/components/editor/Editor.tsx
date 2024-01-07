import MonacoEditor from '@monaco-editor/react';

export type EditorProps = {
  mode: string;
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  theme: string;
  readOnly?: boolean;
};

export const Editor: React.FC<EditorProps> = ({
  mode,
  value,
  setValue,
  theme,
  readOnly,
}) => {
  return (
    <MonacoEditor
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
};
