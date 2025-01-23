# Dokumentasi Tiktok-Api-Backend

## Deskripsi
Kode ini berisi implementasi beberapa fitur user management, yaitu: **register**, **login**, **edit profile**, dan **delete user**. Fitur-fitur ini memungkinkan pengelolaan data pengguna dengan autentikasi menggunakan JWT dan enkripsi password dengan bcrypt.

---

## Penjelasan Kode

### Fungsi Utama

#### 1. Register
Fungsi ini digunakan untuk mendaftarkan pengguna baru dengan melakukan hashing password dan menyimpan data ke database.
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await User.create({ username, email, password: hashedPassword });
```
- Password pengguna di-hash menggunakan bcrypt sebelum disimpan.
- Data pengguna kemudian disimpan dalam tabel `User`.
- Respons sukses diberikan dengan status code `201`.

#### 2. Login
Fungsi ini digunakan untuk autentikasi pengguna berdasarkan email dan password.
```javascript
const user = await User.findOne({ where: { email } });
const isMatch = await bcrypt.compare(password, user.password);
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
```
- Email pengguna dicocokkan dengan database.
- Password yang di-input dibandingkan dengan password yang di-hash menggunakan bcrypt.
- Jika autentikasi berhasil, token JWT dibuat dan dikembalikan sebagai respons.

#### 3. Edit Profile
Fungsi ini digunakan untuk memperbarui informasi pengguna seperti username, email, dan avatar.
```javascript
const user = await User.findByPk(userId);
user.username = username || user.username;
user.email = email || user.email;
user.avatar = avatar || user.avatar;
await user.save();
```
- Data pengguna diambil berdasarkan ID pengguna yang diekstrak dari token.
- Data yang diberikan diperbarui sesuai input, dengan fallback ke data lama jika input kosong.

#### 4. Delete User
Fungsi ini digunakan untuk menghapus akun pengguna berdasarkan ID.
```javascript
const user = await User.findByPk(userId);
await user.destroy();
```
- Data pengguna dihapus permanen dari database.

---

## Penjelasan Endpoint

### 1. Register User
**URL**: **POST /api/auth/register**

**Header**:
- `Content-Type`: `application/json`

**Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Respon Sukses**:
- Status Code: `201 Created`
- Body:
  ```json
  {
    "message": "User registered successfully",
    "user": { /* Data pengguna yang baru dibuat */ }
  }
  ```

**Respon Gagal**:
- Status Code: `500 Internal Server Error`
- Body:
  ```json
  {
    "message": "Error registering user",
    "error": { /* Detail error */ }
  }
  ```

---

### 2. Login User
**URL**: **POST /api/auth/login**

**Header**:
- `Content-Type`: `application/json`

**Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Respon Sukses**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN"
  }
  ```

**Respon Gagal**:
1. Email Tidak Ditemukan
   - Status Code: `404 Not Found`
   - Body:
     ```json
     {
       "message": "User not found"
     }
     ```

2. Password Salah
   - Status Code: `401 Unauthorized`
   - Body:
     ```json
     {
       "message": "Invalid credentials"
     }
     ```

---

### 3. Edit Profile
**URL**: **PUT /api/auth/edit-profile**

**Header**:
- `Authorization`: `Bearer JWT_TOKEN`
- `Content-Type`: `application/json`

**Body**:
```json
{
  "username": "new_username",
  "email": "new_email@example.com",
  "avatar": "new_avatar_url"
}
```

**Respon Sukses**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "message": "Profile updated successfully",
    "user": { /* Data pengguna yang diperbarui */ }
  }
  ```

**Respon Gagal**:
- Status Code: `404 Not Found` atau `500 Internal Server Error`

---

### 4. Delete User
**URL**: **DELETE /api/auth/delete-user**

**Header**:
- `Authorization`: `Bearer JWT_TOKEN`

**Respon Sukses**:
- Status Code: `200 OK`
- Body:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

**Respon Gagal**:
- Status Code: `404 Not Found` atau `500 Internal Server Error`

---

## Catatan
- Middleware autentikasi diperlukan untuk endpoint `edit-profile` dan `delete-user`.
- Pastikan `JWT_SECRET` telah diatur pada variabel lingkungan.
- Gunakan HTTPS untuk melindungi data sensitif seperti password dan token.

