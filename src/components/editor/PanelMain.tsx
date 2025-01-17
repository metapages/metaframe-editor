import { useCallback, useEffect, useRef, useState } from "react";

import { useOptions } from "/@/components/options/useOptions";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { HiOutlineSave } from "react-icons/hi";

import { Box, Button, HStack, Spacer, Tooltip, VStack } from "@chakra-ui/react";
import { useHashParamBase64 } from "@metapages/hash-query/react-hooks";
import { useMetaframeAndInput } from "@metapages/metapage-react";
import { MetaframeInputMap } from "@metapages/metapage";

import { MetaframeEditor } from "./MetaframeEditor";
import { dataRefToFile, isDataRef } from "@metapages/dataref";

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC<{ height?: string }> = ({ height }) => {
  const metaframe = useMetaframeAndInput();
  const valueName = useRef<string>("text");
  const lastValue = useRef<string>("");
  const initialValue = useRef<string | undefined>();
  const [options] = useOptions();

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

  const sendOutputs = useCallback(
    (value: string | null) => {
      if (metaframe?.setOutputs) {
        const newOutputs: MetaframeInputMap = {};
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

  const setValue = useCallback(
    async (value: any | undefined) => {
      // no non-string values sent
      if (value === null || value === undefined) {
        return;
      }

      // check needed conversions
      const isRef = isDataRef(value);
      if (isRef) {
        const blob: File = await dataRefToFile(value);
        value = await blob.text();
      } else if (typeof value !== "string") {
        // assume it's JSON
        if (value instanceof Blob) {
          value = await (value as Blob).text();
        } else {
          value = JSON.stringify(value, null, 2);
        }
      }

      // update the editor definitely
      setLocalValue(value);
      // but sending further is logic
      if (options?.autosend) {
        if (metaframe?.setOutputs) {
          const newOutputs: MetaframeInputMap = { text: value };
          if (
            options?.mode === "json" &&
            (value.trim().startsWith("{") || value.trim().startsWith("["))
          ) {
            try {
              newOutputs.text = JSON.parse(value || "");
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
    [options, metaframe]
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

    // we initialize this as "text", but if another key is passed it will be used here
    valueName.current = inputKeys[0];
    if (metaframe.inputs[valueName.current]) {
      const newValue = metaframe.inputs[valueName.current];
      // Consumers of the metaframe will likely set the value after
      // getting an update, so don't update here if it's the same value
      if (lastValue.current !== newValue) {
        lastValue.current = newValue;
        setValue(newValue);
      }
    }
  }, [metaframe.inputs, lastValue.current, valueName]);

  useEffect(() => {
    // this should set the value only once so it doesn't clobber local state
    if (!!localValue && options?.blockLocalEditorStateOverwrites) return;

    const inputs = metaframe?.metaframe?.getInputs();
    if (!inputs) {
      return;
    }

    setValue(inputs[valueName.current]);
  }, [metaframe?.metaframe]);
  /**
   * end: state management for the text
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
      setLocalValue(valueHashParam);
    }

    sendOutputs(valueHashParam);
  }, [sendOutputs, valueHashParam, initialValue, options?.saveloadinhash]);

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
    <Box
      id="panel-main"
      w="100%"
      h={height || "100%"}
      maxH="100%"
      overflow="clip"
    >
      <VStack
        id="vbox-main"
        spacing={0}
        align="stretch"
        w="100%"
        h="100%"
        maxH="100%"
        p={0}
      >
        {options?.autosend || options?.readOnly ? null : (
          <HStack align="end" p={2}>
            <Tooltip
              label={
                options?.saveloadinhash
                  ? "Save in URL hash"
                  : "Send to connected metaframes"
              }
            >
              <Button
                onClick={onSave}
                variant="outline"
                leftIcon={<HiOutlineSave />}
              >
                Save
              </Button>
            </Tooltip>
          </HStack>
        )}

        <MetaframeEditor
          mode={options?.mode || "json"}
          theme={options?.theme || "light"}
          setValue={setValue}
          value={localValue}
          readOnly={options?.readOnly}
        />
      </VStack>
    </Box>
  );
};
