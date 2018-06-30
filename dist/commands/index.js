"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var _commander = _interopRequireDefault(require("commander"));

var _collect = require("./collect");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _collect.collectCmd)(_commander.default);

const start = program => {
  program.version('0.0.1').description('ETH Wallet Utils');
  program.parse(process.argv);
};

exports.start = start;
start(_commander.default);