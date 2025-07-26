import { useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";


export default function Food(props) {
  const [eatenQuantity, setEatenQuantity] = useState(100);
  const [food, setFood] = useState({});
  const [foodInitial, setFoodInitial] = useState({});

  let loggedData=useContext(UserContext);
  console.log(food);

  useEffect(() => {
    console.log(props.food);
    setFood(props.food);
    setFoodInitial(props.food);
  }, [props.food]);

  //   function handleInput(event){

  // setQuantity(Number(event.target.value));

  //   }

  function calculateMacros(event) {
    if (event.target.value.length != 0) {
      let quantity = Number(event.target.value);
      setEatenQuantity(quantity);
      let copyFood = { ...food };

      (copyFood.protein = (foodInitial.protein * quantity) / 100),
        (copyFood.carbohydrates = (foodInitial.carbohydrates * quantity) / 100),
        (copyFood.fat = (foodInitial.fat * quantity) / 100),
        (copyFood.fiber = (foodInitial.fiber * quantity) / 100),
        (copyFood.calories = (foodInitial.calories * quantity) / 100);
      setFood(copyFood);
    }
  }

function trackingFoodItem() {
  let trackedItem = {
    userId: loggedData.loggedUser.userid,
    foodId: food._id,
    details: {
      protein: food.protein,
      carbohydrates: food.carbohydrates,
      fat: food.fat,
      fiber: food.fiber,
      calories: food.calories,
    },
    quantity: eatenQuantity,
  };

  console.log(trackedItem);
  fetch("http://localhost:8000/track", {
    method: "POST",
    body: JSON.stringify(trackedItem),

    headers: {
      "Authorization": `Bearer ${loggedData.loggedUser.token}`,
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err)=>{
      console.log(err)
    })
}


  return (
    <div className="food">
      <div className="food-img">
        <img className="food-image" src={food.imageUrl} />
      </div>
      <h2>
        {food.name}({food.calories}kcal for {eatenQuantity}Gm)
      </h2>

      <div className="nurtrient">
        <p className="n-title">Protein</p>
        <p className="n-value">{food.protein}g</p>
      </div>

      <div className="nurtrient">
        <p className="n-title">Carbs</p>
        <p className="n-value">{food.carbohydrates}g</p>
      </div>

      <div className="nurtrient">
        <p className="n-title">Fat</p>
        <p className="n-value">{food.fat}g</p>
      </div>

      <div className="nurtrient">
        <p className="n-title">Fibre</p>
        <p className="n-value">{food.fiber}g</p>
      </div>


<div className="track-control"> 


      <input
        className="inp"
        type="number"
        placeholder="Quantity in gram"
        onChange={calculateMacros}
      />

      <button className="btn" onClick={trackingFoodItem}>Track</button>

      </div>
    </div>
  );
}
