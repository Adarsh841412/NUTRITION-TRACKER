import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Food from "./Food";
import Headers from "./Header";

export function Track() {
  const loggedData = useContext(UserContext);
  const [foodItems, setFoodItems] = useState([]);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function searchFood(event) {
    const foodName = event.target.value.trim();
    setSearchQuery(foodName);

    if (foodName.length !== 0) {
      setLoading(true);
      fetch(`http://localhost:8000/foods/${foodName}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + loggedData.loggedUser.token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.message === undefined) {
            setFoodItems(data);
          } else {
            setFoodItems([]);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setFoodItems([]);
    }
  }

  return (
    <section className="track-container">
      <Headers />

      <div className="track-content">
        <div className="search-wrapper">
          <input
            className="search-inp"
            placeholder="Search food item..."
            type="search"
            onChange={searchFood}
            name="food"
          />

          {loading && <p className="info-text">🔍 Searching...</p>}

          {searchQuery.length > 0 && foodItems.length === 0 && !loading && (
            <p className="info-text">❌ No matching food found.</p>
          )}

          {foodItems.length > 0 && (
            <div className="search-results">
              {foodItems.map((item) => (
                <p
                  className="item"
                  key={item._id}
                  onClick={() => setFood(item)}
                >
                  🍽 {item.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {food ? (
          <Food food={food} />
        ) : (
          <div className="placeholder">
            <h2>Welcome to NutriTrack! 👋</h2>
            <p>Start by searching a food item above to track its nutrition.</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
              alt="Healthy food"
              style={{ width: "120px", marginTop: "1rem" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
