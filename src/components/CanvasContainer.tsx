import { GlobalContext } from '@/components/App';
import { CanvasDataType, FileType } from '@/explorers/FileExplorer';
import { useContext, useEffect, useRef, useState } from 'react';
import * as styles from './CanvasContainer.module.scss';
import { onZoomCanvas } from '@/commands/ZoomCanvas';

export default (props: { file: FileType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D>(null);
  const canvasDataRef = useRef<CanvasDataType>({});
  const globalContext = useContext(GlobalContext);
  const [loadedTabs, setLoadedTabs] = globalContext.loadedTabs;
  const [activatedTab, setActivatedTab] = globalContext.activatedTab;
  const [explorerWidth, setExplorerWidth] = globalContext.explorerWidth;
  const [isVisibleExplorer, setIsVisibleExplorer] = globalContext.isVisibleExplorer;
  const [changedCanvas, setChangedCanvas] = globalContext.changedCanvas;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setLoadedTabs((oldState) => {
      const newState = [...oldState];
      newState.forEach((file) => {
        if (file.path == props.file.path && file.name == props.file.name) {
          file.canvasRef = canvasRef;
          file.canvasContextRef = canvasRef.current?.getContext('2d')!;
          file.canvasDataRef = canvasDataRef;
        }
      });
      return newState;
    });

    //
    const handleOnZoomCanvas = (e: WheelEvent) => {
      if (e.target == canvasRef.current) {
        onZoomCanvas(e, globalContext);
      }
    };

    //
    const handleOnFullScreenChange = () => {
      if (!document.fullscreenElement) {
        const container = containerRef.current!;
        const canvas = canvasRef.current!;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height - 30;
      }
    };
    window.addEventListener('wheel', handleOnZoomCanvas);
    document.addEventListener('fullscreenchange', handleOnFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleOnFullScreenChange);
      window.removeEventListener('wheel', handleOnZoomCanvas);
    };
  }, []);

  useEffect(() => {
    redraw();
  }, [explorerWidth, isVisibleExplorer, changedCanvas]);

  useEffect(() => {
    const onResize = () => {
      redraw();
    };
    redraw();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isSelected]);

  useEffect(() => {
    canvasDataRef.current = activatedTab?.data!;
    setIsSelected(activatedTab?.path == props.file.path && activatedTab?.name == props.file.name);
    return () => {
      activatedTab!.data = canvasDataRef.current;
    };
  }, [activatedTab]);

  const redraw = () => {
    if (isSelected && containerRef.current) {
      const container = containerRef.current!;
      const canvas = canvasRef.current!;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      console.log(canvasDataRef.current);
    }
  };

  return (
    <div ref={containerRef} className={styles.canvasContainer} style={{ display: isSelected ? '' : 'none' }}>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
};
