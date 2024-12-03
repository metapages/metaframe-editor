import { useCallback } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
  VStack,
} from '@chakra-ui/react';

// import { useSupportedLanguages } from '../editor/useSupportedLanguages';
import { RadioButtonMode } from './components/RadioButtonMode';
import {
  Options,
  Theme,
  useOptions,
} from './useOptions';
import { SupportedLanguages } from '../editor/MetaframeEditor';

export const defaultOptions: Options = {
  mode: "json",
  saveloadinhash: true,
  theme: "light",
};

const OptionDescription: Record<string, string> = {
  mode: "Editor code mode",
  autosend: "On=Autoupdate / Off=shows a save button",
  saveloadinhash: "Persist text in URL hash",
  theme: "Light/Dark theme",
  readOnly: "Readonly",
  blockLocalEditorStateOverwrites: "Block updates the overwrite the editor's local state"
};

const validationSchema = yup.object({
  mode: yup.string().notRequired().optional(),
  theme: yup
    .string()
    .notRequired()
    .oneOf(["light", "vs-dark"] as Theme[])
    .optional(),
  autosend: yup.boolean().notRequired(),
  saveloadinhash: yup.boolean().notRequired(),
  readOnly: yup.boolean().notRequired(),
  blockLocalEditorStateOverwrites: yup.boolean().notRequired(),
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const PanelOptions: React.FC = () => {
  const [options, setOptions] = useOptions(defaultOptions);
  // const languages = useSupportedLanguages();

  const onSubmit = useCallback(
    (values: FormType) => {
      let newOptions: Options | undefined = { ...(values as Options) };
      if (!newOptions.saveloadinhash) {
        delete newOptions.saveloadinhash;
      }
      if (!newOptions.autosend) {
        delete newOptions.autosend;
      }
      if (!newOptions.readOnly) {
        delete newOptions.readOnly;
      }
      if (!newOptions.blockLocalEditorStateOverwrites) {
        delete newOptions.blockLocalEditorStateOverwrites;
      }
      if (newOptions.theme === defaultOptions.theme) {
        delete newOptions.theme;
      }
      if (newOptions.mode === "json") {
        delete newOptions.mode;
      }
      setOptions(newOptions);
    },
    [setOptions]
  );

  const formik = useFormik({
    initialValues: options,
    onSubmit,
    validationSchema,
  });

  return (
    <VStack
      maxW="700px"
      gap="1rem"
      justifyContent="flex-start"
      alignItems="stretch"
    >
      <RadioButtonMode />

      <form onSubmit={formik.handleSubmit}>
        <FormControl pb="1rem">
          <FormLabel fontWeight="bold">{OptionDescription["mode"]}</FormLabel>
          <Select
            minH="38px"
            mr={2}
            name="mode"
            // onChange={formik.handleChange}
            onChange={(e) => {
              // currently Select needs this to work
              formik.setFieldValue("mode", e.currentTarget.value);
              formik.handleSubmit();
            }}
            // placeholder="Select axis"
            size="sm"
            value={formik.values.mode || defaultOptions.mode}
            variant="outline"
          >
            {SupportedLanguages.languages.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl pb="1rem">
          <FormLabel fontWeight="bold">{OptionDescription["theme"]}</FormLabel>
          <RadioGroup
            id="theme"
            onChange={(e) => {
              // currently RadioGroup needs this to work
              formik.setFieldValue("theme", e);
              formik.handleSubmit();
            }}
            value={formik.values.theme || defaultOptions.theme}
          >
            <Stack
              pl="30px"
              pr="30px"
              spacing={5}
              direction="column"
              borderWidth="1px"
              borderRadius="lg"
            >
              <Radio value="light" defaultChecked>
                light
              </Radio>
              <Radio value="vs-dark">dark</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {Object.keys(validationSchema.fields as any)
          .filter(
            (fieldName) =>
              (validationSchema.fields as any)[fieldName].type === "boolean"
          )
          .map((fieldName) => (
            <FormControl pb="1rem" key={fieldName}>
              <FormLabel fontWeight="bold" htmlFor={fieldName}>
                {OptionDescription[fieldName]}
              </FormLabel>
              <Checkbox
                name={fieldName}
                size="lg"
                bg="gray.100"
                spacing="1rem"
                onChange={(e) => {
                  // currently checkbox needs this to work
                  formik.setFieldValue(fieldName, e.target.checked);
                  formik.handleSubmit();
                }}
                isChecked={(formik.values as any)[fieldName]}
              />
            </FormControl>
          ))}

        <Button type="submit" display="none">
          submit
        </Button>
      </form>
    </VStack>
  );
};
