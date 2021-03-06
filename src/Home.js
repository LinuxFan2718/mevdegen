import { Button, Card } from 'react-bootstrap';

function Home() {
  return (
    <Card>
      <Card.Header as="h5">Home</Card.Header>
      <Card.Body>
        <Card.Title>What is this website?</Card.Title>
        <Card.Text>
          MEV Degen is a tool for MEV seachers to find profitable opportunities.
          To learn what MEV and searchers are, read The 0 to 1 Guide for MEV.
        </Card.Text>
        <Button variant="primary" href="https://calblockchain.mirror.xyz/c56CHOu-Wow_50qPp2Wlg0rhUvdz1HLbGSUWlB_KX9o">
          The 0 to 1 Guide for MEV
        </Button>
      </Card.Body>
    </Card>
  )
}

export default Home;