FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install redis asyncio

CMD ["python", "worker.py"]