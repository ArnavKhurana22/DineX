from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from slugify import slugify
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = FastAPI()
analyser = SentimentIntensityAnalyzer()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

o_id = 0

class Food(BaseModel):
    price: int
    calorie: int
    model: str
    name: str

class Hotel(BaseModel):
    food: list[Food]
    name: str

class Feedback(BaseModel):
    feedback: str


data = {
    "aka-hotel": {
        "name": "aka hotel",
        "food": [
            {
                "price": 100,
                "calorie": 200,
                "model": "burger",
                "name": "burger",
                "count": 0
            },
            {
                "price": 200,
                "calorie": 300,
                "model": "pizza",
                "name": "pizza",
                "count": 0
            }
        ],
        "feedback": [
            {
                "feedback": "The food was great",
                "sentiment": True
            }
        ]
    }
}

live_data = {
    "aka-hotel": [
        {
            "name": "burger",
            "completed": False,
            "price": 100,
            "calorie": 200,
            "table": 1,
            "_id": 0
        }
    ]
}

@app.get("/")
async def root():
    return { "message": "hello world"}

@app.get("/hotel/{slug}")
async def get_hotel_detail(slug: str):
    return data.get(slug, {})

@app.post("/add_hotel")
async def add_hotel(hotel: str):
    hotel_slug = slugify(hotel)
    data[hotel_slug] = {
        "name": hotel,
        "food": [],
        "feedback": []
    }

@app.post("/add_food/{hotel}")
async def add_food(food: Food, hotel: str):
    if hotel not in data:
        return {
            "status": False,
            "message": "Hotel not found"
        }
    food = dict(food)
    food.update({"count": 0})
    data[hotel]["food"].append(dict(food))
    return {
        "status": True,
        "message": "Food added successfully",
        "hotel": data[hotel]
    }


@app.get("/live_data/{hotel}")
async def get_live_data(hotel: str,):
    return [i for i in live_data.get(hotel, [])]

@app.post("/add_live_data/{hotel}/{table}")
async def add_live_data(food: Food, hotel: str, table: int):
    if hotel not in data:
        return {
            "status": False,
            "message": "Hotel not found"
        }
    global o_id
    o_id += 1
    food = dict(food)
    food.update({"table": table, "completed": False, "_id": o_id})
    live_data[hotel].append(food)
    return {
        "status": True,
        "message": "Data added successfully",
        "hotel": live_data[hotel]
    }

@app.post("/add_feedback")
async def add_feedback(feedback: Feedback, hotel: str):
    if hotel not in data:
        return {
            "status": False,
            "message": "Hotel not found"
        }
    predict = analyser.polarity_scores(feedback.feedback)
    data[hotel]["feedback"].append({
        "feedback": feedback.feedback,
        "sentiment": predict["pos"] >= predict["neg"]
    
    })
    return {
        "status": True,
        "message": "Feedback added successfully",
        "hotel": data[hotel]
    }

@app.put("/live_data/{hotel}/{order_id}")
async def live_data_update(hotel: str, order_id: int):
    for i in live_data[hotel]:
        if i["_id"] == order_id:
            i["completed"] = True
            return {
                "status": True,
                "message": "Data updated successfully",
                "hotel": live_data[hotel]
            }
    return {
        "status": False,
        "message": "Data not found"
    }