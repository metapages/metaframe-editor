import {
  useEffect,
  useState,
} from 'react';

import { languages } from 'monaco-editor';

export const useSupportedLanguages = (): string[] => {
  const [currentLanguages, setCurrentLanguages] = useState<string[]>([]);
  // Get the supported
  useEffect(() => {
    const newLanguages: string[] = languages
      .getLanguages()
      .reduce((languageList, blob) => {
        // console.log('blob', blob);
        languageList.push(blob.id);
        // blob?.aliases?.forEach((a) => languageList.push(a));
        return languageList;
      }, [] as string[]);
    setCurrentLanguages(newLanguages);
  }, []);

  return currentLanguages;
};
