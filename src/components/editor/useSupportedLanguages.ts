import {
  useEffect,
  useState,
} from 'react';

import { useMonaco } from '@monaco-editor/react';

export const useSupportedLanguages = (): string[] => {
  const [currentLanguages, setCurrentLanguages] = useState<string[]>([]);
  const monaco = useMonaco();

  useEffect(() => {
    const newLanguages: string[] = monaco?.languages
      .getLanguages()
      .reduce((languageList: any, blob: any) => {
        languageList.push(blob.id);
        return languageList;
      }, [] as string[]);
    setCurrentLanguages(newLanguages);
  }, [monaco]);

  return currentLanguages;
};
