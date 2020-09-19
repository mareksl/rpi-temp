COMPOSE=COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 BUILDKIT_PROGRESS=plain docker-compose -f docker-compose.yml
COMPOSE_PROD=$(COMPOSE) -f docker-compose.prod.yml
COMPOSE_DEV=$(COMPOSE) -f docker-compose.override.yml

build-dev:
	 $(COMPOSE_DEV) build $(filter-out $@,$(MAKECMDGOALS))
build-prod:
	 $(COMPOSE_PROD) build $(filter-out $@,$(MAKECMDGOALS))

run-dev:
	$(COMPOSE_DEV) up $(filter-out $@,$(MAKECMDGOALS))
run-prod:
	$(COMPOSE_PROD) up $(filter-out $@,$(MAKECMDGOALS))
