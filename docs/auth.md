# Kicheko Frontend API Guide — Auth & Profile

Base URL (dev): `http://127.0.0.1:8023/api/v1`

All auth endpoints live under `/api/v1/auth/`. Send `Content-Type: application/json` unless noted otherwise.

## Response conventions

- **Success:** `200` / `201` with a JSON body.
- **Validation error:** `400` with field-keyed errors, e.g. `{"email": ["This field is required."], "non_field_errors": ["..."]}`.
- **Auth required:** `401` — `{"detail": "Authentication credentials were not provided."}`.
- **Using tokens:** send `Authorization: Bearer <access_token>` on every protected request.
- Access tokens live **60 min**, refresh tokens **7 days**. Refresh tokens **rotate** — every refresh returns a new refresh token; store it and discard the old one.

---

## 1. Register

`POST /api/v1/auth/register/` — public

```json
{
  "display_name": "J Nicholaus",
  "email": "jnichoraus3@gmail.com",
  "password": "Test@1234",
  "password_confirm": "Test@1234",
  "accept_terms": true
}
```

Rules:

- `email` **or** `phone_number` required (at least one). Phone users send `"phone_number": "+2557..."` instead of `email`.
- `accept_terms` must be `true`.
- Password runs server-side strength validation.

**201 response** — user is logged in immediately:

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>",
  "user": {
    "id": "1793f81c-8872-4ce7-887c-a6850379af6b",
    "username": "jnichoraus3@gmail.com",
    "display_name": "J Nicholaus",
    "email": "jnichoraus3@gmail.com",
    "phone_number": null,
    "status": "pending_verification",
    "is_staff": false,
    "profile": {
      "avatar": null,
      "cover": null,
      "bio": "",
      "location": "",
      "website": "",
      "preferred_language": "sw",
      "country_code": "TZ",
      "notification_preferences": {}
    }
  }
}
```

`status` starts as `pending_verification` — it does **not** block login yet (verification flow comes later).

## 2. Login

`POST /api/v1/auth/token/` — public

```json
{ "username": "jnichoraus3@gmail.com", "password": "Test@1234" }
```

`username` = the email **or** phone the account registered with. Response shape is identical to register (`refresh` + `access` + `user`).

Wrong credentials → `401`:

```json
{ "detail": "No active account found with the given credentials" }
```

## 3. Refresh

`POST /api/v1/auth/token/refresh/` — public

```json
{ "refresh": "<refresh_token>" }
```

Response:

```json
{ "access": "<new_access>", "refresh": "<new_refresh>" }
```

Store the new refresh token — the old one is dead (rotation enabled).

## 4. Verify a token

`POST /api/v1/auth/token/verify/` — public

```json
{ "token": "<access_token>" }
```

`200` + `{}` if valid, `401` if invalid/expired.

## 5. Forgot password (3 steps, OTP via email)

### Step 1 — request code

`POST /api/v1/auth/password-reset/` — public

```json
{ "email": "jnichoraus3@gmail.com" }
```

Always returns the same message (never reveals whether the account exists):

```json
{ "detail": "If an account with that email exists, a reset code has been sent." }
```

A 6-digit code is emailed, valid for **10 minutes**, max 5 wrong attempts, single-use.

### Step 2 — verify code → get reset token

`POST /api/v1/auth/password-reset/verify/` — public

```json
{ "email": "jnichoraus3@gmail.com", "otp": "091949" }
```

Success `200`:

```json
{ "reset_token": "tsdkg7jaLkgGFHNs-v7XjBl7YgP-GxLkHW6Di727qq0" }
```

Failure `400`: `{"otp": "Invalid or expired code."}`

Suggested UX: only show the new-password form after this step succeeds.

### Step 3 — set new password

`POST /api/v1/auth/password-reset/confirm/` — public

```json
{
  "email": "jnichoraus3@gmail.com",
  "reset_token": "<token from step 2>",
  "new_password": "NewPass@123",
  "new_password_confirm": "NewPass@123"
}
```

Success `200`: `{"detail": "Password has been reset. You can now log in."}`

The `reset_token` is single-use and dies with the OTP's 10-min expiry. After success, redirect to login.

## 6. Current user profile

`GET /api/v1/auth/me/` — authenticated

Returns the same flat profile shape used everywhere:

```json
{
  "id": "9780af98-4f27-4efb-a124-06e1b8edd5b1",
  "username": "admin",
  "display_name": "Admin Kicheko",
  "email": "admin@kicheko.local",
  "phone_number": null,
  "status": "active",
  "avatar": "http://localhost:9000/kicheko-media/avatars/avatar.png",
  "cover": null,
  "bio": "Comedy admin",
  "location": "Dar es Salaam",
  "website": "",
  "preferred_language": "sw",
  "country_code": "TZ",
  "notification_preferences": {}
}
```

### Update profile — `PATCH /api/v1/auth/me/`

Editable: `display_name`, `avatar`, `cover`, `bio`, `location`, `website`, `preferred_language`, `country_code`, `notification_preferences`.
Read-only (ignored): `id`, `username`, `email`, `phone_number`, `status`.

JSON body (text fields):

```json
{ "display_name": "J Nicholaus", "bio": "Comedian", "location": "Dar es Salaam" }
```

Images (`avatar`, `cover`) need `multipart/form-data`:

```
PATCH /api/v1/auth/me/
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar=<file>   cover=<file>   bio=Comedian
```

JavaScript example:

```js
const form = new FormData()
form.append('avatar', fileInput.files[0])
form.append('bio', 'Comedian')
await fetch(`${API}/auth/me/`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${accessToken}` }, // no Content-Type — browser sets it
  body: form,
})
```

Image URLs point at MinIO (`http://localhost:9000/kicheko-media/...`) and are publicly readable — use them directly in `<img>` tags.

## 7. Endpoint summary

| Method | Endpoint                               | Auth     | Purpose                               |
| ------ | -------------------------------------- | -------- | ------------------------------------- |
| POST   | `/api/v1/auth/register/`               | public   | Create account, returns tokens + user |
| POST   | `/api/v1/auth/token/`                  | public   | Login, returns tokens + user          |
| POST   | `/api/v1/auth/token/refresh/`          | public   | New access + rotated refresh          |
| POST   | `/api/v1/auth/token/verify/`           | public   | Check token validity                  |
| POST   | `/api/v1/auth/password-reset/`         | public   | Email a 6-digit OTP                   |
| POST   | `/api/v1/auth/password-reset/verify/`  | public   | OTP → `reset_token`                   |
| POST   | `/api/v1/auth/password-reset/confirm/` | public   | `reset_token` + new password          |
| GET    | `/api/v1/auth/me/`                     | required | Current user + profile                |
| PATCH  | `/api/v1/auth/me/`                     | required | Update profile / upload images        |

## 8. Suggested frontend flows

- **Register/Login** → store `access` + `refresh` + `user`, go to app.
- **Silent refresh** → on 401, call refresh once, retry the request; if refresh also 401s, force re-login.
- **Forgot password screens**: email form → OTP input → new-password form → success → login.
- **Profile page** → `GET /me` on load; PATCH form fields; separate file pickers PATCH `avatar`/`cover` with `FormData`, then update the displayed image from the response URL.
- **Logout** → client-side for now (drop tokens); server-side token blacklisting is planned.
