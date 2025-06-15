# /app/app_schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# Input model (no profile_id expected from client)
class Profile(BaseModel):
    profile_id: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    service_city: Optional[str] = None
    service_area: Optional[str] = None
    service_description: Optional[str] = None
    profile_photo: Optional[str] = None  # Path to profile photo in Supabase
    portfolio_photos: Optional[List[str]] = None  # List of paths to portfolio photos in Supabase


class SearchInput(BaseModel):
    query: str
    search_city: Optional[str]=None
    search_area: Optional[str] = None
    sim_threshold: Optional[float] = 0.1
    top_k: Optional[int] = 50
