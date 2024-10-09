import ContentPane from '@/components/ContentPane';
import Titlebar from '@/components/Titlebar';
import { createContextProvider } from '@/utils/ContextProvider';
import '@vscode/codicons/dist/codicon.css';
import { useContext, useEffect } from 'react';
import * as styles from './App.module.scss';

/* --- Context Start --- */
interface GlobalContextType {
  isFocusBrowser: [boolean, React.Dispatch<boolean>];
  focusedWindow: [string, React.Dispatch<string>];
}

const [GlobalContext, GlobalContextProvider] = createContextProvider<GlobalContextType>({
  isFocusBrowser: false,
  focusedWindow: '',
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
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onblur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onblur);
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

