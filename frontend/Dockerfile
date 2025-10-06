# ===============================
# Gradio Frontend (Dockerfile)
# ===============================

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

RUN pip install --no-cache-dir -U pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . .

# Load environment variables from .env if present
ENV BACKEND_URL=http://backend:8000

EXPOSE 8501

CMD ["python", "app/main.py"]
