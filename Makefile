up:
	docker-compose -f docker-compose.yml up

build:
	docker-compose -f docker-compose.yml build --no-cache

down:
	docker-compose -f docker-compose.yml down