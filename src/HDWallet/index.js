import BIP39 from 'bip39';
import compose from 'compose-funcs';
import { HDNode, Wallet } from 'ethers';
import Web3 from 'web3';

import { log } from 'core/helpers';

class MnemonicErr extends Error {
  constructor(message) {
    super(`[MnemonicErr] ${message}`, 1);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class HDWallet {
  static BIP44 = 'm/44\'/60\'/0\'/0';

  static generate({ offset, limit }) {
    return masterNode =>
      Array(limit)
        .fill(null)
        .map((_, index) => {
          const childPath = `${HDWallet.BIP44}/${offset + index}`;
          const childNode = masterNode.derivePath(childPath);
          const wallet = new Wallet(childNode.privateKey);
          return {
            address: wallet.address,
            derivePath: childPath
          };
        });
  }

  static fromMnemonic(mnemonic) {
    if (!HDWallet.isValidMnemonic(mnemonic))
      throw new MnemonicErr(
        'Invalid mnemonic. ' +
          'Note: mnemonic phrase should be 12 words and implement BIP39.'
      );

    return HDNode.fromMnemonic(mnemonic);
  }

  static newMnemonic() {
    return BIP39.generateMnemonic();
  }

  static newOne() {
    return compose(
      HDWallet.fromMnemonic,
      HDWallet.newMnemonic
    )();
  }

  static getHDWalletAddress(hdWallet) {
    return new Wallet(hdWallet.privateKey).address;
  }

  static walletFromPrv(prvKey) {
    return new Wallet(prvKey);
  }

  static newWallet() {
    return Wallet.createRandom();
  }

  static isValidMnemonic(mnemonic){
    return BIP39.validateMnemonic(mnemonic);
  }

  static isValidAddress(address){
    return Web3.utils.isAddress(address); 
  }
}

export default HDWallet;
export { MnemonicErr };
