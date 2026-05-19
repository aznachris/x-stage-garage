# Stage X Garage

Next.js site with admin panel, booking, merch shop, and portfolio.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: `/admin/login`.

Without Azure env vars, data is stored under `./data/` and uploads under `./data/uploads/`.

## Docker

```bash
docker compose up --build -d
```

Dev profile with hot reload:

```bash
docker compose --profile dev up
```

## Azure App Service + Blob Storage

The app is ready for **Azure Web App (Linux)** with **Azure Blob Storage** for all persistent data.

### Why Blob is required on Azure

App Service local disk is **not durable** (restarts, scale-out). Without Blob:

- Uploaded images are lost
- JSON data (orders, appointments, merch, etc.) is lost

When `AZURE_STORAGE_CONNECTION_STRING` is set, the app stores:

| Container (default) | Content |
|---------------------|---------|
| `data` | `appointments.json`, `orders.json`, `products.json`, … |
| `uploads` | Product & portfolio images |

Image URLs stay `/uploads/<uuid>.png` (served via the app, works with private containers).

### Azure setup checklist

1. **Storage account** (StorageV2, LRS is fine)
2. **App Service** (Linux, Node 22 LTS)
3. **Application settings** (Configuration → Application settings):

   | Name | Value |
   |------|--------|
   | `AZURE_STORAGE_CONNECTION_STRING` | Storage account connection string |
   | `NEXTAUTH_URL` | `https://<your-app>.azurewebsites.net` |
   | `NEXTAUTH_SECRET` | Long random string |
   | `ADMIN_PASSWORD` | Admin login password |
   | `PORT` | `3000` |
   | `WEBSITES_PORT` | `3000` |

4. **Deploy** (recommended: Docker from repo `Dockerfile`):

   ```bash
   az webapp create --resource-group <rg> --plan <plan> --name <app> \
     --deployment-container-image-name <your-acr>/stagex-garage:latest
   ```

   Or build on App Service with startup command:

   ```bash
   node server.js
   ```

   (after `npm run build` with `output: "standalone"`)

5. **Health check**: `GET https://<your-app>.azurewebsites.net/api/health`

   ```json
   { "ok": true, "storage": "azure-blob", "containers": { "data": "data", "uploads": "uploads" } }
   ```

### Migrate existing local data to Blob (optional)

Upload each file from `./data/*.json` into the `data` container, and each file from `./data/uploads/` into the `uploads` container (same filenames). Use [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer/) or `az storage blob upload`.

### Environment reference

See [.env.example](.env.example).
