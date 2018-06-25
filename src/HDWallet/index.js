import { HDNode, Wallet } from 'ethers';
import mnGen from 'mngen';

const log = console.log;

class HDWallet {
  static fromMnemonic(mnemonic) {
    return HDNode.fromMnemonic(mnemonic);
  }

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

  static newMnemonic() {
    return mnGen.word(12, ' ');
  }

  static newOne() {
    return HDWallet.fromMnemonic(HDWallet.newMnemonic());
  }
}

HDWallet.BIP44 = 'm/44\'/60\'/0\'/0';

export default HDWallet;
