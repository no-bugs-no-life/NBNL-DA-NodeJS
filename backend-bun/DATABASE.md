# Thiết kế Cơ sở dữ liệu (Database Schema)

Dựa trên các schema (Zod validation & Types) đã được định nghĩa tại backend (`src/modules/**/*.schema.ts`), dưới đây là bản thiết kế hệ thống CSDL (MongoDB/Mongoose) cập nhật nhất.

---

## 1. Bảng `users` (Người dùng)
Lưu trữ thông tin xác thực, hồ sơ cá nhân và phân quyền.
- `_id`: ObjectId
- `username`: String (Unique, 3-30 ký tự)
- `email`: String (Unique)
- `password`: String (Hashed)
- `fullName`: String 
- `avatar`: String (URL)
- `cover`: String (URL)
- `bio`: String
- `socialLinks`: Object `{ facebook, twitter, github, linkedin, website }`
- `role`: String (Enum: dựa trên `UserRole`)
- `coin`: Number (Default: `0`)
- `level`: Number (Default: `1`)
- `xp`: Number (Default: `0`)
- `maxXp`: Number (Tính toán level up)
- `createdAt`: Date
- `updatedAt`: Date

## 2. Bảng `apps` (Ứng dụng / Game)
Lưu trữ thông tin về sản phẩm (ứng dụng / game) được upload bởi Developer.
- `_id`: ObjectId
- `name`: String
- `slug`: String (Unique)
- `description`: String
- `iconUrl`: String
- `price`: Number (Default: `0`)
- `status`: String (Enum: `pending`, `published`, `rejected`, `archived`)
- `developer`: ObjectId (Ref to `developers` / `users`)
- `category`: ObjectId (Ref to `categories`)
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
- `parentId`: ObjectId (Ref to `categories` - Dạng đệ quy, Nullable)
- `createdAt`: Date
- `updatedAt`: Date

## 4. Bảng `tags` (Thẻ phân loại)
- `_id`: ObjectId
- `name`: String
- `slug`: String (Unique)
- `createdAt`: Date
- `updatedAt`: Date

## 5. Bảng `reviews` (Đánh giá)
Lưu trữ nhận xét và điểm số của user cho một App.
- `_id`: ObjectId
- `app`: ObjectId (Ref to `apps`)
- `user`: ObjectId (Ref to `users`)
- `rating`: Number (1-5)
- `comment`: String
- `status`: String (Enum: `pending`, `approved`, `rejected`)
- `createdAt`: Date
- `updatedAt`: Date

## 6. Bảng `coupons` (Mã giảm giá)
- `_id`: ObjectId
- `code`: String (Unique)
- `discountType`: String (Enum: từ `DiscountType`, vd: `percentage`, `fixed`)
- `discountValue`: Number
- `startDate`: Date
- `endDate`: Date
- `usageLimit`: Number (Default: `100`)
- `usedCount`: Number (Default: `0`)
- `apps`: Array of ObjectId (Ref to `apps` - Áp dụng cho app cụ thể, nếu rỗng là toàn hệ thống)
- `createdAt`: Date
- `updatedAt`: Date

## 7. Bảng `reports` (Báo cáo vi phạm)
Dùng khi User hoặc Admin báo cáo App hoặc Review.
- `_id`: ObjectId
- `targetType`: String (Enum từ `ReportTargetType`)
- `target`: ObjectId (Ref đứt gãy tới `apps` hoặc `reviews`)
- `reason`: String
- `status`: String (Enum từ `ReportStatus`)
- `adminNote`: String
- `createdAt`: Date
- `updatedAt`: Date

## 8. Bảng `sub_packages` (Gói Subscriptions)
Các gói cước (ủng hộ, premium, v.v) có thể liên kết chung hoặc cho riêng một app.
- `_id`: ObjectId
- `name`: String
- `app`: ObjectId (Ref to `apps`)
- `type`: String (Enum: `monthly`, `yearly`, `lifetime`)
- `price`: Number
- `durationDays`: Number
- `description`: String
- `isActive`: Boolean (Default: `true`)
- `createdAt`: Date
- `updatedAt`: Date

