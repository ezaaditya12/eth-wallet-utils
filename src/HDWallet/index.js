import { HDNode, Wallet } from 'ethers';
import mnGen from 'mngen';

const log = console.log;

class HDWallet {

  static fromMnemonic(mnemonic) {
    return HDNode.fromMnemonic(mnemonic);
  }

  static newMnemonic() {
    return mnGen.word(12, ' ');
  }

  static newOne() {
    return HDNode.fromMnemonic(mnGen.word(12, ' '));
  }

  static generate({ from, total }) {
    return masterNode =>
      Array(total)
        .fill(null)
        .map((_, index) => {
          const childPath = `${HDWallet.BIP44}/${from + index}`;
          const childNode = masterNode.derivePath(childPath);
          const wallet = new Wallet(childNode.privateKey);
          return wallet.address;
        });
  }
}

HDWallet.BIP44 = 'm/44\'/60\'/0\'/0';

export default HDWallet;
