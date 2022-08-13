/**
 * Simple:
 *  - any input sets
 *    - the content to the editor
 *    - the save button is deactivated
 *  The save button sends the editor content to the same input pipe "value"
 */

import { FunctionalComponent } from "preact";
import { useEffect, useState, useCallback, useRef } from "preact/hooks";
import { Box, Button, Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useMetaframeAndInput } from "@metapages/metaframe-hook";
import { useHashParamJson, useHashParamBase64 } from "@metapages/hash-query";
import { isIframe, MetaframeInputMap } from "@metapages/metapage";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { Editor } from "./components/Editor";
import { Option, ButtonOptionsMenu } from "./components/ButtonOptionsMenu";
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
    displayName: "Update automatically on every edit",
    default: false,
    type: "boolean",
  },
  {
    name: "saveloadinhash",
    displayName: "Persist text in URL hash",
    default: true,
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
  const valueName = useRef<string>("value");
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
      if (options?.autosend) {
        if (metaframe?.setOutputs) {
          const newOutputs: MetaframeInputMap = { value };
          if (
            options?.mode === "json" &&
            (value.trim().startsWith("{") || value.trim().startsWith("["))
          ) {
            try {
              newOutputs.value = JSON.parse(value || "");
            } catch (err) {
              // swallow json parsing errors
            }
          }
          metaframe?.metaframe?.setOutputs(newOutputs);
        }
        if (options?.saveloadinhash) {
          setValueHashParamDebounced(value);
        }
      }
    },
    [setLocalValue, options, metaframe, setValueHashParamDebounced]
  );

  /**
   * state management for the text
   */

  // listen to metaframe inputs
  useEffect(() => {
    if (!metaframe?.inputs) {
      return;
    }
    const inputKeys = Object.keys(metaframe.inputs);
    if (inputKeys.length === 0) {
      return;
    }
    valueName.current = inputKeys[0];
    if (metaframe.inputs[valueName.current]) {
      const newValue =
        typeof metaframe.inputs[valueName.current] === "string"
          ? metaframe.inputs[valueName.current]
          : JSON.stringify(metaframe.inputs[valueName.current], null, "  ");

      // Consumers of the metaframe will likely set the value after
      // getting an update, so don't update here if it's the same value
      if (lastValue.current !== newValue) {
        lastValue.current = newValue;
        setValue(newValue);
      }
    }
  }, [metaframe.inputs, setValue, lastValue.current, valueName]);
  /**
   * end: state management for the text
   */

  const sendOutputs = useCallback(
    (value: string | null) => {
      if (metaframe?.setOutputs) {
        const newOutputs: MetaframeInputMap = { };
        newOutputs[valueName.current] = value;
        if (
          value &&
          options?.mode === "json" &&
          (value.trim().startsWith("{") || value.trim().startsWith("["))
        ) {
          try {
            newOutputs[valueName.current] = JSON.parse(value || "");
          } catch (err) {
            // swallow json parsing errors
          }
        }
        metaframe.setOutputs(newOutputs);
      }
    },
    [metaframe, valueName]
  );

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
    sendOutputs(valueHashParam);
  }, [
    valueHashParam,
    setLocalValue,
    initialValue,
    options?.saveloadinhash,
    sendOutputs,
  ]);

  const onSave = useCallback(() => {
    if (localValue === null || localValue === undefined) {
      return;
    }
    if (options?.saveloadinhash) {
      setValueHashParamDebounced(localValue);
    } else {
      // Updating the value in the hash param triggers a sendOutputs
      // call so only do this here if we are NOT updating via setValueHashParam
      sendOutputs(localValue);
    }
  }, [
    metaframe.setOutputs,
    localValue,
    setValueHashParamDebounced,
    options?.saveloadinhash,
    sendOutputs,
  ]);

  return (
    <Box w="100%" p={2}>
      <VStack spacing={2} align="stretch">
        {options?.hidemenuififrame && isIframe() ? null : (
          <Flex alignItems="center">
            <HStack>
              <ButtonOptionsMenu options={appOptions} />
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
