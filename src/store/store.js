import { createUseStore } from '@zubridge/electron';

export const useStore = createUseStore();

export const storeActions = window?.electronApi?.getStoreActions() || {};
