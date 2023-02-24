import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

const getAddress = (privateKey) => {
  const publicKey = secp.getPublicKey(privateKey);
  const address = keccak256(publicKey.slice(1));
  return toHex(address);
};

const hashMessage = (message) => {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
};

const signMessage = async (privateKey, message) => {
  const messageHash = hashMessage(message);
  return secp.sign(messageHash, privateKey, { recovered: true });
};

export { getAddress, hashMessage, signMessage };
