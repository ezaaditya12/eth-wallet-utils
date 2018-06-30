import unCollectAccounts from './uncollect-accounts.mock';

const db = {
  getUnCollectedAccounts: () => unCollectAccounts,
  updateUnCollectedAccounts: () => {}
};

module.exports = db;
