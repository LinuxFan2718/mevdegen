import { Card, ListGroup } from 'react-bootstrap'

const Profile = ({address}) => {
  return(
    <>
    { address ?
      (
        <Card className="profile">
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Wallet</strong> {address}</ListGroup.Item>
            <ListGroup.Item><strong>Chain Name</strong> {'chain.name'}</ListGroup.Item>
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