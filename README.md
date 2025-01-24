# Dokumentasi Tiktok-Api-Backend

## Deskripsi
Kode ini berisi implementasi beberapa fitur user management, yaitu: **register**, **login**, **edit profile**, dan **delete user**. Fitur-fitur ini memungkinkan pengelolaan data pengguna dengan autentikasi menggunakan JWT dan enkripsi password dengan bcrypt, lalu ada juga bagian video seperti upload, get all video, get video by user, edit video, delete video, get video count, get video detail, lalu ada juga bagian like, ada beberapa juga endpoint nya seperti like video, unlike video, like count, dan check user if like, lalu terakhir ada bagian comment dengan beberapa endpointnya yaitu, add comment, get comment by video id, delete comment, get comment by comment id, edit comment, dan comment count. Semua endpoint ini saya tes menggunakan software postman
---
## Kelompok Tik Tok Api Endpoint
- Salwa Khoirunnisa
- Tresna Gunawa
- Muhammad Fathir Bagas

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



---

# Video

#### *Upload Video*

##### *Langkah-Langkah*
1. *Ambil Data Pengguna dan Input*
   ```javascript
   const { title, description, video_url } = req.body;
   const userId = req.user.id;
   ```
   - Data video diperoleh dari *request body*, sementara ID pengguna didapatkan dari token middleware.

2. *Simpan Data Video ke Database*
   ```javascript
   const newVideo = await Video.create({ user_id: userId, title, description, video_url });
   ```
   - Data video disimpan dalam tabel `Video`.

3. *Respon*
   ```javascript
   res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
   ```
   - Status 201 (Created) dikembalikan jika unggah berhasil.

---

#### *Get All Videos*

##### *Langkah-Langkah*
1. *Ambil Semua Data Video*
   ```javascript
   const videos = await Video.findAll();
   ```
   - Sistem mengambil semua data dari tabel `Video`.

2. *Respon*
   - Data video dikembalikan dengan status 200 (OK).

---

#### *Get Video Details*

##### *Langkah-Langkah*
1. *Cari Video Berdasarkan ID*
   ```javascript
   const video = await Video.findByPk(id);
   ```
   - Sistem mencari data video berdasarkan ID dari *request parameter*.

2. *Respon*
   - Jika video ditemukan, status 200 (OK) dikembalikan dengan data video.
   - Jika tidak ditemukan, status 404 (Not Found) dikembalikan.

---

#### *Update Video*

##### *Langkah-Langkah*
1. *Cari Video Berdasarkan ID*
   ```javascript
   const video = await Video.findByPk(id);
   ```
   - Sistem mencari video untuk diperbarui.

2. *Perbarui Data Video*
   ```javascript
   video.title = title || video.title;
   video.description = description || video.description;
   video.video_url = video_url || video.video_url;
   await video.save();
   ```
   - Sistem memperbarui data sesuai input yang diberikan.

3. *Respon*
   - Status 200 (OK) dikembalikan jika pembaruan berhasil.

---

#### *Delete Video*

##### *Langkah-Langkah*
1. *Cari Video Berdasarkan ID*
   ```javascript
   const video = await Video.findByPk(id);
   ```
   - Sistem mencari video yang akan dihapus.

2. *Hapus Video*
   ```javascript
   await video.destroy();
   ```
   - Video dihapus dari database.

3. *Respon*
   - Status 200 (OK) dikembalikan jika penghapusan berhasil.

---

#### *Get Videos by User*

##### *Langkah-Langkah*
1. *Ambil Semua Video oleh Pengguna Tertentu*
   ```javascript
   const videos = await Video.findAll({ where: { user_id: userId } });
   ```
   - Sistem mencari semua video berdasarkan ID pengguna dari *request parameter*.

2. *Respon*
   - Jika tidak ada video, status 404 (Not Found) dikembalikan.
   - Jika ada, status 200 (OK) dikembalikan dengan data video.

---

#### *Get Video Count*

##### *Langkah-Langkah*
1. *Hitung Jumlah Video*
   ```javascript
   const videoCount = await Video.count();
   ```
   - Sistem menghitung total jumlah video di database.

2. *Respon*
   - Status 200 (OK) dikembalikan dengan jumlah total video.

---

### *Endpoint: Video*

#### *URL*
1. **POST /api/video/upload**  
2. **GET /api/video/all**  
3. **GET /api/video/:id**  
4. **PUT /api/video/:id**  
5. **DELETE /api/video/:id**  
6. **GET /api/video/user/:userId**  
7. **GET /api/video/count**  

