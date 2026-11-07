from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, Path

from lib.db import db
from models.save import GameState, SaveGame

router = APIRouter(prefix="/saves", tags=["saves"])

SlotParam = Path(ge=1, le=3)


def _to_save(doc: dict) -> SaveGame:
    doc.pop("_id", None)
    ts = doc.get("updated_at")
    if isinstance(ts, datetime) and ts.tzinfo is None:
        doc["updated_at"] = ts.replace(tzinfo=timezone.utc)
    return SaveGame(**doc)


@router.get("", response_model=List[SaveGame])
async def list_saves():
    docs = await db.saves.find({}, {"_id": 0}).sort("slot", 1).to_list(10)
    return [_to_save(d) for d in docs]


@router.get("/{slot}", response_model=SaveGame)
async def get_save(slot: int = SlotParam):
    doc = await db.saves.find_one({"slot": slot}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Emplacement vide")
    return _to_save(doc)


@router.put("/{slot}", response_model=SaveGame)
async def put_save(state: GameState, slot: int = SlotParam):
    save = SaveGame(**state.model_dump(), slot=slot, updated_at=datetime.now(timezone.utc))
    await db.saves.replace_one({"slot": slot}, save.model_dump(), upsert=True)
    return save


@router.delete("/{slot}")
async def delete_save(slot: int = SlotParam):
    res = await db.saves.delete_one({"slot": slot})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Emplacement vide")
    return {"deleted": slot}
