# /app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app_schemas import SearchInput, Profile
from service import ProfileManager

pm = ProfileManager()
app = FastAPI(
    title="Profile Search API",
    description="API for searching profiles",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get_profile")
def get_profile(profile_id: str):
    """Get a profile by its ID."""
    response = pm.get_profile(profile_id)
    return JSONResponse(response)


@app.post("/search_profiles")
def search_profiles(search_input: SearchInput):
    """Search profiles by service description similarity."""
    candidates = pm.search_profile(search_input)
    return JSONResponse(candidates)


@app.post("/update_profile")
def update_profile(profile: Profile):
    """Update a profile's service description and other details."""
    updated = pm.update_profile(profile)
    return JSONResponse(updated)


@app.delete("/delete_profile")
def delete_profile(profile_id: str):
    """Delete a profile by its ID."""
    response = pm.delete_profile(profile_id)
    return JSONResponse(response)


@app.post("/add_profile")
def add_profile(profile: Profile):
    """Add a new profile with the given profile_id."""
    response = pm.add_profile(profile)
    return JSONResponse(response)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
