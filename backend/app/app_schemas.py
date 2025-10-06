# /app/app_schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
import uuid

# Input model (no profile_id expected from client)
class Profile(BaseModel):
    profile_id: Optional[str] = uuid.uuid4().hex
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    service_city: Optional[str] = None
    service_description: Optional[str] = None


class SearchInput(BaseModel):
    query: str
    search_city: Optional[str]=None
    search_area: Optional[str] = None
    sim_threshold: Optional[float] = 0.1
    top_k: Optional[int] = 50
