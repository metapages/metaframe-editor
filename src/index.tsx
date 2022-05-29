import { render } from "preact";
import { WithMetaframeAndInputs } from "@metapages/metaframe-hook";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App";

render(
  <ChakraProvider>
    <WithMetaframeAndInputs>
      <App />
    </WithMetaframeAndInputs>
  </ChakraProvider>,
  document.getElementById("root")!
);
