import * as btc from '@scure/btc-signer';
import { buildTransactionDeposit } from '../src/index'
import { bytesToHex as toHex, hexToBytes } from '@noble/hashes/utils';


let testCases = [
  {
    stxAddressHex: '0000000000000000000000000000000000000000000000000000000000000000',
    depositWalletHex: 'ea074116d46dd11ae7b9c027690a6c50d0ed7e3c0cbcd971e1847a8b62144dfb',
    txid: '2f295f90cb3f960c60279b9c7545ff9dacc787f20f52dc9d777aadfcafee66fc',
    outputZeroScriptHex: '6a2300003c0000000000000000000000000000000000000000000000000000000000000000',
    outputOneScriptHex: '5120ea074116d46dd11ae7b9c027690a6c50d0ed7e3c0cbcd971e1847a8b62144dfb'
  },
  {
    stxAddressHex: '0000000000000000000000000000000000000000000000000000000000000000',
    depositWalletHex: '21aede249c005890fcd21491b0d8dda17d6f0ec723f26925f3905c641ef0b7db',
    txid: '801e1be617e01177874a7032cc102b745bfa619a7aed4cee5fafbfb92eff5446',
    outputZeroScriptHex: '6a2300003c0000000000000000000000000000000000000000000000000000000000000000',
    outputOneScriptHex: '512021aede249c005890fcd21491b0d8dda17d6f0ec723f26925f3905c641ef0b7db'
  },
  {
    stxAddressHex: '0000000000000000000000000000000000000000000000000000000000000000',
    depositWalletHex: 'f7abc7eac22eb13b86ae595b540cbaa578918ef4c3c5496e6a64484449f1d7f6',
    txid: '6255dd69b0f67c527d49250d9032723fbb9a790d57cf2866ed35ff96b32fe3bc',
    outputZeroScriptHex: '6a2300003c0000000000000000000000000000000000000000000000000000000000000000',
    outputOneScriptHex: '5120f7abc7eac22eb13b86ae595b540cbaa578918ef4c3c5496e6a64484449f1d7f6'
  },
  {
    stxAddressHex: '0000000000000000000000000000000000000000000000000000000000000000',
    depositWalletHex: '21aede249c005890fcd21491b0d8dda17d6f0ec723f26925f3905c641ef0b7db',
    txid: '801e1be617e01177874a7032cc102b745bfa619a7aed4cee5fafbfb92eff5446',
    outputZeroScriptHex: '6a2300003c0000000000000000000000000000000000000000000000000000000000000000',
    outputOneScriptHex: '512021aede249c005890fcd21491b0d8dda17d6f0ec723f26925f3905c641ef0b7db'
  },
  {
    stxAddressHex: '0000000000000000000000000000000000000000000000000000000000000000',
    depositWalletHex: 'ea074116d46dd11ae7b9c027690a6c50d0ed7e3c0cbcd971e1847a8b62144dfb',
    txid: '2f295f90cb3f960c60279b9c7545ff9dacc787f20f52dc9d777aadfcafee66fc',
    outputZeroScriptHex: '6a2300003c0000000000000000000000000000000000000000000000000000000000000000',
    outputOneScriptHex: '5120ea074116d46dd11ae7b9c027690a6c50d0ed7e3c0cbcd971e1847a8b62144dfb'
  },
]

describe('buildTransactionDeposit', () => {
  it('should build valid transaction deposit PSBTs', () => {

    const satoshis = BigInt(1000);
    for (let i = 0; i < testCases.length; i++) {
        const {depositWalletHex, stxAddressHex, txid, outputZeroScriptHex, outputOneScriptHex } = testCases[i];

        // values pulled from output of successful rust test that communicates with bitcoind to test transaction acceptance in mempool 
        const depositWalletPublicKey = Buffer.from(hexToBytes(depositWalletHex));
        const stxAddress = Buffer.from(hexToBytes(stxAddressHex));

        const prevOutput = { txid, index: 0 };

        const psbt = buildTransactionDeposit(satoshis, depositWalletPublicKey, stxAddress, prevOutput);
        expect(psbt).toBeDefined();

        const txn = btc.Transaction.fromPSBT(psbt);
        expect(txn).toBeDefined();

        const input = txn.getInput(0);
        const output_0 = txn.getOutput(0);
        const output_1 = txn.getOutput(1);

        expect(toHex(input.txid)).toEqual(txid);
        expect(toHex(output_0.script)).toEqual(outputZeroScriptHex);
        expect(toHex(output_1.script)).toEqual(outputOneScriptHex);
    }
  });
});
