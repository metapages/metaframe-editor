import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import { MetaframeAndInputsContext } from "@metapages/metaframe-hook";
import { Badge } from "@chakra-ui/react";

export const MetaframeOutputsRaw: FunctionalComponent = () => {
  const metaframe = useContext(MetaframeAndInputsContext);
  return (
    <div>
      <Badge>metaframe inputs:</Badge>{" "}
      {metaframe ? JSON.stringify(metaframe.inputs) : "none yet"}
    </div>
  );
};
