import { GlobalContext } from '@/components/App';
import _ from 'lodash';
import { useContext, useId } from 'react';
import * as styles from './AbstractWindow.module.scss';

export default (props: { className?: string; children?: React.ReactNode; focusable?: boolean; [rest: string]: any }) => {
  const uid = useId();
  const globalContext = useContext(GlobalContext);
  const [focusedWindow, setFocusedWindow] = globalContext.focusedWindow;

  const onHandleMouseDown = (e: any) => {
    if (props.focusable) {
      setFocusedWindow(uid);
    }
    if (props.onMouseDown) {
      props.onMouseDown(e);
    }
  };

  const attributes = _.omit(props, ['className', 'children', 'focusable', 'onMouseDown']);

  return (
    <div className={`${styles.root} ${props.className ? props.className : ''} ${focusedWindow == uid ? 'focused' : ''}`} onMouseDown={onHandleMouseDown} {...attributes}>
      {props.children}
    </div>
  );
};
