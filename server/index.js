const express = require("express");
const app = express();
const cors = require("cors");
const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "5644e5df3297586060a64dd73cb6c48e29483ec1806403b2a40a62f2b6d58825": 100,
  "9c5f9310634f6189cbd8b811f0d40795788107c2f10d2f9f7fe104e8aa0e6df4": 50,
  "bc70218f580e564a196a760f0cdfdc79bf3065f1c551b77caf4e5589cc97c22f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, messageHash, sender, recipient, amount } = req.body;

  let messageHashUint8Array = [];
  for (let key in messageHash) {
    messageHashUint8Array.push(messageHash[key]);
  }
  messageHashUint8Array = new Uint8Array(messageHashUint8Array);

  let signatureUint8Array = [];
  for (let key in signature[0]) {
    signatureUint8Array.push(signature[0][key]);
  }
  signatureUint8Array = new Uint8Array(signatureUint8Array);

  const publicKey = secp.recoverPublicKey(
    toHex(messageHashUint8Array),
    signatureUint8Array,
    signature[1]
  );

  const isVerified = secp.verify(signatureUint8Array, messageHashUint8Array, publicKey);
  if (!isVerified) {
    res.status(400).send({ message: "Signature not verified! "});
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);
  
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
