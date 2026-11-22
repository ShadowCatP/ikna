import { observable } from '@legendapp/state';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const isOnline$ = observable(false);

function updateOnline(state: NetInfoState) {
  isOnline$.set(
    state.isConnected === true && state.isInternetReachable === true
  );
}

NetInfo.addEventListener(updateOnline);
void NetInfo.fetch().then(updateOnline);
