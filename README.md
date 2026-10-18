# Website Đăng Nhập / Đăng Ký với Node.js và MongoDB

Dự án xây dựng hệ thống xác thực người dùng (đăng ký, đăng nhập, đăng xuất) sử dụng **Node.js**, **Express**, **MongoDB** và **Session** để quản lý phiên đăng nhập. Mật khẩu được mã hoá bằng **bcrypt** trước khi lưu vào cơ sở dữ liệu.

---

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Cấu hình biến môi trường](#cấu-hình-biến-môi-trường)
- [Cách chạy dự án](#cách-chạy-dự-án)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Bảo mật đã áp dụng](#bảo-mật-đã-áp-dụng)
- [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)
- [Tính năng dự kiến phát triển thêm](#tính-năng-dự-kiến-phát-triển-thêm)
- [Giấy phép](#giấy-phép)

---

## Tính năng

- Đăng ký tài khoản mới với **username**, **email**, **mật khẩu**.
- Đăng nhập bằng username hoặc email.
- Lưu phiên đăng nhập (**session**) trực tiếp trong MongoDB.
- Trang **Dashboard** được bảo vệ, chỉ truy cập được khi đã đăng nhập.
- Chức năng đăng xuất, huỷ phiên làm việc.

---

## Công nghệ sử dụng

| Thành phần        | Công nghệ            |
|-------------------|------------------------|
| Backend           | Node.js, Express.js   |
| Cơ sở dữ liệu     | MongoDB, Mongoose     |
| Mã hoá mật khẩu   | bcryptjs               |
| Quản lý phiên     | express-session, connect-mongo |
| Giao diện         | HTML, CSS, JavaScript thuần |

---

## Cấu trúc thư mục

```
login-web/
├── .env
├── package.json
├── server.js
├── config/
│   └── database.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── middleware/
│   └── authCheck.js
└── public/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    └── css/
        └── style.css
```

---

## Yêu cầu hệ thống

- **Node.js** phiên bản 16 trở lên.
- Tài khoản **MongoDB** (có thể dùng MongoDB Atlas miễn phí hoặc MongoDB cài local).
- Trình quản lý gói **npm** (đi kèm sẵn khi cài Node.js).

---

## Hướng dẫn cài đặt

**Bước 1.** Clone hoặc tải mã nguồn dự án về máy.

```bash
git clone https://github.com/ten-nguoi-dung/login-web.git
cd login-web
```

**Bước 2.** Cài đặt các gói phụ thuộc.

```bash
npm install
```

---

## Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc của dự án với nội dung sau:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/loginweb
SESSION_SECRET=chuoi_bi_mat_tuy_chon_cua_ban
PORT=3000
```

**Giải thích các biến:**

| Biến | Mô tả |
|---|---|
| `MONGO_URI` | Chuỗi kết nối đến cơ sở dữ liệu MongoDB |
| `SESSION_SECRET` | Chuỗi bí mật dùng để mã hoá session, có thể đặt tuỳ ý |
| `PORT` | Cổng chạy server, mặc định là 3000 |

---

## Cách chạy dự án

Sau khi cài đặt và cấu hình xong, chạy lệnh sau để khởi động server:

```bash
npm start
```

Nếu khởi động thành công, terminal sẽ hiển thị:

```
Đã kết nối MongoDB!
Server chạy tại http://localhost:3000
```

---

## Hướng dẫn sử dụng

1. Mở trình duyệt, truy cập địa chỉ: `http://localhost:3000/register.html`
2. Điền thông tin đăng ký (username, email, mật khẩu) và nhấn **Đăng ký**.
3. Sau khi đăng ký thành công, hệ thống tự động chuyển hướng đến trang `dashboard.html`.
4. Những lần truy cập sau có thể đăng nhập trực tiếp tại: `http://localhost:3000/login.html`
5. Nhấn nút **Đăng xuất** trên trang Dashboard để kết thúc phiên làm việc.

---

## Bảo mật đã áp dụng

**Mã hoá mật khẩu**
Mật khẩu người dùng không được lưu dưới dạng văn bản thường. Toàn bộ mật khẩu được băm (hash) một chiều bằng thư viện `bcryptjs` trước khi lưu vào cơ sở dữ liệu. Điều này đồng nghĩa với việc kể cả quản trị viên hệ thống cũng không thể xem được mật khẩu gốc của người dùng.

**Quản lý phiên đăng nhập an toàn**
Phiên đăng nhập (session) được lưu trữ tập trung trong MongoDB thông qua `connect-mongo`, thay vì lưu trong `localStorage` của trình duyệt. Cách làm này giúp hạn chế rủi ro bị tấn công qua lỗ hổng **Cross-Site Scripting (XSS)**.

**Middleware kiểm tra xác thực**
Trang `dashboard.html` được bảo vệ bởi middleware `requireLogin`. Nếu người dùng chưa đăng nhập mà cố truy cập trực tiếp vào đường dẫn này, hệ thống sẽ tự động chuyển hướng về trang đăng nhập.

---

## Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `MongooseServerSelectionError` | Sai chuỗi kết nối MongoDB hoặc chưa mở quyền truy cập mạng | Kiểm tra lại giá trị `MONGO_URI` trong file `.env`, đồng thời mở mục **Network Access** trên MongoDB Atlas và thêm địa chỉ IP `0.0.0.0/0` |
| `Cannot find module 'express'` | Chưa cài đặt các gói phụ thuộc | Chạy lại lệnh `npm install` |
| Cổng 3000 đã được sử dụng | Có ứng dụng khác đang chiếm cổng này | Đổi giá trị `PORT` trong file `.env` sang một số khác, ví dụ `3001` |

---

## Tính năng dự kiến phát triển thêm

- Chức năng quên mật khẩu và đặt lại mật khẩu qua email.
- Đăng nhập liên kết với tài khoản Google hoặc Discord (OAuth2).
- Giới hạn số lần đăng nhập sai để chống tấn công dò mật khẩu (brute-force).
- Phân quyền người dùng theo vai trò Quản trị viên và Người dùng thường.

---

## Giấy phép

Dự án được phát hành tự do cho mục đích học tập và phát triển cá nhân, nghiêm cấm hành vi thương mại.
