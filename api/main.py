import os
from dotenv import load_dotenv
from typing import Union, List
from fastapi import (
    FastAPI,
    UploadFile,
    Response,
    status
)
from fastapi.middleware.cors import CORSMiddleware
from tensorflow import (
    convert_to_tensor,
    uint8, 
    float32,
    saved_model
)
import numpy as np
import cv2

load_dotenv() 

CLASS_NAMES = ['benign', 'early', 'pre', 'pro']

MODEL_NAME = "clahe-balanced-model"

model = saved_model.load(f"models/{MODEL_NAME}").signatures['serving_default']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ['ALLOW_ORIGIN']
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))

@app.post("/predicts")
async def predicts(images: List[UploadFile], response: Response):
    # Check MIME Type make sure that file is image
    for image in images:
        if image.content_type not in ('image/jpeg', 'image/png'):
            response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
            return { 'message' : 'Just can receive image file type'}

    input_tensors = []

    for i, image in enumerate(images):
        arr = np.asarray(bytearray(await image.read()), dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

        input_tensors.append(img)

    predictions = []
    for i, input_tensor in enumerate(input_tensors):
        # clahe preprocessing
        lab = cv2.cvtColor(input_tensor, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)

        l = clahe.apply(l)
        lab = cv2.merge([l, a, b])

        img = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)

        # resize and normalization (from int to float 0-1)
        img = cv2.resize(img, (224, 224))
        img = convert_to_tensor([img / 255], dtype=float32)

        # predict
        pred = model(img)
        print(pred)
        output_data = np.round(pred['result'].numpy() * 100, 2).tolist()
        print(output_data)

        predictions.append({ 
            "filename": images[i].filename,
            "scores": {clas:output_data[0][i] for i, clas in enumerate(CLASS_NAMES) }
        })

    return {
        "model": MODEL_NAME,
        "predictions": predictions
    }