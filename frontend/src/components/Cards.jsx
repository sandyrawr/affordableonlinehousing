import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>RENT ANYWHERE</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='locations/gorkha.jpg'
              text='Gorkha'
            //   label='Adventure'
              path='/services'
            />
            <CardItem
              src='locations/ktm.jpg'
              text='Kathmandu'
            //   label='Luxury'
              path='/services'
            />
            <CardItem
              src='locations/chitwan.jpg'
              text='Chitwan'
            //   label='Luxury'
              path='/services'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='locations/btm.jpg'
              text='Birtamode'
            //   label='Mystery'
              path='/services'
            />
            <CardItem
              src='locations/dharann.jpg'
              text='Dharan'
            //   label='Adventure'
              path='/products'
            />
            <CardItem
              src='locations/pokhara.jpg'
              text='Pokhara'
            //   label='Adrenaline'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;