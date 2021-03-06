import { createActions } from 'redux-yo';

export const currenciesActions = createActions(
  [
    'setCurrencies',
    'watchPrices',
    'stopWatchPrices',
    'setSearchQuery',
    'clearSearchQuery',
  ],
  'currencies'
);
