import AbstractWindow from '@/components/abstract/AbstractWindow';
import { createContextProvider } from '@/utils/ContextProvider';
import '@vscode/codicons/dist/codicon.css';
import { useContext, useEffect, useRef, useState } from 'react';
import * as styles from './ContentPane.module.scss';

/* --- Context Start --- */
interface TabType {
  filename: string;
  title: string;
}

interface LocalContextType {
  explorerWidth: [number, React.Dispatch<React.SetStateAction<number>>];
  tabFolderWidth: [number, React.Dispatch<React.SetStateAction<number>>];
  selectedSidebarMenuItem: [string, React.Dispatch<React.SetStateAction<string>>];
  isVisibleExplorer: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  loadedTabs: [TabType[], React.Dispatch<React.SetStateAction<TabType[]>>];
  activatedTab: [TabType, React.Dispatch<React.SetStateAction<TabType>>];
}

const [LocalContext, LocalContextProvider] = createContextProvider<LocalContextType>({
  explorerWidth: 250,
  tabFolderWidth: 0,
  selectedSidebarMenuItem: 'FileExplorer',
  isVisibleExplorer: true,
  loadedTabs: [
    { filename: 'Sample.erd.json', title: 'Sample.erd.json' },
    { filename: 'HelloWorld.erd.json', title: 'HelloWorld.erd.json' },
  ],
  activatedTab: { filename: 'HelloWorld.erd.json', title: 'HelloWorld.erd.json' },
});
/* --- Context End --- */

const IconButton = (props: { icon: string; title: string; linkTo: string }) => {
  const localContext = useContext(LocalContext)!;
  const [selectedSidebarMenuItem, setSelectedSidebarMenuItem] = localContext.selectedSidebarMenuItem;
  const [isVisibleExplorer, setIsVisibleExplorer] = localContext.isVisibleExplorer;

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
  const localContext = useContext(LocalContext);
  const [selectedSidebarMenuItem, setSelectedSidebarMenuItem] = localContext.selectedSidebarMenuItem;
  const [explorerWidth, setExplorerWidth] = localContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = localContext.isVisibleExplorer;

  return <AbstractWindow className={styles.explorer} style={{ width: explorerWidth, display: isVisibleExplorer ? 'block' : 'none' }} focusable={true}></AbstractWindow>;
};

const ResizingIndicator = () => {
  const ref = useRef(null);
  const localContext = useContext(LocalContext)!;
  const [explorerWidth, setExplorerWidth] = localContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = localContext.isVisibleExplorer;
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
      style={{ left: explorerWidth + 39, display: isVisibleExplorer ? 'block' : 'none' }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    ></div>
  );
};

const ContentPane = () => {
  const localContext = useContext(LocalContext);
  const [explorerWidth, setExplorerWidth] = localContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = localContext.isVisibleExplorer;

  return (
    <div className={styles.leftMenu} style={{ width: isVisibleExplorer ? explorerWidth + 42 : 41 }}>
      <Sidebar />
      <Explorer />
      <ResizingIndicator />
    </div>
  );
};

const TabButton = (props: { filename: string; title: string }) => {
  const localContext = useContext(LocalContext);
  const [activatedTab, setActivatedTab] = localContext.activatedTab;

  return (
    <div className={`${styles.tabButton} ${props.filename == activatedTab.filename ? styles.on : ''}`}>
      <div className={styles.title}>{props.title}</div>
      <div className={`${styles.close} codicon codicon-chrome-close`}></div>
    </div>
  );
};

const CanvasContainer = () => {
  return (
    <div className={styles.canvasContainer}>
      <canvas></canvas>
    </div>
  );
};

const TabFolder = () => {
  const localContext = useContext(LocalContext);
  const [loadedTabs, setLoadedTabs] = localContext.loadedTabs;

  return (
    <AbstractWindow className={styles.tabFolder} focusable={true}>
      <div className={styles.tabNav}>
        {loadedTabs.map((tab) => (
          <TabButton key={tab.filename} filename={tab.filename} title={tab.title} />
        ))}
      </div>
      <CanvasContainer />
    </AbstractWindow>
  );
};

export default () => {
  return (
    <div className={styles.contentPane}>
      <LocalContextProvider>
        <ContentPane />
        <TabFolder />
      </LocalContextProvider>
    </div>
  );
};
