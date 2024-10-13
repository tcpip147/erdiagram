import { GlobalContextType } from '@/components/App';
import { CanvasDataType } from '@/explorers/FileExplorer';
import Shape from '@/shapes/abstract/Shape';

export default class CanvasUtils {
  static addShape(globalContext: GlobalContextType, shape: Shape) {
    const [activatedTab, setActivatedTab] = globalContext.activatedTab;

    const data = activatedTab?.canvasDataRef?.current;
    if (data && data.shapes == null) {
      data.shapes = [];
    }
    data?.shapes?.push(shape);
  }

  static redraw(globalContext: GlobalContextType) {
    const [changedCanvas, setChangedCanvas] = globalContext.changedCanvas;
    setChangedCanvas((oldState) => !oldState);
  }

  static getScale(globalContext: GlobalContextType) {
    const [activatedTab, setActivatedTab] = globalContext.activatedTab;
    return activatedTab?.canvasDataRef?.current.scale == null ? 1.0 : activatedTab?.canvasDataRef?.current.scale;
  }

  static setScale(globalContext: GlobalContextType, scale: number) {
    const [activatedTab, setActivatedTab] = globalContext.activatedTab;
    if (activatedTab) {
      if (activatedTab.canvasDataRef) {
        activatedTab.canvasDataRef.current.scale = scale;
      }
    }
  }
}
