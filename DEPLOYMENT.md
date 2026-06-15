# Deploying the Gas Certificate Register

The backend runs on Railway, the database is MongoDB on Railway, and the
frontend runs on Netlify.

## Values you will need

- Railway backend URL, for example `https://your-api.up.railway.app`
- Netlify frontend URL, for example `https://your-site.netlify.app`
- A long random `JWT_SECRET`

Do not put secrets in this repository. Add them only in the Railway or
Netlify website dashboards.

## 0. Push these deployment changes to GitHub

Open Terminal and run:

```bash
cd /Users/bilalasif/Desktop/FORM/gas-certificate-register
git add .
git commit -m "Prepare Railway and Netlify deployment"
git push origin main
```

Refresh the GitHub repository page and confirm that `railway.json`,
`netlify.toml`, and `DEPLOYMENT.md` are visible before continuing.

## 1. Deploy the backend and database on Railway

1. Sign in at https://railway.com with GitHub.
2. Click **New Project** and choose **Deploy from GitHub repo**.
3. Select `Shumaim-07/gas-certificate-register`.
4. If Railway asks which branch to use, select `main`.
5. In the project canvas, click **+ New**, choose **Database**, then choose
   **MongoDB**.
6. Open the backend service, choose **Variables**, and add:

   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `${{Mongo.MONGO_URL}}`
   - `JWT_SECRET` = a long random value (at least 32 characters)
   - `ADMIN_USERNAME` = the admin name you want
   - `ADMIN_INITIAL_PIN` = a private 4 to 6 digit PIN you will remember
   - `CLIENT_URL` = `https://temporary.example.com`

   If your database service is not named `Mongo`, replace `Mongo` in the
   reference with the exact database service name.

   To generate a secure `JWT_SECRET`, run this in Terminal and paste the
   output into Railway:

   ```bash
   openssl rand -hex 32
   ```

7. Open the backend service's **Settings** and find **Networking**.
8. Click **Generate Domain**.
9. Copy the generated Railway URL.
10. Open `https://YOUR-RAILWAY-URL/api/health` in a browser. It should show
    JSON with `"ok": true` and `"db": true`.

The temporary `CLIENT_URL` is replaced after Netlify gives you the real
frontend URL.

## 2. Deploy the frontend on Netlify

1. Sign in at https://app.netlify.com with GitHub.
2. Choose **Add new project**, then **Import an existing project**.
3. Choose GitHub and select `Shumaim-07/gas-certificate-register`.
4. Netlify should read `netlify.toml`. Confirm:

   - Build command: `npm run build`
   - Publish directory: `dist`

5. Before deploying, open **Environment variables** and add:

   - Key: `VITE_API_URL`
   - Value: `https://YOUR-RAILWAY-URL/api`

6. Click **Deploy**.
7. When deployment finishes, copy the Netlify URL.

## 3. Allow the real Netlify site in Railway

1. Return to the Railway backend service.
2. Open **Variables**.
3. Change `CLIENT_URL` to your exact Netlify URL, for example:
   `https://your-site.netlify.app`
4. Railway will redeploy the backend.
5. Wait until the deployment says **Success**.

Do not add `/` at the end of `CLIENT_URL`. For a custom domain later, you can
allow both domains separated by a comma:

`https://your-site.netlify.app,https://yourdomain.com`

## 4. Test the application

1. Open the Netlify URL.
2. Open `/admin/login`.
3. Sign in with the `ADMIN_INITIAL_PIN` you added in Railway.
4. Create an engineer User ID.
5. Sign out, use that User ID, create its PIN, and complete the profile.
6. Create, save, reopen, and download a test certificate.

## Updating the live application

After making code changes:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

Railway and Netlify will automatically deploy the new commit.

## Common errors

- **CORS error:** `CLIENT_URL` in Railway does not exactly match the Netlify URL.
- **Cannot connect to server:** `VITE_API_URL` is missing or does not end in `/api`.
- **Database not connected:** check that `MONGODB_URI` references the MongoDB
  service's `MONGO_URL`.
- **Page not found after refresh:** confirm `netlify.toml` is committed.
- **Railway startup error about JWT_SECRET:** add a secure `JWT_SECRET` in
  Railway Variables.
- **Railway startup error about ADMIN_INITIAL_PIN:** add a 4 to 6 digit
  `ADMIN_INITIAL_PIN` in Railway Variables.
