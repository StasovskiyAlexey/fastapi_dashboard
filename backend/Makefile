run:
	uvicorn app.main:app --reload

build:
	docker-compose -p backend_dev -f docker-compose.yml build --no-cache

up:
	docker-compose -p backend_dev -f docker-compose.yml up

down:
	docker-compose -p backend_dev -f docker-compose.yml down -v