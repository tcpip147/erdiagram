import { createContext, useState } from 'react';

function createContextProvider<T>(value: any): [React.Context<T>, ({ children }: { children: React.ReactNode }) => JSX.Element] {
  const Context = createContext<T>({} as T);

  const ContextProvider = ({ children }: { children: React.ReactNode }) => {
    const state: any = {};
    for (let key in value) {
      state[key] = useState(value[key]);
    }
    return <Context.Provider value={state}>{children}</Context.Provider>;
  };

  return [Context, ContextProvider];
}

export { createContextProvider };
