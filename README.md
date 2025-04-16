# Simple Book Rental - Frontend

Đây là phần frontend của hệ thống Simple Book Rental, một ứng dụng cho thuê sách trực tuyến được xây dựng bằng Vanilla JavaScript, HTML và CSS.

## Tính năng

- Đăng ký và đăng nhập người dùng
- Xem danh sách sách
- Tìm kiếm và lọc sách
- Xem chi tiết sách
- Thuê và trả sách
- Quản lý hồ sơ người dùng

## Cài đặt

### Yêu cầu

- Máy chủ web (Apache, Nginx, hoặc bất kỳ máy chủ web nào khác)
- Backend API đang chạy (xem file swagger.yaml để biết chi tiết API)

### Cài đặt thủ công

1. Clone repository này
2. Cấu hình máy chủ web để phục vụ các file tĩnh
3. Mở trình duyệt và truy cập vào địa chỉ của máy chủ web

### Sử dụng Docker

```bash
# Xây dựng image
docker build -t simple-book-rental-frontend .

# Chạy container
docker run -p 8080:80 simple-book-rental-frontend
```

Hoặc sử dụng Docker Compose:

```bash
docker-compose up -d
```

## Cấu trúc dự án

```
.
├── css/              # File CSS
├── js/               # File JavaScript
│   ├── api.js        # Module xử lý API
│   ├── auth.js       # Module xử lý xác thực
│   ├── app.js        # File JavaScript chính
│   └── utils.js      # Các hàm tiện ích
├── pages/            # Các trang HTML
├── index.html        # Trang chủ
├── Dockerfile        # Cấu hình Docker
├── docker-compose.yml # Cấu hình Docker Compose
└── README.md         # Tài liệu
```

## API Backend

Ứng dụng này sử dụng API RESTful được mô tả trong file `swagger.yaml`. Đảm bảo rằng backend API đang chạy và có thể truy cập được từ frontend.

## Phát triển

### Chỉnh sửa API URL

Mặc định, ứng dụng kết nối với API tại `http://localhost:3000/api/v1`. Để thay đổi URL này, hãy chỉnh sửa biến `API_BASE_URL` trong file `js/api.js`.

```javascript
const API_BASE_URL = 'http://your-api-url/api/v1';
```