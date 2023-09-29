import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import review from '../img/cart.jpg'

export function CardLoading() {
  return (
    <div className="d-flex justify-content-around">

      
      <Card style={{ width: '13rem' }}>
        <Card.Img variant="top" src={review} />
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="" className="btnOren" xs={6} />
        </Card.Body>
      </Card>
      <Card style={{ width: '13rem' }}>
        <Card.Img variant="top" src={review} />
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="" className="btnOren" xs={6} />
        </Card.Body>
      </Card>
      <Card style={{ width: '13rem' }}>
        <Card.Img variant="top" src={review} />
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="" className="btnOren" xs={6} />
        </Card.Body>
      </Card>
    </div>
  );
}
