"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Orbitron } from "next/font/google";
import { PieChart, Pie, Tooltip } from "recharts";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400"
})

function getCount(data) {
  return [
    {label: "Positive", value: data.filter((feedback) => feedback.sentiment).length},
    {label: "Negative", value: data.filter((feedback) => !feedback.sentiment).length}
  ]

}

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginScreenMessage, setLoginScreenMessage] = useState("");
  const [admin, setAdmin] = useState(1)
  const [orders, setOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [live_data, setLiveData] = useState([]);

  // update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // if (!screen) return
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/live_data/aka-hotel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data => {
        setLiveData(data);
        setOrders(data.filter((data) => !data.completed))
        setPastOrders(data.filter((data) => data.completed))
                
      }).catch(err => {
        console.error(err);      
      })
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/hotel/aka-hotel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data => {
        console.log(getCount(data.feedback))
        setFeedbacks(data.feedback);

      }).catch(err => {
        console.error(err);      
      
      })
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={" h-full bg-black p-1 lg:p-4"}>
      {/* <section className="h-screen bg-black border rounded-3xl"><model-viewer src="/arduino_uno.glb" ar camera-controls className="border" style={{ width: "100%", height: "100%" }}></model-viewer></section> */}
      { screen === 0 && (
      <div className={orbitron.className + " grid place-items-center h-screen"}>
        <div className="bg-slate-500 p-4 rounded-xl">
          <h1 className="text-center text-lg lg:text-6xl p-1 lg:p-4">Hello world! :D</h1>
          <div className="grid p-1 gap-1">
            <input type="text" placeholder="Username" className="w-full p-2 rounded-xl" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-2 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <p className="text-red-500">{loginScreenMessage}</p>
          <button className="w-full p-2" onClick={() => {
            if (username === "admin" && password === "admin") {
              setScreen(1);
            } else {
              setLoginScreenMessage("Invalid username or password");
            }
          }}>Login</button>
        </div>        
      </div>        
      )}
      { screen === 1 && (
        <div className="grid grid-cols-8 gap-2 h-screen">
          <div className="w-full h-full  bg-slate-900 rounded-2xl col-span-2">
            <div className="grid grid-cols-1 text-left gap-2 p-4">
              <button className="bg-slate-800 text-white rounded-xl p-4 hover:scale-95 duration-300" onClick={() => setAdmin(1)}>General</button>
              <button className="bg-slate-800 text-white rounded-xl p-4 hover:scale-95 duration-300" onClick={() => setAdmin(2)}>Past Orders</button>
              <button className="bg-slate-800 text-white rounded-xl p-4 hover:scale-95 duration-300" onClick={() => setAdmin(3)}>Statistics</button>
              <button className="bg-slate-800 text-white rounded-xl p-4 hover:scale-95 duration-300" onClick={() => setAdmin(4)}>Update</button>
            </div>
          </div>
          <div className="w-full h-full bg-slate-900 rounded-2xl col-span-6 p-4">
            { admin === 1 && (
              <div className="">
                <h1 className={orbitron.className + " text-6xl text-center p-4"}>Orders</h1>
                <div className="grid grid-cols-1 place-items-center gap-2 w-full">
                  <div className="bg-slate-950 p-4 rounded-2xl w-full">
                    <h2 className={orbitron.className + " text-4xl text-center p-4"}>Pending</h2>
                    <div className="grid gap-2 grid-cols-3 overflow-y-scroll">
                      {orders.map((order, index) => {
                        return (
                          <div className="bg-slate-800 rounded-xl p-2" key={index}>
                            <h3 className={" text-white p-2"}><span className="text-3xl">{order.name}</span> <br></br>➡️ Table: {order.table}</h3>
                            <button className="bg-slate-700 text-white p-2 rounded-xl" onClick={() => {
                              fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/live_data/aka-hotel/" + order._id, {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                  completed: true
                                })
                              }).then(response => response.json()).then(data => {
                                console.log(data);
                              }).catch(err => {
                                console.error(err);
                              })
                            }}>Complete</button>
                          </div>
                        )
                      })}
                    </div>
                    
                  </div>
                  
                </div>
              </div>
            )}
            { admin === 2 && (
              <div className="">
                <h1 className={orbitron.className + " text-6xl text-center p-4"}>Past Orders</h1>
                <div className="grid grid-cols-1 place-items-center gap-2 w-full">
                  <div className="bg-slate-950 p-4 rounded-2xl w-full">
                    <div className="grid gap-2 grid-cols-3 overflow-y-scroll">
                      {pastOrders.map((order, index) => {
                        return (
                          <div className="bg-slate-800 rounded-xl p-2" key={index}>
                            <h3 className={" text-white p-2"}><span className="text-3xl">{order.name}</span> <br></br>➡️ Table: {order.table}</h3>                            
                          </div>
                        )
                      })}
                    </div>
                    
                  </div>
                </div>
              </div>
            )}
            { admin === 3 && (
              <div className="">
                <h1 className={orbitron.className + " text-6xl text-center p-4"}>Statistics</h1>
                <div className="grid grid-cols-1 place-items-center gap-2 w-full">
                  <div className="bg-slate-950 p-4 rounded-2xl w-full">
                    <div className="grid gap-2 grid-cols-3">
                      <div className="bg-slate-800 rounded-xl p-2">
                        <h3 className={" text-white p-2"}><span className="text-3xl">{live_data.length}</span> <br></br>➡️ Orders</h3>                            
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2">
                        <h3 className={" text-white p-2"}><span className="text-3xl">{pastOrders.length}</span> <br></br>➡️ Completed Orders</h3>                            
                      </div>
                      <div className="bg-slate-800 rounded-xl p-2">
                        <h3 className={" text-white p-2"}><span className="text-3xl">{feedbacks?.length || 0}</span> <br></br>➡️ Feedbacks</h3>                            
                      </div>
                      <div className="w-full h-full col-span-3 bg-slate-800 rounded-xl p-2 grid place-items-center">
                        <PieChart width={400} height={400}>
                          <Pie dataKey="value" isAnimationActive={false} data={getCount(feedbacks)} cx="50%" cy="50%" outerRadius={150} fill="#2990ff" nameKey={"label"} />
                          <Tooltip />
                        </PieChart>
                      </div>
                    </div>

                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main >
  );
}
