import unCollectAccounts from './uncollect-accounts.mock.json';

const db = {
  getUnCollectedAccounts: () => unCollectAccounts,
  updateUnCollectedAccounts: () => {}
};

module.exports = db;
