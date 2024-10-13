import { GlobalContextType } from '@/components/App';
import Table from '@/shapes/Table';
import CanvasUtils from '@/utils/CanvasUtils';
import PalleteUtils from '@/utils/PalleteUtils';

export const onFiredKey1 = (globalContext: GlobalContextType) => {
  PalleteUtils.setActiveButton(globalContext, 0, true);
  CanvasUtils.addShape(globalContext, new Table());
  CanvasUtils.redraw(globalContext);
};
