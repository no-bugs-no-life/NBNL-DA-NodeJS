# NBNL-DA-NodeJS

Dự án fullstack theo mô hình marketplace phân phối ứng dụng/game, gồm:
- **Backend**: Bun + Hono + MongoDB + Redis (Modular Monolith).
- **Frontend**: Next.js App Router + React + TypeScript + Ant Design + React Query.

## Thành viên nhóm No Bugs No Life

- Huỳnh Tấn Hảo - 2280600862
- Lưu Trung Nghĩa - 2280602071
- Nguyễn Hoàng Hữu Toán - 2280603316
- Nguyễn Anh Tấn - 2280602881
- Lư Gia Huy - 2280601159

## Mục tiêu dự án

Xây dựng nền tảng quản lý và phân phối ứng dụng số với đầy đủ luồng:
- Người dùng duyệt app/game, xem chi tiết, thêm giỏ hàng, thanh toán, theo dõi lịch sử.
- Hệ thống quản trị quản lý app, danh mục, tag, coupon, review, file, báo cáo, thông báo, dashboard.
- Cổng developer để quản lý hồ sơ developer và ứng dụng do developer phát hành.

## Chức năng chính (đầy đủ theo code hiện tại)

### 1) Nhóm tính năng người dùng (Client)

- **Xác thực tài khoản**: đăng nhập, đăng xuất, làm mới token, lấy thông tin `me`.
- **Trang chủ**: hero, trending, collections, game nổi bật, danh sách gợi ý theo block.
- **Khám phá nội dung**:
  - Duyệt theo `apps`, `games`, `category`, `tags`.
  - Tìm kiếm app.
  - Xem trang chi tiết app theo slug.
- **Giỏ hàng & thanh toán**:
  - Thêm/sửa/xoá item trong giỏ.
  - Trang checkout và tạo đơn hàng.
  - Xác nhận thanh toán.
- **Wishlist**:
  - Xem wishlist cá nhân.
  - Thêm/xoá app khỏi wishlist.
  - Xoá toàn bộ wishlist.
- **Hồ sơ người dùng (`/profile`)**:
  - Tổng quan hồ sơ.
  - Library đã sở hữu.
  - Lịch sử đơn hàng.
  - Cài đặt thông tin.
  - Bảo mật tài khoản.
- **Deal / coupon**: xem các chương trình giảm giá và áp mã trong quy trình mua.
- **Thông báo**: lấy danh sách thông báo, số lượng chưa đọc, đánh dấu đã đọc.

### 2) Nhóm tính năng quản trị (Admin)

- **Dashboard**: thống kê tổng quan hệ thống, biểu đồ doanh thu/người dùng.
- **Quản lý Apps**:
  - CRUD app.
  - Duyệt app: approve / reject / publish / disable / đổi trạng thái.
  - Quản lý app theo từng developer.
- **Quản lý Developers**:
  - Danh sách, chi tiết, hồ sơ của chính developer.
  - Approve/reject/revoke và cập nhật quyền.
- **Quản lý Categories & Tags**: CRUD danh mục và tag.
- **Quản lý Reviews**:
  - CRUD review trên trang admin.
  - Duyệt review: approve/reject/reset.
- **Quản lý Carts**: xem và thao tác giỏ hàng phía admin.
- **Quản lý Orders**:
  - Tạo đơn.
  - Liệt kê đơn của user hoặc toàn hệ thống.
  - Cập nhật trạng thái đơn hàng.
- **Quản lý Coupons**:
  - CRUD mã giảm giá.
  - Lấy coupon hợp lệ.
  - Áp mã giảm giá.
- **Quản lý Sub-packages / Subscriptions**:
  - Quản lý gói đăng ký.
  - Tạo, gia hạn, huỷ, kiểm tra trạng thái active.
- **Quản lý Reports**: tạo báo cáo, xử lý trạng thái báo cáo, xoá báo cáo.
- **Quản lý Notifications**:
  - Tạo/cập nhật/xoá thông báo.
  - Đánh dấu đã đọc 1 hoặc tất cả.
- **Quản lý Files**:
  - Upload ảnh và file app.
  - CRUD metadata file.
