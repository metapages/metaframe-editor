/**
 * Simple:
 *  - any input sets
 *    - the content to the editor
 *    - the name to the input name
 *    - the save button is deactivated
 *  The save button sends the editor content to the same input name
 */

import { FunctionalComponent } from "preact";
import { useEffect, useState, useCallback, useRef } from "preact/hooks";
import { Box, Button, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useMetaframeAndInput } from "@metapages/metaframe-hook";
import { useHashParamJson, useHashParamBase64 } from "@metapages/hash-query";
import { isIframe } from "@metapages/metapage";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { Editor } from "./components/Editor";
import { Option, OptionsMenuButton } from "./components/OptionsMenu";
import { ButtonHelp } from "./components/ButtonHelp";

const appOptions: Option[] = [
  {
    name: "mode",
    displayName: "Editor code mode",
    default: "json",
    type: "option",
    options: ["json", "javascript", "python", "sh"],
  },
  {
    name: "autosend",
    displayName: "Send metaframe output automatically on every edit",
    default: false,
    type: "boolean",
  },
  {
    name: "saveloadinhash",
    displayName: "Save and load content in the URL hash",
    default: false,
    type: "boolean",
  },
  {
    name: "theme",
    displayName: "Light/Dark theme",
    default: "light",
    type: "option",
    options: ["light", "vs-dark"],
  },
  {
    name: "hidemenuififrame",
    displayName: "Hide menu if in iframe",
    default: false,
    type: "boolean",
  },
];

type OptionBlob = {
  mode: string;
  autosend: boolean;
  hidemenuififrame: boolean;
  saveloadinhash: boolean;
  theme: string;
};

export const App: FunctionalComponent = () => {
  const metaframe = useMetaframeAndInput();
  const [nameHashparam, setNameHashparam] = useHashParamBase64("name", "value");
  const [name, setName] = useState<string>("value");
  const lastValue = useRef<string>("");
  const initialValue = useRef<string | undefined>();
  const [options] = useHashParamJson<OptionBlob>("options", {
    mode: "json",
    theme: "light",
    hidemenuififrame: false,
    saveloadinhash: false,
    autosend: false,
  });

  // Split these next two otherwise editing is too slow as it copies to/from the URL
  const [valueHashParam, setValueHashParam] = useHashParamBase64(
    "text",
    undefined
  );
  const setValueHashParamDebounced = useCallback(
    AwesomeDebouncePromise((value: string) => {
      setValueHashParam(value);
    }, 500),
    [setValueHashParam]
  );
  // Use a local copy because directly using hash params is too slow for typing
  const [localValue, setLocalValue] = useState<string | undefined>(
    valueHashParam
  );

  const setValue = useCallback(
    (value: string | undefined) => {
      // no non-string values sent
      if (value === null || value === undefined) {
        return;
      }
      // update the editor definitely
      setLocalValue(value);
      // but sending further is logic
      if (options?.autosend && metaframe?.setOutputs) {
        const newOutputs: any = maybeConvertJsonValues(name, value);
        metaframe?.metaframe?.setOutputs(newOutputs);
      }
      if (options?.saveloadinhash) {
        setValueHashParamDebounced(value);
      }
    },
    [setLocalValue, name, options, metaframe, setValueHashParamDebounced]
  );

  /**
   * state management for the text name
   */
  // update name in hash param when it changes
  useEffect(() => {
    if (options?.saveloadinhash) {
      setNameHashparam(name);
    }
  }, [name, setNameHashparam, options?.saveloadinhash]);

  // update name in hash param when it changes
  useEffect(() => {
    if (options?.saveloadinhash && nameHashparam) {
      setName(nameHashparam);
    }
  }, [nameHashparam, setName, options?.saveloadinhash]);
  // listen to metaframe inputs
  useEffect(() => {
    const key = Object.keys(metaframe?.inputs)[0];
    if (key) {
      const newValue =
        typeof metaframe.inputs[key] === "string"
          ? metaframe.inputs[key]
          : JSON.stringify(metaframe.inputs[key], null, "  ");

      // Consumers of the metaframe will likely set the value after
      // getting an update, so don't update here if it's the same value
      if (lastValue.current !== newValue) {
        lastValue.current = newValue;
        setValue(newValue);
        setName(key);
      }
    }
  }, [metaframe.inputs, setValue, setName, lastValue.current]);
  /**
   * end: state management for the text name
   */

  // once source of truth: the URL param #?text=<HashParamBase64>
  // if that changes, set the local value
  // the local value changes fast from editing
  useEffect(() => {
    // This value never changes once set
    if (valueHashParam === undefined) {
      return;
    }

    if (initialValue.current === undefined) {
      initialValue.current = valueHashParam;
    }
    if (options?.saveloadinhash) {
      setLocalValue(valueHashParam);
    }
  }, [valueHashParam, setLocalValue, initialValue, options?.saveloadinhash]);

  const onSave = useCallback(() => {
    if (localValue === null || localValue === undefined) {
      return;
    }
    if (options?.saveloadinhash) {
      setValueHashParamDebounced(localValue);
    }
    if (metaframe.setOutputs) {
      const newOutputs: any = maybeConvertJsonValues(name, localValue);
      metaframe.setOutputs(newOutputs);
    }
  }, [
    metaframe.setOutputs,
    localValue,
    setValueHashParamDebounced,
    options?.saveloadinhash,
    name,
  ]);

  return (
    <Box w="100%" p={2}>
      <VStack spacing={2} align="stretch">
        {options?.hidemenuififrame && isIframe() ? null : (
          <Flex alignItems="center">
            <HStack>
              <OptionsMenuButton options={appOptions} />
              <ButtonHelp />
            </HStack>

            <Spacer />

            <Button colorScheme="blue" onClick={onSave}>
              Save
            </Button>
          </Flex>
        )}

        <Editor
          mode={options?.mode || "json"}
          theme={options?.theme || "light"}
          setValue={setValue}
          value={localValue}
        />
      </VStack>
    </Box>
  );
};

const maybeConvertJsonValues = (name: string, text: string) => {
  const newOutputs: any = {};
  if (name.endsWith(".json")) {
    try {
      newOutputs[name] = JSON.parse(text || "");
    } catch (err) {
      newOutputs[name] = text;
    }
  } else {
    newOutputs[name] = text;
  }
  return newOutputs;
};
