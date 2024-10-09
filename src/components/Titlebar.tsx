import { GlobalContext } from '@/components/App';
import AbstractWindow from '@/components/abstract/AbstractWindow';
import { createContextProvider } from '@/utils/ContextProvider';
import React, { Children, useContext, useEffect, useId, useRef, useState } from 'react';
import * as styles from './Titlebar.module.scss';

/* --- Context Start --- */
interface LocalContextType {
  isOpenMenu: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  hoveredMenuTree: [string[], React.Dispatch<React.SetStateAction<string[]>>];
}

const [LocalContext, LocalContextProvider] = createContextProvider<LocalContextType>({
  isOpenMenu: false,
  hoveredMenuTree: [],
});
/* --- Context End --- */

const Menu = (props: { children: React.ReactNode }) => {
  const children = Children.map(props.children, (child, i) => {
    return React.cloneElement(child as any, {
      depth: 0,
    });
  });

  return <div className={styles.menu}>{children}</div>;
};

const MenuItem = (props: { name: string; depth?: number; children?: React.ReactNode }) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const localContext = useContext(LocalContext);
  const [hoveredMenuTree, setHoveredMenuTree] = localContext.hoveredMenuTree;
  const [isOpenMenu, setIsOpenMenu] = localContext.isOpenMenu;
  const [childrenRect, setChildrenRect] = useState({
    left: 0,
    top: 0,
  });
  const children = Children.map(props.children, (child, i) => {
    return React.cloneElement(child as any, {
      depth: props.depth! + 1,
    });
  });

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (props.depth == 0) {
        setChildrenRect({
          left: 0,
          top: rect.height,
        });
      } else {
        setChildrenRect({
          left: rect.width,
          top: -3,
        });
      }
    }
  }, []);

  const handleOnMouseEnter = () => {
    setHoveredMenuTree((oldState) => {
      const newState = [...oldState];
      if (oldState[props.depth!] != id) {
        newState[props.depth!] = id;
        for (let i = props.depth! + 1; i < newState.length; i++) {
          newState[i] = '';
        }
      }
      return newState;
    });
  };

  return (
    <div ref={ref} className={styles.menuItem} data-depth={props.depth} onMouseEnter={handleOnMouseEnter}>
      <div className={`${styles.title} ${isOpenMenu && id == hoveredMenuTree[props.depth!] ? styles.on : ''}`}>
        {props.name}
        {props.children && props.depth! > 0 ? <div className={`codicon codicon-chevron-right ${styles.indicator}`}></div> : null}
      </div>
      {props.children && isOpenMenu && id == hoveredMenuTree[props.depth!] ? (
        <div className={styles.children} style={{ left: childrenRect.left, top: childrenRect.top }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

const Separator = () => {
  return <div className={styles.separator} />;
};

const TitleBar = () => {
  const globalContext = useContext(GlobalContext);
  const [isFocusBrowser, setIsFocusBrowser] = globalContext.isFocusBrowser;
  const localContext = useContext(LocalContext);
  const [isOpenMenu, setIsOpenMenu] = localContext.isOpenMenu;
  const [hoveredMenuTree, setHoveredMenuTree] = localContext.hoveredMenuTree;

  const handleOnFocus = () => {
    setIsOpenMenu(true);
  };

  const handleOnBlur = () => {
    setIsOpenMenu(false);
    setHoveredMenuTree([]);
  };

  return (
    <AbstractWindow className={`${styles.titlebar} ${isFocusBrowser ? styles.activated : ''}`} onFocus={handleOnFocus} onBlur={handleOnBlur} tabIndex={0}>
      <div style={{ width: 20, height: 1 }}>{/* preserved */}</div>
      <Menu>
        <MenuItem name='파일' />
        <MenuItem name='도움말'>
          <MenuItem name='환영합니다' />
          <Separator />
          <MenuItem name='프로그램 정보' />
        </MenuItem>
      </Menu>
    </AbstractWindow>
  );
};

export default () => {
  return (
    <LocalContextProvider>
      <TitleBar />
    </LocalContextProvider>
  );
};
