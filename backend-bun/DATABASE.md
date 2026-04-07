# Thiết kế Cơ sở dữ liệu (Database Schema)

Dựa trên việc phân tích giao diện và mã nguồn Frontend cho dự án (đặc biệt là API hooks và các Service Admin), dưới đây là bản thiết kế hệ thống CSDL theo chuẩn NoSQL (MongoDB/Mongoose).

---

## 1. Bảng `users` (Người dùng)
Lưu trữ thông tin xác thực, hồ sơ cá nhân và phân quyền.
- `_id`: ObjectId
- `username`: String (Unique)
- `email`: String (Unique)
- `password`: String (Hashed)
- `fullName`: String 
- `avatar`: ObjectId (Ref to `files`) / String
- `role`: String (Enum: `USER`, `MODERATOR`, `ADMIN`, `DEVELOPER`)
- `coin`: Number (Default: `0`)
- `level`: Number (Default: `1`)
- `xp`: Number (Default: `0`)
- `maxXp`: Number (Tính toán level up)
- `bio`: String
- `cover`: ObjectId (Ref to `files`) / String
- `socialLinks`: Object `{ facebook, twitter, github, linkedin, website }`
- `createdAt`: Date
- `updatedAt`: Date

## 2. Bảng `apps` (Ứng dụng / Game)
Lưu trữ thông tin về sản phẩm (ứng dụng / game) được upload bởi Developer.
- `_id`: ObjectId
- `name`: String
- `slug`: String (Unique)
- `description`: String
- `iconUrl`: String
- `price`: Number
- `status`: String (Enum: `pending`, `published`, `rejected`, `archived`)
- `developerId`: ObjectId (Ref to `users`)
- `categoryId`: ObjectId (Ref to `categories`)
- `tags`: Array of ObjectId (Ref to `tags`)
- `ratingScore`: Number (Default: `0`)
- `ratingCount`: Number (Default: `0`)
- `isDisabled`: Boolean (Default: `false`)
- `isDeleted`: Boolean (Default: `false` - Soft delete)
- `createdAt`: Date
- `updatedAt`: Date

## 3. Bảng `categories` (Danh mục)
- `_id`: ObjectId
- `name`: String
- `slug`: String (Unique)
- `iconUrl`: String
- `createdAt`: Date
- `updatedAt`: Date

## 4. Bảng `tags` (Thẻ phân loại)
- `_id`: ObjectId
- `name`: String
- `slug`: String (Unique)

## 5. Bảng `reviews` (Đánh giá)
Lưu trữ nhận xét và điểm số của user cho một App.
- `_id`: ObjectId
- `appId`: ObjectId (Ref to `apps`)
- `userId`: ObjectId (Ref to `users`)
- `rating`: Number (1-5)
- `comment`: String
- `status`: String (Enum: `pending`, `approved`, `rejected`)
- `createdAt`: Date
- `updatedAt`: Date

## 6. Bảng `coupons` (Mã giảm giá)
- `_id`: ObjectId
- `code`: String (Unique)
- `discountType`: String (Enum: `percentage`, `fixed`)
- `discountValue`: Number
- `startDate`: Date
- `endDate`: Date
- `usageLimit`: Number
- `usedCount`: Number (Default: `0`)
- `appIds`: Array of ObjectId (Ref to `apps` - Áp dụng cho app cụ thể, nếu rỗng là toàn hệ thống)
- `createdAt`: Date
- `updatedAt`: Date

## 7. Bảng `reports` (Báo cáo vi phạm)
Dùng khi User hoặc Admin báo cáo App hoặc Review.
- `_id`: ObjectId
- `reporterId`: ObjectId (Ref to `users`)
- `targetType`: String (Enum: [app](file:///c:/WorkSpace/GitHub-Projects/NBNL-DA-NodeJS/frontend/app/admin/%28protected%29/apps/appsService.ts#83-91), `review`)
- `targetId`: ObjectId (Ref đứt gãy tới `apps` hoặc `reviews`)
- `reason`: String
- `status`: String (Enum: `pending`, `reviewed`, `resolved`, `dismissed`)
- `adminNote`: String
- `createdAt`: Date
- `updatedAt`: Date

## 8. Bảng `sub_packages` (Gói Subscriptions)
Các gói cước (ủng hộ, premium, v.v) có thể liên kết chung hoặc cho riêng một app.
- `_id`: ObjectId
- `name`: String
- `appId`: ObjectId (Ref to `apps`) - Nullable
- `type`: String (Enum: `monthly`, `yearly`, `lifetime`)
- `price`: Number
- `durationDays`: Number
- `description`: String
- `isActive`: Boolean (Default: `true`)
- `isDeleted`: Boolean (Default: `false`)
- `createdAt`: Date
- `updatedAt`: Date

## 9. Bảng `subscriptions` (Lịch sử đăng ký / Thuê bao)
Lưu lịch sử một user mua sub-package.
- `_id`: ObjectId
- `userId`: ObjectId (Ref to `users`)
- `subPackageId`: ObjectId (Ref to `sub_packages`)
- `status`: String (Enum: `active`, `expired`, `cancelled`)
- `startDate`: Date
- `endDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

## 10. Bảng `notifications` (Thông báo)
- `_id`: ObjectId
- `userId`: ObjectId (Ref to `users`)
- `title`: String
- `message`: String
- `type`: String (Ex: `system`, `promotion`, `report_update`, ...)
- `isRead`: Boolean (Default: `false`)
- `link`: String (URL điều hướng khi click)
- `createdAt`: Date

## 11. Bảng `files` / `media` (Quản lý Storage)
(Gợi ý) Quản lý tệp tin đã upload.
- `_id`: ObjectId
- `uploaderId`: ObjectId (Ref to `users`)
- `url`: String
- `fileKey`: String (Key trên S3/Cloud storage)
- `mimeType`: String
- `size`: Number
- `createdAt`: Date

## 12. Carts & Orders (Giỏ hàng và Thanh toán)
(Dựa trên route `/cart` và `/checkout`)
* **`carts`**
  - `userId`: ObjectId (Ref to `users`)
  - `items`: Array of `{ appId: ObjectId, priceAtAdded: Number }`
* **`orders`**
  - `userId`: ObjectId (Ref to `users`)
  - `items`: Array of `{ appId: ObjectId, price: Number }`
  - `totalAmount`: Number
  - `status`: String (Enum: `pending`, `completed`, `failed`)
  - `paymentMethod`: String (Ex: `momo`, `paypal`, `coin`)
  - `createdAt`: Date
