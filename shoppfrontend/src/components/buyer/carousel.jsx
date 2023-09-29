import Carousel from 'react-bootstrap/Carousel';
import Carousel1 from '../../img/carousel1.jpg';
import Carousel2 from '../../img/carousel2.jpg';
import Carousel3 from '../../img/carousel3.jpg';
import { Image } from 'react-bootstrap';

export function CarouselMain() {
  return (
    <Carousel className='carousel-custom'>
      <Carousel.Item>
        <Image src={Carousel1} alt="" className="col-12 carousel-image" fluid/>
        <Carousel.Caption>
          
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img src={Carousel2} alt="" className="col-12 carousel-image" />

        <Carousel.Caption>
         
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
      <img src={Carousel3} alt="" className="col-12 carousel-image" />

        <Carousel.Caption>
          
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
