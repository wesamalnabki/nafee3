import hashlib
import json
import logging
import os
from typing import Dict, List

from dotenv import load_dotenv, find_dotenv
from qdrant_client import QdrantClient, models as qdrant_models
from qdrant_client.http.models import Distance, VectorParams
from sentence_transformers import SentenceTransformer

from app_schemas import Profile, SearchInput

# Load environment variables
load_dotenv(find_dotenv(usecwd=True))

# Constants
EMBEDDING_SIZE = 768
EMBEDDING_MODEL_NAME = "akhooli/Arabic-SBERT-100K"
COLLECTION_NAME = "nafee3-profiles"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_id(value: str) -> str:
    """Generate a consistent hash ID for a given value."""
    return hashlib.md5(value.encode()).hexdigest()


class ProfileManager:
    """Manages profile embeddings and storage using Qdrant."""

    def __init__(self):
        self.embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        self.qdrant_client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
        )

        if not self.qdrant_client.collection_exists(COLLECTION_NAME):
            logger.info(f"Creating collection '{COLLECTION_NAME}'")
            self.qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config={
                    "dense": VectorParams(
                        size=EMBEDDING_SIZE,
                        datatype=qdrant_models.Datatype.FLOAT16,
                        distance=Distance.COSINE,
                    )
                },
            )
            self.qdrant_client.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="profile_id",
                field_schema="keyword",
            )

    def profile_exists(self, search_key: str, search_value: str) -> bool:
        """Check if a profile exists based on a field and value."""
        result = self.qdrant_client.count(
            collection_name=COLLECTION_NAME,
            count_filter=qdrant_models.Filter(
                must=[
                    qdrant_models.FieldCondition(
                        key=search_key,
                        match=qdrant_models.MatchValue(value=search_value),
                    )
                ]
            ),
            exact=True,
        )
        return result.count > 0

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for a given text."""
        return self.embedding_model.encode([text])[0].tolist()

    def add_profile(self, profile: Profile) -> Dict:
        """Add a new profile to the Qdrant collection."""
        logger.info("Creating new profile")

        profile.profile_id = generate_id(profile.email)
        if self.profile_exists("profile_id", profile.profile_id):
            return {
                "status": "conflict",
                "message": f"Profile with ID '{profile.profile_id}' already exists."
            }

        self.qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                qdrant_models.PointStruct(
                    id=profile.profile_id,
                    payload=profile.model_dump(),
                    vector={"dense": self.get_embedding(profile.service_description)},
                )
            ],
        )
        logger.info(f"Profile created: {profile.profile_id}")
        return {
            "status": "success",
            "message": "Profile created successfully.",
            "profile_id": profile.profile_id,
        }

    def delete_profile(self, profile_id: str) -> Dict:
        """Delete a profile from the Qdrant collection."""
        if not self.profile_exists("profile_id", profile_id):
            return {"status": "not_found", "message": "Profile not found."}

        try:
            self.qdrant_client.delete(
                collection_name=COLLECTION_NAME,
                points_selector=qdrant_models.FilterSelector(
                    filter=qdrant_models.Filter(
                        must=[
                            qdrant_models.FieldCondition(
                                key="profile_id",
                                match=qdrant_models.MatchValue(value=profile_id),
                            )
                        ]
                    )
                ),
            )
            return {"status": "success", "message": "Profile deleted successfully."}
        except Exception as e:
            logger.exception(f"Error deleting profile {profile_id}")
            return {"status": "error", "message": f"Failed to delete profile: {e}"}

    def update_profile(self, profile: Profile) -> Dict:
        """Update an existing profile's payload."""
        try:
            if not self.profile_exists("profile_id", profile.profile_id):
                return {"status": "not_found", "message": "Profile not found."}

            self.qdrant_client.set_payload(
                collection_name=COLLECTION_NAME,
                payload=profile.model_dump(),
                points=qdrant_models.Filter(
                    must=[
                        qdrant_models.FieldCondition(
                            key="profile_id",
                            match=qdrant_models.MatchValue(value=profile.profile_id),
                        )
                    ]
                ),
            )
            return {
                "status": "success",
                "message": f"Profile '{profile.profile_id}' updated successfully."
            }
        except Exception as e:
            logger.exception(f"Error updating profile {profile.profile_id}")
            return {
                "status": "error",
                "message": f"Failed to update profile '{profile.profile_id}': {e}"
            }

    def get_profile(self, profile_id: str) -> Dict:
        """Retrieve a profile by its ID."""
        try:
            result = self.qdrant_client.retrieve(
                collection_name=COLLECTION_NAME,
                ids=[profile_id],
            )
            if result:
                return {
                    "status": "success",
                    "message": f"Profile '{profile_id}' found.",
                    "profile": result[0].payload,
                }
            else:
                return {"status": "not_found", "message": "Profile not found."}
        except Exception as e:
            logger.exception(f"Error retrieving profile {profile_id}")
            return {"status": "error", "message": f"Failed to retrieve profile: {e}"}

    def search_profile(self, search_input: SearchInput) -> List[Dict]:
        """Search for profiles similar to a query."""
        query_vector = self.get_embedding(search_input.query)

        try:
            candidates = self.qdrant_client.query_points(
                collection_name=COLLECTION_NAME,
                using="dense",
                query=query_vector,
                limit=search_input.top_k,
            )

            return [
                {**c.payload, "similarity": c.score}
                for c in candidates.points
                if c.score >= search_input.sim_threshold
            ]
        except Exception as e:
            logger.exception("Search failed.")
            return []

    def add_fake_clients(self, json_path: str = "../data/workers_data.json") -> None:
        """Load and insert fake profiles from a JSON file (for testing)."""
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                profiles = json.load(f)

            for idx, profile in enumerate(profiles):
                fake_profile = Profile(
                    profile_id=generate_id(f"{idx}_{profile['email']}"),
                    name=profile["name"],
                    email=f"{idx}_{profile['email']}",
                    phone_number=profile["phone_number"],
                    location=profile["location"],
                    service_description=profile["service_description"],
                )
                self.add_profile(fake_profile)
            logger.info("Fake profiles added successfully.")
        except Exception as e:
            logger.exception(f"Failed to add fake clients: {e}")
