import { HDNode } from 'ethers';
import mnGen from 'mngen';

const log = console.log;

class HDWallet {
  static fromMnemonic(mnemonic){
    return HDNode.fromMnemonic(mnemonic);
  }

  static newOne(){
    const mnemonic = mnGen.word(12, ' ');
    log('[HD Wallet][mnemonic]', mnemonic);
    return HDNode.fromMnemonic(mnemonic);
  }

  
}

export default HDWallet;