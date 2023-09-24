import {
  useEffect,
  useState,
} from 'react';

import { Box } from '@chakra-ui/react';

import { useSupportedLanguages } from '../editor/useSupportedLanguages';

// Not used yet, but here as a reference
const encodeMarkdown = (md: string) => {
  var b64 = window.btoa(encodeURIComponent(md));
  return b64;
};

export const PanelHelp: React.FC = () => {
  const languages = useSupportedLanguages();
  const [downloadedMarkdown, setDownloadedMarkdown] = useState<
    string | undefined
  >();
  const [finalMarkdown, setFinalMarkdown] = useState<string | undefined>();

  // Get the original help markdown content locally
  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${window.location.origin}${window.location.pathname}/README.md`
      );
      const movies = await response.text();
      setDownloadedMarkdown(movies);
    })();
  }, []);

  // Append the list of supported languages at the end of the README.md
  useEffect(() => {
    if (languages && downloadedMarkdown) {
      const updatedMarkdown =
        downloadedMarkdown +
        "\n\n### Supported Languages\n\n" +
        languages.map((l) => `  - \`${l}\``).join("\n");
      const encodedMarkdown = encodeMarkdown(updatedMarkdown);
      setFinalMarkdown(encodedMarkdown);
    }
  }, [downloadedMarkdown, languages]);

  const src = finalMarkdown
    ? `https://markdown.mtfm.io/#?button=hidden&menuhidden=true&tab=1&md=${finalMarkdown}`
    : `https://markdown.mtfm.io/#?button=hidden&menuhidden=true&tab=1&url=${window.location.origin}${window.location.pathname}/README.md`;

  return (
    <Box className="iframe-container">
      <iframe
        className="iframe"
        // In this case only, we are used to display our own help
        src={src}
      />
    </Box>
  );
};
