import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { Nav } from 'react-bootstrap';

export const ConnectMetamaskButtonComponent = () => {
  const connectWithMetamask = useMetamask();
  const disconnectWithMetamask = useDisconnect();
  const address = useAddress();
  return (
    <>
    {address ? (
      <Nav.Link as="button" onClick={disconnectWithMetamask}>Disconnect {address.substring(0,6)}...</Nav.Link>
    ) : (
      <Nav.Link as="button" onClick={connectWithMetamask}>Connect Metamask Wallet</Nav.Link>
    )}
    </>
  );
};
