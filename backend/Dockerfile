# Use a Python 3.11 slim base image
FROM python:3.11-slim

# Set timezone to match host (e.g., Europe/Madrid)
ENV TZ=Europe/Madrid
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata
#     && \
#     ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
#     dpkg-reconfigure -f noninteractive tzdata && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# Install uv (Ultra Fast Python Package Installer)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Set the working directory
WORKDIR /app

# Copy only requirements first for caching
COPY requirements.txt .

# Create a virtual environment using uv and install dependencies
RUN uv venv .venv && \
    . .venv/bin/activate && \
    uv pip install --no-cache-dir -r requirements.txt

COPY app app

COPY .env /app/.env

# Expose FastAPI port
EXPOSE 8000

# Run the app (assuming your entrypoint is app/main.py)
CMD ["/app/.venv/bin/python", "app/main.py"]
