import server from "./server";
import { getAddress } from '../utils';

function Wallet({ setPrivateKey, balance, setBalance }) {
  const dummyWallets = [
    '245242acea5c3afb83b4ebd247579e5bfced93812a2e66fe24581cd2f289286c',
    'a93f71e69ac19f82106f99a6f389cabb3b661e1f375643556da785b129d5c6df',
    'eabb10fd0db38240689acb1bd249d96165ae9c2de363bae1c770d59dadcb55e4',
  ];

  async function onChange(evt) {
    const index = evt.target.value;
    const privateKey = dummyWallets[index];
    setPrivateKey(privateKey);
    if (privateKey) {
      const address = getAddress(privateKey);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
      </label>
      <select name="addresses" id="wallet-select" onChange={onChange}>
        <option value="">--Please select a wallet--</option>
        {
          dummyWallets.map((privateKey, index) => {
            const address = getAddress(privateKey);
            return (<option key={index} value={index}>{address.slice(0,8) + '...' + address.slice(-8)}</option>)
          })
        }
      </select>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
