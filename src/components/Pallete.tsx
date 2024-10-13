import { GlobalContext, GlobalContextType } from '@/components/App';
import { closest } from '@/utils/HtmlUtils';
import { useContext, useEffect, useRef } from 'react';
import * as styles from './Pallete.module.scss';

export interface PalleteButtonType {
  key: string;
  isActivated: boolean;
  onFired?: (context: GlobalContextType) => void;
}

const PalleteButton = (props: { button: PalleteButtonType }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const globalContext = useContext(GlobalContext);
  const [activatedTab, setActivatedTab] = globalContext.activatedTab;

  const handleOnClick = () => {
    if (props.button.onFired) {
      props.button.onFired(globalContext);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key == props.button.key && props.button.onFired) {
        if (buttonRef.current) {
          const tabFolder = closest(buttonRef.current, 'tabFolder');
          if (tabFolder?.classList.contains('focused')) {
            props.button.onFired(globalContext);
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activatedTab]);

  return <div ref={buttonRef} className={`${styles.palleteButton} ${props.button.isActivated ? styles.on : ''}`} onClick={handleOnClick}></div>;
};

const Pallete = () => {
  const globalContext = useContext(GlobalContext);
  const [palleteButtons, setPalleteButtons] = globalContext.palleteButtons;

  return (
    <div className={styles.pallete}>
      <div className={styles.line}>
        {palleteButtons.map((button, i) => (
          <PalleteButton key={'line1' + i} button={button} />
        ))}
      </div>
    </div>
  );
};

export default () => {
  return <Pallete />;
};
