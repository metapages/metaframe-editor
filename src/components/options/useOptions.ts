import { useHashParamJson } from '@metapages/hash-query';
import { useEffect } from 'react';
import { useSupportedLanguages } from '../editor/useSupportedLanguages';
import { extensionMap } from '/@/constants/extensionToLanguage';

export type Theme = "light" | "vs-dark";

export type Options = {
  mode?: string | undefined;
  autosend?: boolean;
  saveloadinhash?: boolean;
  theme?: Theme | undefined;
  readOnly?: boolean;
  blockLocalEditorStateOverwrites?: boolean;
};

const HashKeyOptions = "options";

export const useOptions = (defaultOptions?:Options|undefined): [Options, (o: Options) => void] => {
  const [options, setOptions] = useHashParamJson<Options>(HashKeyOptions, defaultOptions);
  const languages = useSupportedLanguages();

  useEffect(() => {
    if (languages?.length && options?.mode) {
      if (languages.indexOf(options.mode) === -1) {
        if (extensionMap[options.mode]) {
          setOptions({...options, mode: extensionMap[options.mode][0]})
        }
      }
    }
  }, [options?.mode, languages])
  return [options, setOptions];
};