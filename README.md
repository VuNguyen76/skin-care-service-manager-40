
# Skincare Specialist CMS

Hệ thống quản lý nội dung (CMS) cho ứng dụng chuyên gia chăm sóc da. Có cả giao diện quản trị và người dùng, nơi quản trị viên có thể quản lý tất cả nội dung, và người dùng có thể xem nội dung đã xuất bản.

## Tính năng

- Bảng điều khiển quản trị để quản lý nội dung
- Quản lý bài viết blog
- Quản lý dịch vụ
- Quản lý chuyên gia
- Quản lý đặt lịch
- Xác thực người dùng (vai trò quản trị viên và khách hàng)

## Bắt đầu

### Yêu cầu cài đặt

- Node.js (v16 hoặc mới hơn)
- npm hoặc yarn
- MySQL (Cơ sở dữ liệu)
- Java (JDK 11 hoặc mới hơn cho backend)
- Maven (Cho backend)

### Cài đặt và chạy

1. Clone repository:
   ```
   git clone [your-repository-url]
   cd skincare-cms
   ```

2. Cài đặt dependencies:
   ```
   npm install
   ```
   hoặc
   ```
   yarn
   ```

3. Cấu hình cơ sở dữ liệu:
   - Tạo cơ sở dữ liệu MySQL có tên `skincare_service`
   - Cập nhật thông tin kết nối trong file `src/main/resources/application.properties` nếu cần

4. Chạy backend (trong một terminal riêng):
   ```
   ./mvnw spring-boot:run
   ```
   hoặc nếu bạn đã cài đặt Maven:
   ```
   mvn spring-boot:run
   ```

5. Chạy frontend (trong terminal khác):
   ```
   npm run dev
   ```
   hoặc
   ```
   yarn dev
   ```

6. Mở trình duyệt và truy cập:
   ```
   http://localhost:8080
   ```

## Tài khoản thử nghiệm

Ứng dụng bao gồm các tài khoản thử nghiệm để phát triển:

### Tài khoản quản trị
- Tên đăng nhập: admin
- Mật khẩu: admin123

### Tài khoản người dùng
- Tên đăng nhập: user
- Mật khẩu: user123

Bạn có thể sử dụng những tài khoản này để đăng nhập và kiểm tra các tính năng khác nhau của ứng dụng.

## Cấu trúc dự án

- `/src/components` - Các thành phần UI có thể tái sử dụng
- `/src/pages` - Các trang chính của ứng dụng
- `/src/services` - API services và truy xuất dữ liệu
- `/src/hooks` - Custom React hooks
- `/src/components/ui` - Thư viện UI components (Shadcn UI)
- `/src/services/api` - Các API services được tách thành các module riêng biệt

## Hướng dẫn phát triển

- Sử dụng TypeScript cho an toàn kiểu dữ liệu
- Tuân theo các quy ước của Tailwind CSS cho styling
- Sử dụng React Query cho việc truy xuất dữ liệu
- Sử dụng thư viện component Shadcn UI khi có thể

## API Backend

Ứng dụng yêu cầu một API backend tại `http://localhost:8080/api`. Trong quá trình phát triển, dữ liệu giả được sử dụng khi backend không khả dụng.

## Đăng nhập thử nghiệm

Để đăng nhập nhanh với tài khoản thử nghiệm, bạn có thể sử dụng panel "Đăng nhập thử nghiệm" trên trang đăng nhập hoặc gọi hàm sau từ console:

```javascript
// Đăng nhập với tài khoản admin
authService.simulateLogin("admin");

// Đăng nhập với tài khoản người dùng
authService.simulateLogin("user");
```

Chức năng này chỉ có sẵn trong môi trường phát triển và không nên sử dụng trong sản phẩm thực tế.