---

#### *Header*
- Untuk endpoint `upload`, `update`, dan `delete`, sertakan token JWT di *header*:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

---

#### *Request Body*
1. **Upload Video:**
   ```json
   {
     "title": "Example Video",
     "description": "This is an example video.",
     "video_url": "http://example.com/video.mp4"
   }
   ```

2. **Update Video:**
   ```json
   {
     "title": "Updated Title",
     "description": "Updated description.",
     "video_url": "http://example.com/new_video.mp4"
   }
   ```

---

#### *Respon*

##### *Respon Sukses*
1. *Upload Video*:  
   *Status Code*: 201 Created  
   *Body*:
   ```json
   {
     "message": "Video uploaded successfully",
     "video": {
       "id": 1,
       "title": "Example Video",
       "description": "This is an example video.",
       "video_url": "http://example.com/video.mp4",
       "user_id": 1
     }
   }
   ```

2. *Get All Videos*:  
   *Status Code*: 200 OK  
   *Body*:
   ```json
   {
     "videos": [
       {
         "id": 1,
         "title": "Example Video",
         "description": "This is an example video.",
         "video_url": "http://example.com/video.mp4",
         "user_id": 1
       }
     ]
   }
   ```

3. *Delete Video*:  
   *Status Code*: 200 OK  
   *Body*:
   ```json
   {
     "message": "Video deleted successfully"
   }
   ```

##### *Respon Gagal*
1. *Data Tidak Ditemukan*:  
   *Status Code*: 404 Not Found  
   *Body*:
   ```json
   {
     "message": "Video not found"
   }
   ```

2. *Server Error*:  
   *Status Code*: 500 Internal Server Error  
   *Body*:
   ```json
   {
     "message": "Error uploading video",
     "error": "<error details>"
   }
   ```

---

#### *Catatan*
- Endpoint `upload`, `update`, dan `delete` memerlukan autentikasi.
- Validasi input penting untuk memastikan data video valid.

---

# Comment

#### *Add Comment*

##### *Langkah-Langkah*
1. *Ambil Data Pengguna dan Input*
   ```javascript
   const videoId = req.params.video_id;
   const userId = req.user.id;
   const { content } = req.body;
   ```
   - Data video diambil dari parameter URL, ID pengguna didapatkan dari token middleware, dan isi komentar dari *request body*.

2. *Cek Keberadaan Video*
   ```javascript
   const video = await Video.findByPk(videoId);
   ```
   - Sistem memverifikasi keberadaan video sebelum menambahkan komentar.

3. *Tambah Komentar ke Database*
   ```javascript
   const comment = await Comment.create({ user_id: userId, video_id: videoId, content });
   ```
   - Data komentar disimpan dalam tabel `Comment`.

4. *Respon*
   ```javascript
   res.status(201).json({ message: "Comment added successfully", comment });
   ```
   - Status 201 (Created) dikembalikan jika komentar berhasil ditambahkan.

---

#### *Get Comments by Video*

##### *Langkah-Langkah*
1. *Ambil ID Video dari Parameter*
   ```javascript
   const videoId = req.params.video_id;
   ```
   - ID video diambil dari parameter URL.

2. *Cek Keberadaan Video*
   ```javascript
   const video = await Video.findByPk(videoId);
   ```
   - Sistem memverifikasi keberadaan video sebelum mengambil komentar.

3. *Ambil Komentar*
   ```javascript
   const comments = await Comment.findAll({ where: { video_id: videoId }, include: [{ model: User, attributes: ['username', 'avatar'] }] });
   ```
   - Komentar yang berasosiasi dengan video tertentu diambil, termasuk informasi pengguna yang membuat komentar.

4. *Respon*
   - Data komentar dikembalikan dengan status 200 (OK).

---

#### *Delete Comment*

##### *Langkah-Langkah*
1. *Ambil ID Komentar dan Pengguna*
   ```javascript
   const commentId = req.params.id;
   const userId = req.user.id;
   ```
   - ID komentar diambil dari parameter URL, dan ID pengguna didapatkan dari token middleware.

2. *Cek Keberadaan Komentar*
   ```javascript
   const comment = await Comment.findByPk(commentId);
   ```
   - Sistem memverifikasi keberadaan komentar.

