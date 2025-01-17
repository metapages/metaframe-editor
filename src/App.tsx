import '/@/app.css';

import { useState } from 'react';

import { PanelMain } from '/@/components/editor/PanelMain';
import { PanelHelp } from '/@/components/help/PanelHelp';
import { FiSettings } from 'react-icons/fi';

import {
  CopyIcon,
  EditIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import {
  Box,
  HStack,
  IconButton,
  Show,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  useHashParam,
} from '@metapages/hash-query/react-hooks';

import {
  ButtonTabsToggle,
} from './components/options/components/ButtonTabsToggle';
import { PanelOptions } from './components/options/PanelOptions';
import { isIframe } from '@metapages/metapage';

const isFramed = isIframe();

export const App: React.FC = () => {
  const [menuhidden, setMenuHidden] = useState<boolean>(isFramed);
  const [mode] = useHashParam("hm", undefined);
  const [tab, setTab] = useState<number>(0);
  const toast = useToast();

  if (menuhidden) {

    if (mode === undefined || mode === "visible" || mode === "invisible") {

      return (
        <>
          <HStack
            style={{ position: "absolute" }}
            width="100%"
            justifyContent="flex-start"
            zIndex={1000}
          >
            <Spacer />
            <Show breakpoint="(min-width: 200px)">
              <ButtonTabsToggle menuhidden={menuhidden} setMenuHidden={setMenuHidden} mode={mode} />
            </Show>
          </HStack>
          <PanelMain height="100vh" />
        </>
      );
    } else if (mode === "disabled") {
      return <PanelMain height="100vh" />;
    }
  }
  return (
    <VStack align="flex-start" w="100%" h="100vh">
      <Tabs index={tab || 0} isLazy={true} onChange={setTab} w="100%" h="100%">
        <TabList>
          <Tab>
            <Tooltip label="View editor">
              <HStack spacing="0px">
                <EditIcon />
                <Box>&nbsp; Editor</Box>
              </HStack>
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip label="Customize page">
              <HStack spacing="0px">
                <FiSettings />
                <Box>&nbsp; Options</Box>
              </HStack>
            </Tooltip>
          </Tab>

          <Tab>
            <Tooltip label="Documentation">
              <HStack spacing="0px">
                <InfoIcon />
                <Box>&nbsp; Help</Box>
              </HStack>
            </Tooltip>
          </Tab>
          <Tooltip label="Copy URL to clipboard">
            <IconButton
              aria-label="copy url"
              variant="ghost"
              icon={<CopyIcon />}
              onClick={() => {
                window.navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Copied URL to clipboard",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            />
          </Tooltip>
          <Spacer />
          <ButtonTabsToggle menuhidden={menuhidden} setMenuHidden={setMenuHidden} mode={mode} />
        </TabList>

        <TabPanels>
          <TabPanel p={0} h="calc(100vh - 3rem)">
            <PanelMain />
          </TabPanel>

          <TabPanel>
            <PanelOptions />
          </TabPanel>

          <TabPanel>
            <PanelHelp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
