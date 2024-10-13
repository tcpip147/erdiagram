import { GlobalContextType } from '@/components/App';
import CanvasUtils from '@/utils/CanvasUtils';

export const onZoomCanvas = (e: WheelEvent, globalContext: GlobalContextType) => {
  let scale = CanvasUtils.getScale(globalContext);
  if (e.deltaY > 0) {
    scale -= 0.01;
  } else {
    scale += 0.01;
  }
  CanvasUtils.setScale(globalContext, scale);
  CanvasUtils.redraw(globalContext);
};
