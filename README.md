Fashion Shop

Website thương mại điện tử bán quần áo, xây dựng bằng Next.js 16 + PostgreSQL. Đây là **đồ án môn học**, không phải sản phẩm thương mại thật — mọi giao dịch (thanh toán, ví) đều mô phỏng trong phạm vi ứng dụng, không kết nối cổng thanh toán bên ngoài.

Mô tả

- Mục tiêu: xây dựng một website thương mại điện tử hoàn chỉnh, phong cách thiết kế tối giản/editorial (tham khảo các brand thời trang/outdoor cao cấp), có đầy đủ vòng đời một đơn hàng thật: xem sản phẩm → giỏ hàng → đăng nhập → đặt hàng → thanh toán → xem lại lịch sử — cùng một khu quản trị để vận hành cửa hàng.
- Đối tượng dùng:
  - Khách mua hàng: duyệt catalog, xem chi tiết sản phẩm, thêm giỏ hàng, đăng ký/đăng nhập, đặt hàng, nạp và thanh toán bằng ví nội bộ, đánh giá sản phẩm.
  - Quản trị viên (`role: ADMIN`): quản lý sản phẩm (CRUD + ảnh) và quản lý tài khoản người dùng (cấp quyền, sửa, xoá).

Tính năng chính

Mô tả :
- Trang chủ & Catalog : Trang chủ dạng editorial, danh sách sản phẩm có filter theo giới tính, trang chi tiết sản phẩm (ảnh, màu, mô tả, đánh giá).
- Giỏ hàng & Thanh toán : Giỏ hàng phía client (Zustand + localStorage), checkout với 4 phương thức: COD / chuyển khoản / thẻ / **Ví Fashion Shop**.
- Tài khoản : Đăng ký/đăng nhập thật (Auth.js), xem hồ sơ, lịch sử ví.
- Ví (Wallet) : Nạp tiền mô phỏng, thanh toán đơn hàng bằng số dư ví, lịch sử giao dịch.
- Đánh giá & Feedback : Đánh giá theo sao + bình luận trên từng sản phẩm, testimonials chung ở trang chủ.
- Quản trị — Sản phẩm : CRUD sản phẩm tại `/admin/products`, upload nhiều ảnh/sản phẩm (từ máy hoặc dán URL), ảnh dự phòng tự động khi sản phẩm chưa có ảnh thật.
- Quản trị — Tài khoản : `/admin/users`: cấp/gỡ quyền admin, sửa hồ sơ, xoá tài khoản — có chặn tự khoá quyền của chính mình và chặn gỡ quyền admin cuối cùng.

Công nghệ sử dụng

- Framework : Next.js 16 (App Router, Turbopack) + TypeScript + React 19.
- Styling : Tailwind CSS v4.
- Database & ORM : PostgreSQL (bản portable, không cần quyền admin) + Prisma 7 (driver adapter `@prisma/adapter-pg`).
- Xác thực : Auth.js (`next-auth` v5, Credentials provider, session JWT).
- Validate : Zod.
- Mật khẩu : bcryptjs.
- State giỏ hàng : Zustand + persist (localStorage)
- Animation : Framer Motion (scroll-reveal cho mọi section).
- Ảnh sản phẩm : Upload qua Vercel Blob (`@vercel/blob`), hoặc dán URL ngoài — có ảnh dự phòng dạng gradient khi sản phẩm chưa có ảnh thật.

Hướng dẫn cài đặt & chạy

Yêu cầu: Node.js ≥ 20.19 (khuyến nghị dùng bản mới nhất).

```powershell
# 1. Cài dependencies
npm install

# 2. Khởi động PostgreSQL portable (bắt buộc trước mọi lệnh Prisma/dev)
npm run db:start

# 3. Khởi tạo database + generate Prisma Client
npx prisma migrate dev
npx prisma generate

# 4. Seed dữ liệu mẫu (16 sản phẩm, testimonials, tài khoản demo/admin)
npm run db:seed

# 5. Chạy dev server
npm run dev
```

Mở `http://localhost:3000`.

Tài khoản demo có sẵn

Khách hàng : `demo@fashionshop.vn` , `Demo123456`.
Quản trị viên : `admin@fashionshop.vn` , `Admin123456`.

Cấu trúc thư mục (rút gọn)

```
/app          Trang & route (App Router) — bao gồm /admin/products, /admin/users
/components   Component UI theo domain (product, cart, admin, checkout...)
/lib          queries (đọc dữ liệu), actions (ghi dữ liệu — Server Actions), stores, storage
/prisma       schema.prisma, seed data, migrations
/scripts      Script QA bằng Playwright
``` 
