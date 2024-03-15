from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from slugify import slugify
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Food(BaseModel):
    price: int
    calorie: int
    model: str

class Hotel(BaseModel):
    food: list[Food]
    name: str

'''
hotel-slug:
    name:
    food:
        price:
        calorie:
        3d_model:


'''

data = {
    "aka-hotel": {
        "name": "Akarsh",
        "food": []
    }
}

live_data = {

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
        "food": []
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

