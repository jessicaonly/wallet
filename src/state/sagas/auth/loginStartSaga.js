import { takeLatest, call, put } from 'redux-saga/effects';
import StellarHDWallet from 'stellar-hd-wallet';
import * as Keychain from 'react-native-keychain';

import { decrypt, logLogin } from 'utils';
import navigator from 'state/navigator';
import { authActions } from 'state/auth';

function* run() {
  yield call(navigator.navigate, 'Auth', 'Loading');

  const pinStore = yield call(Keychain.getGenericPassword, {
    service: 'pin',
  });

  const encryptedMnemonicStore = yield call(Keychain.getGenericPassword, {
    service: 'mnemonic',
  });

  if (!encryptedMnemonicStore) {
    yield put(authActions.signupStart());

    logLogin('Pin', false);
    return;
  }

  const mnemonic = yield call(
    decrypt,
    pinStore.password,
    encryptedMnemonicStore.password
  );

  const wallet = StellarHDWallet.fromMnemonic(mnemonic);

  yield put(authActions.set({ wallet }));

  yield call(navigator.navigate, 'Main', 'App');

  yield put(authActions.loginSuccess());

  logLogin('Pin', true);
}

export default takeLatest(authActions.loginStart, run);
