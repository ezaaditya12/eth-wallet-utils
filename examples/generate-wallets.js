import style from 'chalk';

import { log } from 'core/helpers';
import HDWallet from 'HDWallet';

const mnemonic = HDWallet.newMnemonic();
const childrenInfo = HDWallet.generate(mnemonic)({offset: 0, limit: 10});

log(style.bgGreenBright('[generate] childrenInfo'));
log(childrenInfo);
