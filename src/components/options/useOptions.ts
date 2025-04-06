import { useHashParamJson } from "@metapages/hash-query/react-hooks";
import { useEffect } from "react";
// import { useSupportedLanguages } from '../editor/useSupportedLanguages';
import { extensionMap } from "/@/constants/extensionToLanguage";
import { SupportedLanguages } from "../editor/MetaframeEditor";

export type Theme = "light" | "vs-dark";

export type Options = {
  mode?: string | undefined;
  autosend?: boolean;
  saveloadinhash?: boolean;
  theme?: Theme | undefined;
  readOnly?: boolean;
  blockLocalEditorStateOverwrites?: boolean;
  hideLineNumbers?: boolean;
};

const HashKeyOptions = "options";

export const useOptions = (
  defaultOptions?: Options | undefined
): [Options, (o: Options) => void] => {
  const [options, setOptions] = useHashParamJson<Options>(
    HashKeyOptions,
    defaultOptions
  );
  const languages = SupportedLanguages.languages;

  useEffect(() => {
    if (languages?.length && options?.mode) {
      if (languages.indexOf(options.mode) === -1) {
        if (extensionMap[options.mode]) {
          setOptions({ ...options, mode: extensionMap[options.mode][0] });
        }
      }
    }
  }, [options?.mode, languages]);
  return [options || defaultOptions || EmptyOptions, setOptions];
};

const EmptyOptions: Options = {};
