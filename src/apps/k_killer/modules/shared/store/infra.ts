import { configureStore } from '@reduxjs/toolkit';
import { listen } from '@tauri-apps/api/event';

import { RootActions, RootSlice } from './app';

import { Reservation, Sizing } from '../../layout/domain';
import { DesktopId, FocusAction } from './domain';

export const store = configureStore({
  reducer: RootSlice.reducer,
  devTools: true,
});

export async function registerStoreEvents() {
  await listen<{ hwnd: number; desktop_id: DesktopId }>('add-window', (event) => {
    store.dispatch(RootActions.addWindow(event.payload));
  });

  await listen<number>('remove-window', (event) => {
    store.dispatch(RootActions.removeWindow(event.payload));
  });

  await listen<void>('force-retiling', () => {
    store.dispatch(RootActions.forceUpdate());
  });

  await listen<DesktopId>('set-active-workspace', (event) => {
    store.dispatch(RootActions.setActiveWorkspace(event.payload));
  });

  await listen<number>('set-active-window', (event) => {
    store.dispatch(RootActions.setActiveWindow(event.payload));
    if (event.payload != 0) {
      store.dispatch(RootActions.setLastManagedActivated(event.payload));
    }
  });

  await listen<Reservation | null>('set-reservation', (event) => {
    store.dispatch(RootActions.setReservation(event.payload));
  });

  await listen<Sizing>('update-width', (event) => {
    store.dispatch(RootActions.updateSizing({ axis: 'x', sizing: event.payload }));
  });

  await listen<Sizing>('update-height', (event) => {
    store.dispatch(RootActions.updateSizing({ axis: 'y', sizing: event.payload }));
  });

  await listen<void>('reset-workspace-size', () => {
    store.dispatch(RootActions.resetSizing());
  });

  await listen<FocusAction>('focus', (event) => {
    store.dispatch(RootActions.focus(event.payload));
  });
}