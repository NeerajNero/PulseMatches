#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  echo "Missing .env file. Create it first: cp .env.docker.example .env"
  exit 1
fi

if ! command -v docker-compose >/dev/null 2>&1; then
  echo "docker-compose not found in PATH"
  exit 1
fi

get_env_value() {
  local key="$1"
  local value=""

  value="$(awk -v key="$key" -F= '{
    if ($1 == key) {
      sub(/^[^=]*=/, "", $0)
      print $0
      exit
    }
  }' .env | tr -d '\r')"

  printf '%s' "${value}"
}

BACKEND_PORT=${BACKEND_PORT:-3010}
ENV_BACKEND_PORT="$(get_env_value BACKEND_PORT)"
ENV_FRONTEND_PORT="$(get_env_value FRONTEND_PORT)"
FRONTEND_PORT=${FRONTEND_PORT:-3002}
if [ -n "${ENV_BACKEND_PORT}" ]; then
  BACKEND_PORT="${ENV_BACKEND_PORT}"
fi
if [ -n "${ENV_FRONTEND_PORT}" ]; then
  FRONTEND_PORT="${ENV_FRONTEND_PORT}"
fi

run_step() {
  local name="$1"
  shift
  printf '\n==== %s ====\n' "$name"
  "$@"
}

wait_for_backend_health() {
  local url="http://127.0.0.1:${BACKEND_PORT}/health"
  local retries=40
  local sleep_seconds=3

  printf '\n==== Waiting for backend health: %s ====\n' "${url}"

  local i=1
  while true; do
    if curl -fsS "${url}" > /dev/null; then
      printf 'Backend health check passed.\n'
      return 0
    fi

    if (( i >= retries )); then
      printf 'Backend health check failed after %s attempts.\n' "${retries}"
      echo "Check backend logs: docker-compose logs backend"
      return 1
    fi

    echo "Backend health check attempt ${i}/${retries}; retrying in ${sleep_seconds}s"
    sleep "$sleep_seconds"
    ((i++))
  done
}

run_step "Validate compose config" docker-compose config > /tmp/docker_smoke_full_compose_config.log
run_step "Build backend/frontend images" docker-compose build backend frontend
run_step "Start postgres and redis" docker-compose up -d postgres redis
run_step "Run backend migrations" docker-compose run --rm backend-migrate
run_step "Run backend seed" docker-compose run --rm backend-seed
run_step "Start backend and frontend" docker-compose up -d backend frontend
run_step "Wait for backend health" wait_for_backend_health
run_step "Run MVP smoke" docker-compose run --rm smoke
run_step "Process notifications" docker-compose run --rm notifications-process
run_step "Run payment reconcile" docker-compose run --rm payments-reconcile
run_step "Show service status" docker-compose ps
run_step "Show backend/frontend logs (tail)" docker-compose logs --tail=20 backend frontend

printf '\n==== Docker smoke flow completed ====\n'
printf 'Backend:  http://127.0.0.1:%s\n' "${BACKEND_PORT}"
printf 'Frontend: http://127.0.0.1:%s\n' "${FRONTEND_PORT}"
printf 'Useful follow-up: leave services up for debugging with: docker-compose ps\n'
