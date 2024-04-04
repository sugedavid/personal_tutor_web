'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../lib/store';
import { setIndex } from '../lib/slices/mainScaffoldSlice';

export default function StoreProvider({ index, children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(setIndex(index));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
