import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import {
  configureObservableSync,
  createRevertChanges,
} from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NON_RETRYABLE_STATUSES = new Set([400, 403, 404, 422]);

configureObservableSync({
  persist: {
    plugin: observablePersistAsyncStorage({ AsyncStorage }),
    retrySync: true,
  },
  retry: {
    infinite: true,
    delay: 2000,
  },
  onError: (error, params) => {
    const status =
      error instanceof Error && 'status' in error
        ? (error.status as number | undefined)
        : undefined;

    if (status !== undefined && NON_RETRYABLE_STATUSES.has(status)) return;

    params.retry.cancelRetry = true;

    if (params.setParams) {
      const revert = createRevertChanges(
        params.setParams.value$,
        params.setParams.changes
      );
      revert();
    }
  },
});
