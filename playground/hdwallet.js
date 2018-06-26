import compose from 'compose-funcs';

// const hdkey = require('ethereumjs-wallet/hdkey');
// const bip39 = require('bip39');
// const mnemonic = 'unknown seed kit come final jacket final protect wedding inquiry spin silver';
// const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// console.log('xpub', hdwallet.publicExtendedKey());
// console.log('xprv', hdwallet.privateExtendedKey());

// const wallet = hdwallet.getWallet();
// console.log('publicKey', wallet.getPublicKeyString());
// console.log('privateKey', wallet.getPrivateKeyString());
// console.log('address', wallet.getAddressString());
const lx = compose(r => console.log(r));

lx('[Got it]');
