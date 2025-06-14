# /app/app_schemas.py
from pydantic import BaseModel
from typing import  Optional

# Input model (no profile_id expected from client)
class Profile(BaseModel):
    profile_id: str = None

    name: str
    email: Optional[str]
    phone_number: Optional[str]
    location: Optional[str]
    service_description: str


class SearchInput(BaseModel):
    query: str
    sim_threshold: Optional[float] = 0.1
    top_k: Optional[int] = 50
