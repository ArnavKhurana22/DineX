"use client";
import { useState, useEffect } from "react";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: "400",
});

/* <section className="h-screen bg-black border rounded-3xl"><model-viewer src="/arduino_uno.glb" ar camera-controls className="border" style={{ width: "100%", height: "100%" }}></model-viewer></section> */

export default function Page({ params }) {
  const { hotel, table } = params;
  const [menu, setMenu] = useState([]);
  const [hotelName, setHotelName] = useState("");
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/hotel/${hotel}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMenu(data.food);
        setHotelName(data.name);
      });
  }, [hotel, table]);

  // update menu every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/hotel/${hotel}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMenu(data.food);
          setHotelName(data.name);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-base-300 p-2">
      <h1 className={raleway.className + " text-center text-2xl"}>
        {hotelName} {"->"} {table}
      </h1>
      <div className="carousel rounded-box bg-base-200 h-full w-full">
        {menu.map((item, index) => {
          return (
            <div
              className="carousel-item w-5/6 h-full p-2 grid grid-cols-1 place-items-center gap-2"
              key={index}
            >
              <div className="w-full h-full bg-black rounded-xl">
                <model-viewer
                  src={item.model}
                  ar
                  camera-controls
                  className=""
                  style={{ width: "100%", height: "100%" }}
                ></model-viewer>
              </div>
              <div
                className={
                  raleway.className + " bg-black w-full h-full rounded-xl"
                }
              >
                <div className="place-items-center p-4 h-full">
                  <h1 className="text-3xl rounded-xl bg-base-100 w-full text-center p-4">
                    {item.name}
                  </h1>
                  <div className="w-full py-2 grid grid-cols-2 gap-2">
                    <div className=" bg-base-100 w-full rounded-xl p-4">
                      <h2 className="text-2xl text-center">Price</h2>
                      <p className="text-md text-center">{item.price}</p>
                    </div>
                    <div className=" bg-base-100 w-full rounded-xl p-4">
                      <h2 className="text-2xl text-center">Calorie</h2>
                      <p className="text-md text-center">{item.calorie}</p>
                    </div>
                  </div>
                  <div className="bg-base-100 rounded-xl p-2">
                    <h2 className="text-2xl text-center">Recipe</h2>
                    <div className="grid place-items-center w-full">
                      <div className="w-full bg-base-300 rounded-xl h-48">
                        {item.recipe.map((ingredient, index) => {
                          return (
                            <p className="text-md text-center" key={index}>
                              {ingredient}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid place-items-center  w-full py-2">
                    <button
                      className="bg-red-400 p-2 w-full rounded-xl"
                      onClick={() => {
                        fetch(
                          process.env.NEXT_PUBLIC_BACKEND_URL +
                            `/add_live_data/${hotel}/${table}`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(item),
                          }
                        );
                      }}
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
