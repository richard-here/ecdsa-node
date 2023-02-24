import { useState } from "react";
import server from "./server";
import { getAddress, hashMessage, signMessage }from '../utils';

function Transfer({ privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = {
        sender: getAddress(privateKey),
        amount: parseInt(sendAmount),
        recipient,
      };
      const stringMessage = JSON.stringify(message);
      const messageHash = hashMessage(stringMessage);
      const signature = await signMessage(privateKey, stringMessage);
      const result = await server.post(`send`, {
        signature,
        messageHash,
        sender: getAddress(privateKey),
        amount: parseInt(sendAmount),
        recipient,
      });
      const {
        data: { balance },
      } = result; 
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
