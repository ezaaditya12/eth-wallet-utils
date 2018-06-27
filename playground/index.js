import compose from 'compose-funcs';
import Web3 from 'web3';

import { log } from 'core/helpers';
import { composeAsync } from 'core/compose';
import ETHBlock from 'ETHBlock';

/** Try on different HDWallet */
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

/** Try on compose */
// const lx = compose(r => console.log(r));
// lx('[Got it]');

/** Try on composeAsync */
// const getAsync = () => new Promise(r => setTimeout(() => r('Got list'), 1000));
// const fAsync = composeAsync(console.log, getAsync);
// fAsync();

/** Try on ETHBlock watch */
// ETHBlock.watch({ blockCb: log, txCb: log });

/** Try Web3.utils instead of "web3" instance */
log(Web3.utils.fromWei);