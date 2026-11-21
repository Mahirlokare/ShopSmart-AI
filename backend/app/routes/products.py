from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from ..database import db
from ..schemas import ProductIn
from ..security import admin_user

router = APIRouter(prefix="/api/products", tags=["products"])

def serialize(doc):
    return {**doc, "id": str(doc.pop("_id"))}

@router.get("")
async def list_products(q: str = "", category: str = ""):
    query = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if category:
        query["category"] = category
    docs = await db.products.find(query).to_list(100)
    return [{**{k:v for k,v in d.items() if k != "_id"}, "id":str(d["_id"])} for d in docs]

@router.post("", dependencies=[Depends(admin_user)])
async def create_product(data: ProductIn):
    doc = data.model_dump()
    result = await db.products.insert_one(doc)
    return {"id": str(result.inserted_id), **doc}

@router.put("/{product_id}", dependencies=[Depends(admin_user)])
async def update_product(product_id: str, data: ProductIn):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid product id")
    result = await db.products.update_one({"_id":ObjectId(product_id)}, {"$set":data.model_dump()})
    if not result.matched_count:
        raise HTTPException(404, "Product not found")
    return {"id":product_id, **data.model_dump()}

@router.delete("/{product_id}", dependencies=[Depends(admin_user)])
async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid product id")
    result = await db.products.delete_one({"_id":ObjectId(product_id)})
    if not result.deleted_count:
        raise HTTPException(404, "Product not found")
    return {"deleted": True}
