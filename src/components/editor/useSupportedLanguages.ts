import {
  useCallback,
  useEffect,
  useState,
} from 'react';

// import { useMonaco } from '@monaco-editor/react';
import { OnMount } from '@monaco-editor/react';


export const useSupportedLanguages = (): [string[], OnMount] => {
  const [currentLanguages, setCurrentLanguages] = useState<string[]>([]);
  // const monaco = useMonaco();

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    const newLanguages: string[] = monaco.languages
      .getLanguages()
      .reduce((languageList: any, blob: any) => {
        languageList.push(blob.id);
        return languageList;
      }, [] as string[]);
    setCurrentLanguages(newLanguages);
  }, []);

  // useEffect(() => {
  //   const newLanguages: string[] = monaco?.languages
  //     .getLanguages()
  //     .reduce((languageList: any, blob: any) => {
  //       languageList.push(blob.id);
  //       return languageList;
  //     }, [] as string[]);
  //   setCurrentLanguages(newLanguages);
  // }, [monaco]);

  return [currentLanguages, handleEditorDidMount];
};
