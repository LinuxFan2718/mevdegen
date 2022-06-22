import { Nav } from 'react-bootstrap';

export const ConnectMetamaskButtonComponent = () => {
  const address = 'useAddress()';
  const derp = console.log('hi');
  return (
    <>
    {address ? (
      <Nav.Link as="button" onClick={derp}>Disconnect {address.substring(0,6)}...</Nav.Link>
    ) : (
      <Nav.Link as="button" onClick={derp}>Connect Metamask Wallet</Nav.Link>
    )}
    </>
  );
};
