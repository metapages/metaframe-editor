import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useOptions } from '/@/components/options/useOptions';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { HiOutlineSave } from 'react-icons/hi';

import {
  Box,
  Button,
  Flex,
  Spacer,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useHashParamBase64 } from '@metapages/hash-query';
import { useMetaframeAndInput } from '@metapages/metaframe-hook';
import { MetaframeInputMap } from '@metapages/metapage';

import { Editor } from './Editor';

const encodeMarkdown = (md: string) => {
  var b64 = window.btoa(encodeURIComponent(md));
  return b64;
};

/**
 * Just an example very basic output of incoming inputs
 *
 */
export const PanelMain: React.FC = () => {
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

  useEffect(() => {
    const inputs = metaframe?.metaframe?.getInputs();

    if (!inputs) {
      return;
    }
    Object.keys(inputs).forEach((key) => {
      setValue(inputs[key]);
    });
  }, [metaframe?.metaframe, setValue]);
  /**
   * end: state management for the text
   */

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

  // once source of truth: the URL param #?text=<HashParamBase64>
  // if that changes, set the local value
  // the local value changes fast from editing
  useEffect(() => {
    // This value never changes once set
    // console.log(`valueHashParam (${typeof(valueHashParam)}):`, valueHashParam);
    if (valueHashParam === undefined) {
      return;
    }

    if (initialValue.current === undefined) {
      initialValue.current = valueHashParam;
      setLocalValue(valueHashParam);
    }
    // if (options?.saveloadinhash && valueHashParam) {
    //   setLocalValue(valueHashParam);
    // }
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
        <Flex alignItems="center">
          {options?.autosend || options?.readOnly ? null : (
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
          )}
        </Flex>
        <Spacer />

        <Editor
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
