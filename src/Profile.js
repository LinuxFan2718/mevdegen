import { useState, useEffect } from 'react';
import { Card, ListGroup, Nav } from 'react-bootstrap'

const Profile = ({address}) => {
  const [chainId, setChainId] = useState("")
  const readChainId = async () => {
    const { ethereum } = window;
      if (!ethereum) {
        return;
      }
    const myChainId = await ethereum.request({ method: 'eth_chainId' });
    setChainId(myChainId);
  }
  useEffect(() => {
    readChainId();
  });

  return(
    <>
    { address ?
      (
        <Card className="profile">
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Wallet</strong> {address}</ListGroup.Item>
            <Nav.Link href="https://chainlist.org/"><strong>Chain Id</strong> {parseInt(chainId)}</Nav.Link>
          </ListGroup>
        </Card>
      ) : (
        <>No wallet connected.</>
      )
    }
  </>
  )
}

export default Profile