3. *Verifikasi Kepemilikan Komentar*
   ```javascript
   if (comment.user_id !== userId) {
       return res.status(403).json({ message: "You can only delete your own comment" });
   }
   ```
   - Sistem memastikan hanya pemilik komentar yang dapat menghapus komentar tersebut.

4. *Hapus Komentar*
   ```javascript
   await comment.destroy();
   ```
   - Komentar dihapus dari database.

5. *Respon*
   - Status 200 (OK) dikembalikan jika penghapusan berhasil.

---

#### *Get Comment by ID*

##### *Langkah-Langkah*
1. *Ambil ID Komentar dari Parameter*
   ```javascript
   const commentId = req.params.id;
   ```
   - ID komentar diambil dari parameter URL.

2. *Cek Keberadaan Komentar*
   ```javascript
   const comment = await Comment.findByPk(commentId, { include: [{ model: User, attributes: ['username', 'avatar'] }] });
   ```
   - Sistem memverifikasi keberadaan komentar dan mengambil informasi pengguna terkait.

3. *Respon*
   - Data komentar dikembalikan dengan status 200 (OK).

---

#### *Edit Comment*

##### *Langkah-Langkah*
1. *Ambil ID Komentar dan Data Input*
   ```javascript
   const commentId = req.params.id;
   const { content } = req.body;
   const userId = req.user.id;
   ```
   - ID komentar diambil dari parameter URL, isi komentar dari *request body*, dan ID pengguna dari token middleware.

2. *Cek Keberadaan Komentar*
   ```javascript
   const comment = await Comment.findByPk(commentId);
   ```
   - Sistem memverifikasi keberadaan komentar.

3. *Verifikasi Kepemilikan Komentar*
   ```javascript
   if (comment.user_id !== userId) {
       return res.status(403).json({ message: "You can only edit your own comment" });
   }
   ```
   - Sistem memastikan hanya pemilik komentar yang dapat mengedit komentar tersebut.

4. *Perbarui Komentar*
   ```javascript
   comment.content = content;
   await comment.save();
   ```
   - Komentar diperbarui di database.

5. *Respon*
   - Status 200 (OK) dikembalikan jika pembaruan berhasil.

---

#### *Get Comment Count*

##### *Langkah-Langkah*
1. *Ambil ID Video dari Parameter*
   ```javascript
   const videoId = req.params.video_id;
   ```
   - ID video diambil dari parameter URL.

2. *Cek Keberadaan Video*
   ```javascript
   const video = await Video.findByPk(videoId);
   ```
   - Sistem memverifikasi keberadaan video.

3. *Hitung Jumlah Komentar*
   ```javascript
   const commentCount = await Comment.count({ where: { video_id: videoId } });
   ```
   - Sistem menghitung total jumlah komentar yang berasosiasi dengan video.

4. *Respon*
   - Status 200 (OK) dikembalikan dengan jumlah total komentar.

---

# Like Video

---

## Endpoint 1: Like/Unlike Video

### **URL**
`POST /api/videos/:video_id/like`

### **Header**
- **Authorization**: Token JWT (required)

### **Parameter URL**
- **video_id**: ID dari video yang akan di-like/unlike.

### **Deskripsi**
Endpoint ini digunakan untuk memberikan "like" pada video atau membatalkan "like" (unlike) jika pengguna sebelumnya telah memberikan "like".

### **Proses Backend**
1. Sistem memverifikasi keberadaan video berdasarkan `video_id`.
2. Sistem memeriksa apakah pengguna telah memberikan "like" sebelumnya:
   - Jika sudah, maka sistem akan membatalkan "like".
   - Jika belum, maka sistem akan membuat "like" baru.
3. Sistem mengembalikan respons berdasarkan hasil proses.

### **Respon**
#### **Respon Sukses**
- *Status Code*: `200 OK`
- *Body*:
  ```json
  {
    "message": "Video liked successfully"
  }
  ```
  atau
  ```json
  {
    "message": "Video unliked successfully"
  }
  ```

#### **Respon Gagal**
- *Status Code*: `404 Not Found`  
  *Body*:  
  ```json
  {
    "message": "Video not found"
  }
  ```
- *Status Code*: `500 Internal Server Error`  
  *Body*:  
  ```json
  {
    "message": "Error liking video",
    "error": {}
  }
  ```

---

## Endpoint 2: Get Like Count

### **URL**
`GET /api/videos/:video_id/like-count`

### **Header**
Tidak memerlukan header khusus.