- **Analytics**: truy vấn dữ liệu phân tích và summary cho admin.

### 3) API backend theo module

Tất cả API được mount qua base:
- `http://localhost:3000/api/v1`

Các nhóm endpoint chính:
- `/auth`
- `/users`
- `/apps`
- `/categories`
- `/tags`
- `/reviews`
- `/coupons`
- `/carts`
- `/orders`
- `/wishlists`
- `/developers`
- `/subscriptions`
- `/sub-packages`
- `/reports`
- `/notifications`
- `/files`
- `/versions`
- `/dashboard`
- `/analytics`

## Công nghệ sử dụng

### Backend (`backend-bun`)

- **Runtime**: Bun
- **Web framework**: Hono
- **Database**: MongoDB (Mongoose)
- **Cache/Rate limiting support**: Redis (ioredis)
- **Validation**: Zod
- **Logging**: Pino + pino-pretty
- **Security**: JWT access/refresh token, middleware auth, CORS
- **Architecture**: Modular Monolith, tách theo modules (controller/service/repository/schema)

### Frontend (`frontend`)

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Ant Design + TailwindCSS
- **Data fetching**: Axios + TanStack React Query
- **State management**: Zustand
- **Biểu đồ**: Recharts

## Cấu trúc thư mục

```text
NBNL-DA-NodeJS/
├── backend-bun/                  # API server Bun + Hono
│   ├── src/
│   │   ├── config/               # Cấu hình môi trường
│   │   ├── infra/                # DB, cache, logger
│   │   ├── modules/              # Auth, Users, Apps, Orders, ...
│   │   ├── routes/               # Router tổng /api/v1
│   │   └── shared/               # Base classes, middleware, utils
│   └── .env.example
├── frontend/                     # Next.js client + admin
│   ├── app/                      # App Router pages
│   ├── components/               # UI components
│   ├── hooks/                    # React Query hooks
│   ├── configs/                  # API URL config
│   └── lib/                      # Axios instance/interceptors
└── README.md
```

## Yêu cầu hệ thống

- Node.js (khuyến nghị LTS mới)
- Bun
- MongoDB
- Redis

## Cài đặt và chạy dự án

### 1) Clone source

```bash
git clone <repo-url>
cd NBNL-DA-NodeJS
```

### 2) Cài dependencies

```bash
cd backend-bun
bun install

cd ../frontend
npm install
```

### 3) Cấu hình môi trường

Tạo file `.env` trong `backend-bun` từ `.env.example`:

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
MONGODB_URI=mongodb://localhost:27017/nbnl
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=super-secret-access-key-dev
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_SECRET=super-secret-refresh-key-dev
JWT_REFRESH_EXPIRES_IN=604800
CORS_ORIGIN=http://localhost:4000
```

Tạo file `.env.local` trong `frontend`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4) Chạy backend

```bash
cd backend-bun
bun run dev
```

Backend mặc định chạy tại: `http://localhost:3000`

### 5) Chạy frontend

```bash
cd frontend
npm run dev
```

Frontend mặc định chạy tại: `http://localhost:4000`

## Scripts quan trọng

### Backend

- `bun run dev`: chạy server chế độ watch.
- `bun start`: chạy production.
- `bun run lint`: lint bằng Biome.
- `bun run format`: format bằng Biome.
- `bun run seed`: seed dữ liệu mẫu.

### Frontend

- `npm run dev`: chạy dev server cổng 4000.
- `npm run build`: build production.
- `npm run start`: chạy build production cổng 4000.
- `npm run lint`: kiểm tra lint.
- `npm run format`: format code bằng Prettier.

## Ghi chú vận hành

- Frontend dùng Axios `withCredentials` để gửi cookie JWT.
- Interceptor frontend tự xử lý `401` và điều hướng về `/login`.
- Backend có global error handler, response chuẩn hoá và token bucket rate limiter.

## Định hướng phát triển tiếp

- Hoàn thiện test tự động (unit/integration/e2e) cho các module trọng yếu.
- Chuẩn hoá tài liệu API (OpenAPI/Swagger).
- Bổ sung CI/CD cho lint, test, build và deploy.