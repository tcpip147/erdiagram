import { useContext, useEffect, useState } from 'react';
import * as styles from './FileExplorer.module.scss';
import { GlobalContext } from '@/components/App';
import Shape from '@/shapes/abstract/Shape';

export interface CanvasDataType {
  scale?: number;
  shapes?: Shape[];
}

export interface FileType {
  isDirectory?: boolean;
  children?: FileType[];
  isOpen?: boolean;
  icon?: string;
  path: string;
  name: string;
  data?: CanvasDataType;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  canvasContextRef?: CanvasRenderingContext2D;
  canvasDataRef?: React.MutableRefObject<CanvasDataType>;
}

export default (props: { isVisible: boolean }) => {
  const [loadedFiles, setLoadedFiles] = useState<FileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const globalContext = useContext(GlobalContext);
  const [loadedTabs, setLoadedTabs] = globalContext.loadedTabs;
  const [activatedTab, setActivatedTab] = globalContext.activatedTab;

  useEffect(() => {
    setLoadedFiles((oldState: FileType[]) => {
      const newState = [
        {
          isDirectory: true,
          path: '/',
          name: 'ERD Files',
          children: [
            {
              path: '/ERD Files',
              name: 'Sample.erd.json',
              icon: 'table',
              data: {},
            },
            {
              path: '/ERD Files',
              name: 'Sample2.erd.json',
              icon: 'table',
              data: {},
            },
          ],
        },
        {
          path: '/',
          name: 'Sample3.erd.json',
          icon: 'table',
          data: {},
        },
      ];
      return newState;
    });

    handleOnDoubleClick({
      path: '/',
      name: 'Sample3.erd.json',
      icon: 'table',
      data: {},
    });
  }, []);

  const handleOnClick = (file: FileType) => {
    setSelectedFile(file);
    setLoadedFiles((oldState: FileType[]) => {
      const newState = [...oldState];
      newState.forEach((newFile) => {
        if (newFile.isDirectory) {
          if (newFile.path == file.path && newFile.name == file.name) {
            newFile.isOpen = !file.isOpen;
          }
        }
      });
      return newState;
    });
  };

  const handleOnDoubleClick = (file: FileType) => {
    const tab = loadedTabs.filter((tab) => tab.path == file.path && tab.name == file.name);
    if (tab.length == 0) {
      setLoadedTabs((oldState) => {
        const newState = [...oldState];
        newState.push(file);
        return newState;
      });
    }
    setActivatedTab(file);
  };

  const renderFile = (file: FileType, indent: number): React.ReactNode => {
    const isSelected = selectedFile?.path == file.path && selectedFile.name == file.name;
    if (file.isDirectory) {
      return (
        <div key={file.path + '/' + file.name}>
          <div className={`${styles.directory} ${isSelected ? styles.on : ''}`} style={{ paddingLeft: indent * 10 }} onClick={() => handleOnClick(file)}>
            {file.isOpen ? <div className={`codicon codicon-chevron-down`}></div> : <div className={`codicon codicon-chevron-right`}></div>}
            <span>{file.name}</span>
          </div>
          {file.isOpen ? file.children?.map((child) => renderFile(child, indent + 1)) : null}
        </div>
      );
    } else {
      return (
        <div
          key={file.path + '/' + file.name}
          className={`${styles.file} ${isSelected ? styles.on : ''}`}
          style={{ paddingLeft: indent * 10 }}
          onClick={() => handleOnClick(file)}
          onDoubleClick={() => handleOnDoubleClick(file)}
        >
          <div className={`codicon codicon-${file.icon}`}></div>
          <span>{file.name}</span>
        </div>
      );
    }
  };

  return (
    <div className={styles.fileExplorer} style={{ display: props.isVisible ? '' : 'none' }}>
      {loadedFiles.map((file) => renderFile(file, 0))}
    </div>
  );
};
