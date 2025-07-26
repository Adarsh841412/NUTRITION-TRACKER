import { useEffect, useState, useContext } from "react";
import Headers from "./Header";
import { UserContext } from "../contexts/UserContext";
import NotFound from "./NotFound";

export default function Diet() {
  const [items, setItems] = useState([]);
  const loggedData = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  const [total, setTotal] = useState({
    totalCalories: 0,
    totalProteins: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalFibre: 0,
  });

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!loggedData.loggedUser) return;

    setIsLoading(true); // Start loading
    fetch(
      `http://localhost:8000/track/${loggedData.loggedUser.userid}/${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loggedData.loggedUser.token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setIsLoading(false); // Done loading
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false); // Even on error
      });
  }, [date, loggedData.loggedUser]);

  useEffect(() => {
    calculateTotal();
  }, [items]);

  function calculateTotal() {
    let totalCopy = {
      totalCalories: 0,
      totalProteins: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFibre: 0,
    };

    items.forEach((item) => {
      totalCopy.totalCalories += item.details.calories;
      totalCopy.totalCarbs += item.details.carbohydrates;
      totalCopy.totalProteins += item.details.protein;
      totalCopy.totalFibre += item.details.fiber;
      totalCopy.totalFats += item.details.fat;
    });

    setTotal(totalCopy);
  }

  if (!loggedData.loggedUser || isLoading) {
    return (
      <>
        <Headers />
        <section className="container diet-container">
          <p>Loading...</p>
        </section>
      </>
    );
  }

  return (
    <>
      <Headers />
      <section className="container diet-container">
        <div className="diet-controls">
          <label htmlFor="diet-date">Select Date: </label>
          <input
            id="diet-date"
            type="date"
            onChange={(e) => setDate(new Date(e.target.value))}
          />
        </div>

        {items.length > 0 ? (
          <>
            <div className="diet-items">
              {items.map((item) => (
                <div className="item-card" key={item._id}>
                  <h3>
                    {item.foodId.name} &nbsp; ({item.details.calories} kcal for{" "}
                    {item.quantity}g)
                  </h3>
                  <p>
                    Protein: {item.details.protein}g &nbsp; Carbs:{" "}
                    {item.details.carbohydrates}g &nbsp; Fats: {item.details.fat}g
                    &nbsp; Fiber: {item.details.fiber}g
                  </p>
                </div>
              ))}
            </div>

            <div className="total-summary">
              <h3>Daily Nutrition Summary</h3>
              <p>
                Total Calories: <strong>{total.totalCalories} kcal</strong> <br />
                Protein: <strong>{total.totalProteins}g</strong> &nbsp; Carbs:{" "}
                <strong>{total.totalCarbs}g</strong> &nbsp; Fats:{" "}
                <strong>{total.totalFats}g</strong> &nbsp; Fiber:{" "}
                <strong>{total.totalFibre}g</strong>
              </p>
            </div>
          </>
        ) : (
          <NotFound />
        )}
      </section>
    </>
  );
}
