import { Link } from "react-router-dom";


const Favourites = () => {
  return (
    <div className="card">
      <div className="fav-header">
        <h4>Most Favourite Items</h4>
        <button><Link to="/adminfoodproduct" >See All</Link></button>
      </div>

      <div className="fav-grid">
        <div className="fav-card">
          <img src="/Burger.jpg" />
          <h4>Burger</h4>
          <span>$12.40</span>
        </div>

        <div className="fav-card">
          <img src="/Cold drink.jpg" />
          <h4>Cold Drink</h4>
          <span>$24.64</span>
        </div>
      </div>
    </div>
  );
};

export default Favourites;
