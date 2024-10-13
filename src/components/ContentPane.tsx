import AbstractWindow from '@/components/abstract/AbstractWindow';
import { GlobalContext } from '@/components/App';
import CanvasContainer from '@/components/CanvasContainer';
import FileExplorer, { FileType } from '@/explorers/FileExplorer';
import { createContextProvider } from '@/utils/ContextProvider';
import '@vscode/codicons/dist/codicon.css';
import { useContext, useEffect, useRef, useState } from 'react';
import * as styles from './ContentPane.module.scss';
import Pallete from '@/components/Pallete';

/* --- Context Start --- */
interface LocalContextType {
  selectedSidebarMenuItem: [string, React.Dispatch<React.SetStateAction<string>>];
}

const [LocalContext, LocalContextProvider] = createContextProvider<LocalContextType>({
  selectedSidebarMenuItem: 'FileExplorer',
});
/* --- Context End --- */

const IconButton = (props: { icon: string; title: string; linkTo: string }) => {
  const globalContext = useContext(GlobalContext)!;
  const localContext = useContext(LocalContext)!;
  const [selectedSidebarMenuItem, setSelectedSidebarMenuItem] = localContext.selectedSidebarMenuItem;
  const [isVisibleExplorer, setIsVisibleExplorer] = globalContext.isVisibleExplorer;

  const handleOnClick = () => {
    if (selectedSidebarMenuItem == props.linkTo) {
      setSelectedSidebarMenuItem('');
      setIsVisibleExplorer((oldState) => !oldState);
    } else {
      setIsVisibleExplorer(true);
      setSelectedSidebarMenuItem(props.linkTo);
    }
  };

  return (
    <div className={`${styles.iconButton} ${props.linkTo == selectedSidebarMenuItem ? styles.on : ''}`} title={props.title} onClick={handleOnClick}>
      <div className={`${styles.codicon} codicon ${'codicon-' + props.icon}`}></div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <AbstractWindow className={`${styles.sidebar}`} focusable={true}>
      <IconButton icon='files' title='파일관리' linkTo='FileExplorer' />
      <IconButton icon='search' title='검색' linkTo='SearchExplorer' />
    </AbstractWindow>
  );
};

const Explorer = () => {
  const globalContext = useContext(GlobalContext)!;
  const localContext = useContext(LocalContext);
  const [selectedSidebarMenuItem, setSelectedSidebarMenuItem] = localContext.selectedSidebarMenuItem;
  const [explorerWidth, setExplorerWidth] = globalContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = globalContext.isVisibleExplorer;

  return (
    <AbstractWindow className={styles.explorer} style={{ width: explorerWidth, display: isVisibleExplorer ? 'block' : 'none' }} focusable={true}>
      <FileExplorer isVisible={selectedSidebarMenuItem == 'FileExplorer'} />
    </AbstractWindow>
  );
};

const ResizingIndicator = () => {
  const ref = useRef(null);
  const globalContext = useContext(GlobalContext)!;
  const localContext = useContext(LocalContext)!;
  const [explorerWidth, setExplorerWidth] = globalContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = globalContext.isVisibleExplorer;
  const [isVisible, setIsVisible] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let isResizing = false;
    let anchorX = 0;
    let anchorWidth = 0;
    let width = explorerWidth;

    const onMouseDown = (e: MouseEvent) => {
      if (e.target == ref.current) {
        isResizing = true;
        setIsResizing(true);
        anchorX = e.clientX;
        anchorWidth = width;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        document.body.style.cursor = 'w-resize';
        width = anchorWidth + e.clientX - anchorX;
        if (width < 100) {
          width = 100;
        } else if (width > 1000) {
          width = 1000;
        }
        setExplorerWidth(width);
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isResizing) {
        document.body.style.cursor = 'default';
        isResizing = false;
        setIsResizing(false);
        anchorX = 0;
        anchorWidth = 0;
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleOnMouseEnter = () => {
    setIsVisible(true);
  };

  const handleOnMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      ref={ref}
      className={`${styles.resizingIndicator} ${isVisible || isResizing ? styles.on : ''}`}
      style={{ left: explorerWidth + 38, display: isVisibleExplorer ? 'block' : 'none' }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    ></div>
  );
};

const LeftMenu = () => {
  const globalContext = useContext(GlobalContext)!;
  const localContext = useContext(LocalContext);
  const [explorerWidth, setExplorerWidth] = globalContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = globalContext.isVisibleExplorer;

  return (
    <div className={styles.leftMenu} style={{ width: isVisibleExplorer ? explorerWidth + 40 : 40 }}>
      <Sidebar />
      <Explorer />
      <ResizingIndicator />
    </div>
  );
};

const TabButton = (props: { file: FileType }) => {
  const globalContext = useContext(GlobalContext);
  const [loadedTabs, setLoadedTabs] = globalContext.loadedTabs;
  const [activatedTab, setActivatedTab] = globalContext.activatedTab;

  const handleOnClick = () => {
    setActivatedTab(props.file);
  };

  const handleOnClickClose = (e: React.MouseEvent) => {
    const newLoadedTabs = loadedTabs.filter((file) => file.path != props.file.path || file.name != props.file.name);
    setLoadedTabs(newLoadedTabs);
    if (activatedTab?.path == props.file.path && activatedTab?.name == props.file.name) {
      setActivatedTab(newLoadedTabs.length == 0 ? null : newLoadedTabs[newLoadedTabs.length - 1]);
    }
    e.stopPropagation();
  };

  return (
    <div className={`${styles.tabButton} ${props.file.path == activatedTab?.path && props.file.name == activatedTab.name ? styles.on : ''}`} onClick={handleOnClick}>
      <div className={`${styles.icon} codicon codicon-${props.file.icon}`}></div>
      <div className={styles.title}>{props.file.name}</div>
      <div className={`${styles.close} codicon codicon-chrome-close`} onClick={handleOnClickClose}></div>
    </div>
  );
};

const TabFolder = () => {
  const globalContext = useContext(GlobalContext);
  const [loadedTabs, setLoadedTabs] = globalContext.loadedTabs;

  return (
    <AbstractWindow className={`${styles.tabFolder} tabFolder`} focusable={true}>
      <div className={styles.tabNav}>
        {loadedTabs.map((tab) => (
          <TabButton key={tab.path + '/' + tab.name} file={tab} />
        ))}
      </div>
      {loadedTabs.map((tab) => (
        <CanvasContainer key={tab.path + '/' + tab.name} file={tab} />
      ))}
      {loadedTabs.length > 0 ? <Pallete /> : null}
    </AbstractWindow>
  );
};

export default () => {
  return (
    <div className={styles.contentPane}>
      <LocalContextProvider>
        <LeftMenu />
        <TabFolder />
      </LocalContextProvider>
    </div>
  );
};
