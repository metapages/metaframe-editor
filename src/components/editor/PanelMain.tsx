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
  HStack,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useHashParamBase64 } from '@metapages/hash-query';
import { useMetaframeAndInput } from '@metapages/metaframe-hook';
import { MetaframeInputMap, Metapage } from '@metapages/metapage';

import { MetapageEditor } from './MetapageEditor';


const createdByText = (createdData: string): string => {
  try {
    const data = JSON.parse(createdData);
    const author : string = data.user ? ` by ${data.user}` : ''
    return `Created at ${data.createdAt}${author}`
  } catch (err) {
    return ''
  }

}
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
  const [saveStateMessage, setSaveStateMessage] = useState<string>('')
  const [lastChangedText, setLastChangedText] = useState<string>('')
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
      // if there's a change, show a message indicating unsaved modifications
      if (localValue !== value) {
        setSaveStateMessage('current version has unsaved changes')
      } else {
        setSaveStateMessage('');
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
    // metadata that shows the created at and by is passed to this component, and we want
    // to make sure those values don't end up being written to the editor.
    // That data is found under inputKeys.createdData
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

      if (metaframe.inputs.createdData) {
        setLastChangedText(createdByText(metaframe.inputs.createdData))
      }
    }
  }, [metaframe.inputs, lastValue.current, valueName]);

  useEffect(() => {
    // this should set the value only once so it doesn't clobber local state
    if (!!localValue) return;

    const inputs = metaframe?.metaframe?.getInputs();
    if (!inputs) {
      return;
    }

    if (inputs[valueName.current]) {
      setValue(inputs[valueName.current]);
    }
  }, [metaframe?.metaframe]);
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
        setSaveStateMessage('');
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
      setLocalValue(valueHashParam);
    }

    sendOutputs(valueHashParam);
  }, [
    valueHashParam,
    initialValue,
    options?.saveloadinhash,
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
        <HStack align="end">
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
          <Text fontSize='xs' color="gray.400">{lastChangedText}</Text>
          <Text fontSize='xs' color="red">{saveStateMessage}</Text>
        </HStack>
        <Spacer />

        <MetapageEditor
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
