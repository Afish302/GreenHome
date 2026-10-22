FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# install Python packages first so Docker caches this layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# then the code and the model
COPY app.py .
COPY model/ model/

# don't run as root
RUN useradd --create-home app
USER app

EXPOSE 8000
HEALTHCHECK --interval=30s CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/healthz')"
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]