## 9. Bảng `subscriptions` (Lịch sử đăng ký / Thuê bao)
Lưu lịch sử một user mua sub-package.
- `_id`: ObjectId
- `user`: ObjectId (Ref to `users`)
- `app`: ObjectId (Ref to `apps` - Optional)
- `subPackage`: ObjectId (Ref to `sub_packages`)
- `status`: String (Enum: `active`, `expired`, `cancelled`)
- `endDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

## 10. Bảng `notifications` (Thông báo)
- `_id`: ObjectId
- `user`: ObjectId (Ref to `users`)
- `type`: String (Enum: `app_approved`, `app_rejected`, `new_review`, `new_download`, `system`, `promotion`, `update`, `sendmail`)
- `message`: String
- `channel`: String (Enum: `inapp`, `email`, `firebase`. Default: `inapp`)
- `isRead`: Boolean (Default: `false`)
- `createdAt`: Date

## 11. Bảng `files` / `media` (Quản lý Storage)
Quản lý tệp tin đã upload.
- `_id`: ObjectId
- `ownerType`: String (Enum: `app`, `user`, `developer`)
- `ownerId`: ObjectId (Lưu trữ ObjectId của chủ sở hữu tương ứng)
- `fileType`: String (Enum: `apk`, `ipa`, `icon`, `banner`, `screenshot`, `avatar`, `other`)
- `url`: String (URL từ storage provider)
- `createdAt`: Date

## 12. Carts & Orders (Giỏ hàng và Thanh toán)
* **`carts`**
  - `user`: ObjectId (Ref to `users`)
  - `app`: ObjectId (Ref to `apps`)
  - `itemType`: String (Enum dựa theo `CartItemType`)
  - `plan`: String (Enum dựa theo `SubscriptionPlan` - Optional)
  - `quantity`: Number (Default: `1`)
* **`orders`**
  - `user`: ObjectId (Ref to `users`)
  - `items`: Array of `{ app: ObjectId, name: String, price: Number, iconUrl: String }`
  - `totalAmount`: Number
  - `couponCode`: String
  - `paymentMethod`: String (Enum dựa theo `PaymentMethod`)
  - `status`: String (Enum: `pending`, `processing`, `completed`, `failed`, `cancelled`)
  - `adminNote`: String
  - `createdAt`: Date

## 13. Bảng `developers` (Nhà phát triển)
Lưu trữ hồ sơ và trạng thái duyệt của Developer.
- `_id`: ObjectId
- `userId`: ObjectId (Ref to `users`)
- `name`: String
- `bio`: String
- `website`: String
- `avatarUrl`: String
- `contactEmail`: String
- `socialLinks`: Object
- `permissions`: Object `{ canPublishApp, canEditOwnApps, canDeleteOwnApps, canViewAnalytics, canManagePricing, canRespondReviews }`
- `status`: String (Enum: `pending`, `approved`, `rejected`)
- `rejectionReason`: String (Lý do từ chối - Optional)
- `createdAt`: Date
- `updatedAt`: Date

## 14. Bảng `versions` (Phiên bản App)
Lưu trữ thông tin các bản phát hành của từng ứng dụng/game.
- `_id`: ObjectId
- `app`: ObjectId (Ref to `apps`)
- `versionNumber`: String
- `versionCode`: Number
- `releaseName`: String
- `changelog`: String
- `files`: Array of `{ platform, fileKey, fileName, fileSize, mimeType, checksum }` (Platform enum: `android`, `ios`, `windows`, `macos`, `linux`, `web`)
- `accessControl`: Object `{ isFree, requiresPurchase, requiredSubscription, allowedRoles, allowedUserIds }`
- `status`: String (Enum: `draft`, `published`, `deprecated`, `archived`)
- `isLatest`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

## 15. Bảng `wishlists` (Danh sách yêu thích)
Lưu trữ danh sách ứng dụng/game mà User đưa vào Wishlist.
- `_id`: ObjectId
- `user`: ObjectId (Ref to `users`)
- `apps`: Array of ObjectId (Ref to `apps`)
- `createdAt`: Date
- `updatedAt`: Date
