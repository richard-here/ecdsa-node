import secp from 'ethereum-cryptography/secp256k1.js';
import { toHex } from 'ethereum-cryptography/utils.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';

const privateKey = secp.utils.randomPrivateKey();
console.log('Private key:', toHex(privateKey));
const publicKey = secp.getPublicKey(privateKey);
console.log('Public key:', toHex(publicKey));
const address = keccak256(publicKey.slice(1));
console.log('Address:', toHex(address));