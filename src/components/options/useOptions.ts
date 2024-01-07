import { useHashParamJson } from '@metapages/hash-query';

export type Theme = "light" | "vs-dark";

export type Options = {
  mode?: string | undefined;
  autosend?: boolean;
  saveloadinhash?: boolean;
  theme?: Theme | undefined;
  readOnly?: boolean;
};

const HashKeyOptions = "options";

export const useOptions = (defaultOptions?:Options|undefined): [Options, (o: Options) => void] => {
  const [options, setOptions] = useHashParamJson<Options>(HashKeyOptions, defaultOptions);
  return [options, setOptions];
};
