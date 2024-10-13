import ContentPane from '@/components/ContentPane';
import Titlebar from '@/components/Titlebar';
import { createContextProvider } from '@/utils/ContextProvider';
import '@vscode/codicons/dist/codicon.css';
import { useContext, useEffect } from 'react';
import * as styles from './App.module.scss';
import { FileType } from '@/explorers/FileExplorer';
import { PalleteButtonType } from '@/components/Pallete';
import { onFiredKey1 } from '@/commands/PalleteKey1';
import CanvasUtils from '@/utils/CanvasUtils';

/* --- Context Start --- */
export interface GlobalContextType {
  isFocusBrowser: [boolean, React.Dispatch<boolean>];
  focusedWindow: [string, React.Dispatch<string>];
  loadedTabs: [FileType[], React.Dispatch<((value: FileType[]) => FileType[]) | FileType[]>];
  activatedTab: [FileType | null, React.Dispatch<FileType | null>];
  explorerWidth: [number, React.Dispatch<React.SetStateAction<number>>];
  isVisibleExplorer: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  palleteButtons: [PalleteButtonType[], React.Dispatch<React.SetStateAction<PalleteButtonType[]>>];
  changedCanvas: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const [GlobalContext, GlobalContextProvider] = createContextProvider<GlobalContextType>({
  isFocusBrowser: false,
  focusedWindow: '',
  loadedTabs: [],
  activatedTab: null,
  explorerWidth: 250,
  isVisibleExplorer: true,
  palleteButtons: [
    //
    { key: '1', isActivated: false, onFired: onFiredKey1 },
    { key: '2', isActivated: false },
    { key: '3', isActivated: false },
    { key: '4', isActivated: false },
    { key: '5', isActivated: false },
    { key: '6', isActivated: false },
    { key: '7', isActivated: false },
    { key: '8', isActivated: false },
  ],
  changedCanvas: false,
});
/* --- Context End --- */

const App = () => {
  const globalContext = useContext(GlobalContext);
  const [isFocusBrowser, setIsFocusBrowser] = globalContext.isFocusBrowser;
  const [focusedWindow, setFocusedWindow] = globalContext.focusedWindow;

  useEffect(() => {
    setIsFocusBrowser(document.hasFocus());

    const onFocus = (e: FocusEvent) => {
      setIsFocusBrowser(true);
    };
    const onblur = (e: FocusEvent) => {
      setFocusedWindow('');
      setIsFocusBrowser(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key == 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.body.requestFullscreen();
        }
      }
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onblur);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onblur);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className={styles.app}>
      <Titlebar />
      <ContentPane />
    </div>
  );
};

export { App, GlobalContext, GlobalContextProvider };
