# inji-mock-services
Repository will be used to maintain the mock services and libraries developed for Inji Stack

## Student Graduation Use-Case — One-Command Setup

Run the complete Student Graduation use-case (Inji Certify + Student Backend + Student UI) with a single command.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose v2)
- These ports free on your machine: `3000`, `8085`, `8090`, `8091`, `5433`

### Start

From this folder (`inji-mock-services/`):

```bash
docker compose up --build
```

Add `-d` to run in the background. The first run takes a few minutes (images are pulled and built). After the containers start, Certify needs about a minute to finish booting.

### What gets started

| Service | Description | URL |
|---|---|---|
| `student-ui` | React UI served by nginx ([student-graduation-ui](./student-graduation-ui)) | http://localhost:3000 |
| `student-backend` | Spring Boot API ([student-graduation-api](./student-graduation-api)) | http://localhost:8085/api |
| `certify-nginx` | Public entrypoint for Inji Certify (used by wallets) | http://localhost:8091 |
| `certify` | Inji Certify with plugins | http://localhost:8090 |
| `database` | PostgreSQL 15 (Certify schema + student tables + sample data) | `localhost:5433` |

**Open http://localhost:3000 to use the application.** The UI forwards `/api` requests to the backend, which talks to Postgres and Certify internally.

### Notes

- **Backend API key** — direct calls to the backend (e.g. Postman) need the header `X-API-Key: certify-admin-key-change-me`. A Postman collection is available in [student-graduation-api](./student-graduation-api/Inji_Student_API_Tests.postman_collection.json).
- **Database access** — connect with any Postgres client (pgAdmin, DBeaver) using host `localhost`, port `5433`, user `postgres`, password `postgres`, database `inji_certify`, schema `certify`.
- **Wallet / QR codes** — credential offers point to `http://<your-host>:8091`, so a mobile wallet on the same network can reach Certify. Set `MOSIP_CERTIFY_DOMAIN_URL` to change the Certify domain URL (default `http://localhost:8091`).
- **Configuration** — Certify config, the SQL init script and the nginx config are reused from [student-graduation-docker](./student-graduation-docker) (`config/`, `certify_init.sql`, `certify-nginx.conf`).

### Useful commands

```bash
docker compose ps                 # status of all services
docker compose logs -f certify    # follow logs of one service
docker compose down               # stop everything
docker compose down -v            # stop and wipe the database (re-runs certify_init.sql on next start)
```

### Full Inji Stack (Mimoto + Inji Web)

To also run Mimoto and the Inji Web wallet (http://localhost:3004), use the full setup in [student-graduation-docker](./student-graduation-docker/README.md). Don't run it alongside the one-command setup above, because both use the same ports.