### **Parameter URL**
- **video_id**: ID dari video yang jumlah "like"-nya akan dihitung.

### **Deskripsi**
Endpoint ini digunakan untuk mendapatkan jumlah total "like" pada video tertentu.

### **Proses Backend**
1. Sistem memverifikasi keberadaan video berdasarkan `video_id`.
2. Sistem menghitung jumlah "like" pada video tersebut.
3. Sistem mengembalikan jumlah "like" dalam format JSON.

### **Respon**
#### **Respon Sukses**
- *Status Code*: `200 OK`
- *Body*:
  ```json
  {
    "likeCount": 100
  }
  ```

#### **Respon Gagal**
- *Status Code*: `404 Not Found`  
  *Body*:  
  ```json
  {
    "message": "Video not found"
  }
  ```
- *Status Code*: `500 Internal Server Error`  
  *Body*:  
  ```json
  {
    "message": "Error fetching like count",
    "error": {}
  }
  ```

---

## Endpoint 3: Check If User Liked Video

### **URL**
`GET /api/videos/:video_id/is-liked`

### **Header**
- **Authorization**: Token JWT (required)

### **Parameter URL**
- **video_id**: ID dari video yang akan dicek status "like"-nya oleh pengguna.

### **Deskripsi**
Endpoint ini digunakan untuk memeriksa apakah pengguna telah memberikan "like" pada video tertentu.

### **Proses Backend**
1. Sistem memverifikasi keberadaan video berdasarkan `video_id`.
2. Sistem memeriksa apakah pengguna telah memberikan "like" pada video tersebut.
3. Sistem mengembalikan respons sesuai dengan hasil pengecekan.

### **Respon**
#### **Respon Sukses**
- *Status Code*: `200 OK`
- *Body*:
  ```json
  {
    "message": "User has liked this video"
  }
  ```
  atau
  ```json
  {
    "message": "User has not liked this video"
  }
  ```

#### **Respon Gagal**
- *Status Code*: `404 Not Found`  
  *Body*:  
  ```json
  {
    "message": "Video not found"
  }
  ```
- *Status Code*: `500 Internal Server Error`  
  *Body*:  
  ```json
  {
    "message": "Error checking if user liked video",
    "error": {}
  }
  ```

---

## Catatan Tambahan
- Pastikan middleware otentikasi diterapkan pada endpoint yang membutuhkan token JWT.
- Middleware otorisasi juga dapat diterapkan untuk memastikan bahwa hanya pengguna yang berwenang dapat memberikan "like" atau mengakses data.
- Pastikan untuk mengganti nilai `process.env.JWT_SECRET` dengan kunci rahasia yang aman.
- Jika dataset video atau like cukup besar, pertimbangkan untuk menambahkan optimasi query pada database.

---

### *Endpoint: Comment*

#### *URL*
1. **POST /api/comment/add/:video_id**
2. **GET /api/comment/all/:video_id**
3. **DELETE /api/comment/:id**
4. **GET /api/comment/:id**
5. **PUT /api/comment/:id**
6. **GET /api/comment/count/:video_id**

---

#### *Header*
- Untuk semua endpoint, sertakan token JWT di *header*:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```

---

#### *Request Body*
1. **Add Comment:**
   ```json
   {
     "content": "This is a sample comment."
   }
   ```

2. **Edit Comment:**
   ```json
   {
     "content": "Updated comment content."
   }
   ```

---

#### *Respon*

##### *Respon Sukses*
1. *Add Comment*:  
   *Status Code*: 201 Created  
   *Body*:
   ```json
   {
     "message": "Comment added successfully",
     "comment": {
       "id": 1,
       "video_id": 10,
       "user_id": 5,
       "content": "This is a sample comment."
     }
   }
   ```

2. *Delete Comment*:  
   *Status Code*: 200 OK  
   *Body*:
   ```json
   {
     "message": "Comment deleted successfully"
   }
   ```

##### *Respon Gagal*
1. *Data Tidak Ditemukan*:  
   *Status Code*: 404 Not Found  
   *Body*:
   ```json
   {
     "message": "Comment not found"
   }
   ```

2. *Server Error*:  
   *Status Code*: 500 Internal Server Error  
   *Body*:
   ```json
   {
     "message": "Error adding comment",
     "error": "<error details>"
   }
   ```

---

#### *Catatan*
- Semua endpoint memerlukan autentikasi.
- Validasi input penting untuk memastikan data komentar valid.



