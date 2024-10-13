import { GlobalContextType } from '@/components/App';

export default class PalleteUtils {
  static setActiveButton(globalContext: GlobalContextType, index: number, isActivated: boolean) {
    const [palleteButtons, setPalleteButtons] = globalContext.palleteButtons;

    setPalleteButtons((oldState) => {
      const newState = [...oldState];
      newState[index].isActivated = isActivated;
      return newState;
    });
  }
}
