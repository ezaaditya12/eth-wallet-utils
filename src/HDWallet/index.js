import BIP39 from 'bip39';
import compose from 'compose-funcs';
import { HDNode, Wallet } from 'ethers';

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
          return wallet.address;
        });
  }

  static fromMnemonic(mnemonic) {
    if (!BIP39.validateMnemonic(mnemonic))
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

  static getAddress(hdWallet) {
    return new Wallet(hdWallet.privateKey).address;
  }

  static transaction(){
    
  }

  /**
   * Collect all money from children
   * Child info should have:
   *   + Address
   *   + Derive path, ex: m/44'/60'/0'/0
   *
   * @static
   * @param {*} {mnemonic, children, receiveAcc}
   * @memberof ETHBlock
   */
  static collect({mnemonic, children, receiveAcc}){
    const masterNode = HDWallet.fromMnemonic(mnemonic);
    const prvKeys = children.map(info => {
      const { address, derivePath } = info;
      const childNode = masterNode.derivePath(derivePath);
      const wallet = new Wallet(childNode.privateKey);
      const sameAdr = address === wallet.address;
      if(!sameAdr) {
        log('[collect][WARN] Find child: Address & Derive Path not match');
      }
      return childNode.privateKey;
    });


  }
}

export default HDWallet;
export { MnemonicErr };
