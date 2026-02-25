import React, { useState } from "react";
import {
  Utensils,
  ArrowRight,
  Star,
  Clock,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";



const Homepage = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(null);

  const handleOrder = (title) => {
    setClicked(title);
    setTimeout(() => setClicked(null), 1200);
  };

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg hero-bg-1"></div>
        <div className="hero-bg hero-bg-2"></div>

        <div className="hero-container">

          {/* LEFT */}
          <div className="hero-left fade-in">
            <div className="rating-pill">
              <Star size={16} /> Rated 4.8 by 5k+ Customers
            </div>

            <h1>
              Savor the Best
              <span>Vegetarian Delicacies</span>
            </h1>

            <p>
              Enjoy fresh, healthy, and delicious vegetarian dishes crafted by
              top chefs. Delivered hot & fast — straight to your table.
            </p>

            <div className="features">
              <Feature icon={<Clock size={16} />} label="Fast Delivery" />
              <Feature icon={<Award size={16} />} label="Premium Quality" />
              <Feature icon={<Utensils size={16} />} label="100% Vegetarian" />
            </div>

            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate("/menu")}
              >
                Explore Menu <ArrowRight size={18} />
              </button>
              <button className="btn-outline">Reserve Table</button>
            </div>

            <div className="stats">
              <Stat number="50K+" label="Happy Customers" />
              <Stat number="3" label="Branches" />
              <Stat number="49+" label="Dishes" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-right slide-up">
            <div className="food-card">
              <img
                src="hero.png"
                alt="Delicious Food"
                style={{ width: "220px" }}
              />
            </div>

            <div className="food-card orange">
              <img
                src="kajukatali.jpg"
                alt="Veg Burger"
                style={{ width: "200px" }}
              />
            </div>

            <div className="offer-pill">
              Free Delivery Above ₹500
            </div>
          </div>

        </div>
      </section>

      {/* POPULAR */}
      <section className="popular">
        <h2>Popular Dishes</h2>

        <div className="dish-grid">
          <DishCard
            title="Kaju Katali"
            img="kajukatali.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Veg Burger"
            img="burger2.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Masala Dosa"
            img="Masladosa.jpeg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Rasgula"
            img="rasgula.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Halwa"
            img="halwa.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Cake"
            img="cake.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Idili"
            img="idili.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
          <DishCard
            title="Pastery"
            img="pastery.jpg"
            active={clicked}
            onOrder={handleOrder}
          />
        </div>
      </section>
    </div>
  );
};

/* SMALL COMPONENTS */

const Feature = ({ icon, label }) => (
  <div className="feature">
    {icon}
    <span>{label}</span>
  </div>
);

const Stat = ({ number, label }) => (
  <div className="stat">
    <h3>{number}</h3>
    <p>{label}</p>
  </div>
);

const DishCard = ({ title, img, onOrder, active }) => (
  <div className="dish-card">
    <div className="dish-img">
      <img src={img} alt={title} />
      <span className="rating">⭐ 4.7</span>
    </div>

    <div className="dish-body">
      <h3>{title}</h3>
      <p>Fresh • Healthy • Hot</p>
      <strong>₹199</strong>

      <button
        className={active === title ? "added" : ""}
        onClick={() => onOrder(title)}
      >
        {active === title ? "Added ✔" : "Order Now"}
      </button>
    </div>
  </div>
);

export default Homepage;
