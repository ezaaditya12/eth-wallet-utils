import os from 'os';
import BIP39 from 'bip39';
import compose from 'compose-funcs';
import { HDNode, Wallet } from 'ethers';

const log = console.log;

class MnemonicError extends Error {
  constructor(message) {
    super(
      [
        `[MnemonicError][ERR] ${message}.`,
        'Note: mnemonic phrase should be 12 words and implement BIP39.'
      ].join(os.EOL),
      1
    );
    // Saving class name in the property
    // Capturing stack trace
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
          return wallet.address;
        });
  }

  static fromMnemonic(mnemonic) {
    if (!BIP39.validateMnemonic(mnemonic))
      throw new MnemonicError('Invalid mnemonic');

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

  static getAddress(hdWallet) {
    return new Wallet(hdWallet.privateKey).address;
  }
}

export default HDWallet;
export { MnemonicError };
