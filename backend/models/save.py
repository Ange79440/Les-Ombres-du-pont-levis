from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, Field

SceneId = Literal[
    "path",
    "house",
    "drawbridge",
    "hall",
    "alchemy",
    "astronomy",
    "crypt",
]


class Clue(BaseModel):
    id: str
    title: str
    text: str
    scene: SceneId


class GameState(BaseModel):
    player_name: str = Field(min_length=1, max_length=24)
    scene: SceneId = "path"
    x: int = Field(ge=0, le=19)
    y: int = Field(ge=0, le=11)
    inventory: List[str] = []
    solved: List[str] = []
    clues: List[Clue] = []
    drawbridge_lowered: bool = False
    completed: bool = False


class SaveGame(GameState):
    slot: int
    updated_at: datetime
