import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

function CardItem({ src, text, path }) {
  const navigate = useNavigate();
  
  return (
    <li className='cards__item' onClick={() => navigate(path)}>
      <div className='cards__item__link'>
        <figure className='cards__item__pic-wrap' data-category={text}>
          <img className='cards__item__img' alt={text} src={src} />
        </figure>
        <div className='cards__item__info'>
          <h5 className='cards__item__text'>{text}</h5>
        </div>
      </div>
    </li>
  );
}

function Cards() {
  const locations = [
    { name: 'Gorkha', image: 'locations/gorkha.jpg' },
    { name: 'Kathmandu', image: 'locations/ktm.jpg' },
    { name: 'Chitwan', image: 'locations/chitwan.jpg' },
    { name: 'Birtamode', image: 'locations/btm.jpg' },
    { name: 'Dharan', image: 'locations/dharann.jpg' },
    { name: 'Pokhara', image: 'locations/pokhara.jpg' }
  ];

  return (
    <div className='cards'>
      <h1>RENT ANYWHERE</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {locations.slice(0, 3).map((loc) => (
              <CardItem
                key={loc.name}
                src={loc.image}
                text={loc.name}
                path={`/search?location=${loc.name}`}
              />
            ))}
          </ul>
          <ul className='cards__items'>
            {locations.slice(3).map((loc) => (
              <CardItem
                key={loc.name}
                src={loc.image}
                text={loc.name}
                path={`/search?location=${loc.name}`}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;