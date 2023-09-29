import * as bitcoin from 'bitcoinjs-lib';
import * as btc from '@scure/btc-signer';
import * as ecc from "tiny-secp256k1";
import { hexToBytes } from '@noble/hashes/utils';


export function buildTransactionDeposit(
  satoshis: bigint,
  depositWalletPublicKey: Buffer | string,
  stxAddress: Buffer,
  prevOutput: { txid: string, index: number },
  network = btc.NETWORK
) {
  bitcoin.initEccLib(ecc);

  const pubkey = typeof depositWalletPublicKey === 'string'
      ? hexToBytes(depositWalletPublicKey)
      : depositWalletPublicKey || btc.TAPROOT_UNSPENDABLE_KEY;

  const p2tr: btc.P2TROut = {
      type: 'tr',
      script: btc.OutScript.encode({ type: 'tr', pubkey }),
      address: btc.Address(network).encode({ type: 'tr', pubkey }),
      // For tests
      tweakedPubkey: pubkey,
      // PSBT stuff
      tapInternalKey: pubkey,
  };

  const script = p2tr.script;

  if (!script) throw Error("Problem with deposit wallet address.");

  // Build a SIP-21 consensus compatible deposit transaction
  const sip21DepositData = Buffer.concat([Buffer.from(new Uint8Array([0, 0, 60])), stxAddress]);

  const opReturn = bitcoin.script.compile([
    bitcoin.opcodes.OP_RETURN,
    sip21DepositData,
  ]);
  
  const tx = new btc.Transaction({
    allowUnknownOutputs: true
  });

  tx.addInput({
    txid: prevOutput.txid,
    index: prevOutput.index,
  });
  
  tx.addOutput({
    amount: BigInt(0),
    script: opReturn,
  });
  
  tx.addOutput({
    script: script,
    amount: satoshis,
  });

  return tx.toPSBT()
} 