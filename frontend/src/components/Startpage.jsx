import React from 'react';
import styles from './Startpage.module.css';
import { Home, CreditCard, Building2, Hammer } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Startpage = () => {
  return (
    <div className={`container-fluid ${styles.startPage}`}>
      <section className="row g-4 mt-4">
        <div className="col-md-6">
          <div className={`p-4 ${styles.heroBox}`}>
            <h2>Ready-made frame house from 100 m² turnkey in 2 months</h2>
            <p>We build turnkey frame houses based on your individual project. 5-year warranty included.</p>
            <button className="btn btn-dark mt-3">Submit Request</button>
          <div className={`mt-4 ${styles.statsContainer}`}>
            <img src="locations/house.png" alt="House promo" className={`img-fluid ${styles.statsImage}`} />

            <div className="d-flex justify-content-between mt-4 px-4 py-3 bg-white shadow rounded">
              <div className="text-center">
                <h4>65+</h4>
                <p>Homes built</p>
              </div>
              <div className="text-center">
                <h4>7+</h4>
                <p>Years in business</p>
              </div>
              <div className="text-center">
                <h4>180+</h4>
                <p>Satisfied clients</p>
              </div>
            </div>
          </div>

          </div>
        </div>
        <div className="col-md-6">
          <img src="locations/landinghomes.jpg" alt="Modern House" className={`img-fluid ${styles.heroImage}`} />
        </div>
      </section>

      <section className="mt-5">
        <h3>We build homes using frame technology</h3>
        <div className="row mt-4 align-items-center">
          <div className="col-md-6">
            <img src="locations/landinghome1.jpg" alt="Frame Structure" className="img-fluid" />
          </div>
          <div className="col-md-6">
            <ul className={styles.benefitsList}>
              <li><strong>High durability:</strong> Frame made from kiln-dried planed timber</li>
              <li><strong>Accurate timelines:</strong> Project delivered exactly on time</li>
              <li><strong>No shrinkage:</strong> Move in immediately after construction</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h3>Our 2024 Property Catalog</h3>
        <div className="d-flex overflow-auto mt-3">
          <div className={styles.catalogCard}>
            <img src="locations/landinghome2.jpg" alt="House 77m²" className="img-fluid" />
            <p>Frame House, 77m²<br/>from 3,000,000 ₽</p>
          </div>
          <div className={styles.catalogCard}>
            <img src="locations/landinghome3.jpg" alt="House 88m²" className="img-fluid" />
            <p>Frame House, 88m²<br/>from 3,500,000 ₽</p>
          </div>
          <div className={styles.catalogCard}>
            <img src="locations/landinghome4.jpg" alt="House 100m²" className="img-fluid" />
            <p>Frame House, 100m²<br/>from 4,000,000 ₽</p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h3>We offer various payment methods</h3>
        <div className="row mt-3 text-center">
          <div className="col-md-3">
            <CreditCard size={32} />
            <p>Mortgage</p>
          </div>
          <div className="col-md-3">
            <Building2 size={32} />
            <p>Maternity capital</p>
          </div>
          <div className="col-md-3">
            <Hammer size={32} />
            <p>Government subsidies</p>
          </div>
          <div className="col-md-3">
            <Home size={32} />
            <p>Cashless payments</p>
          </div>
        </div>
      </section>

      <section className="mt-5 mb-5">
        <h3>Three steps to your new home</h3>
        <div className="row text-center mt-4">
          <div className="col-md-4">
            <p><strong>Consultation & Design</strong><br/>We assess your needs and create a custom project</p>
          </div>
          <div className="col-md-4">
            <p><strong>Construction</strong><br/>We complete the build on time</p>
          </div>
          <div className="col-md-4">
            <p><strong>Move-In</strong><br/>You receive the keys and settle into your new home</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Startpage;
