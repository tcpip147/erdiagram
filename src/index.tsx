import { App, GlobalContextProvider } from '@/components/App';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
);
