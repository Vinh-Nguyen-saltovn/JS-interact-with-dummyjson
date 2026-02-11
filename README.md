# JS-interact-with-dummyjson

sự khác biệt giữa localStorage(1), sessionStorage(2) và Cookie(3) :

- dung lượng :

* 1 : lớn (5mb - 10mb)
* 2 : lớn (max 5mb)
* 3 : nhỏ (max 4kb)

- truy cập :

* 1 : client-side
* 2 : client-side
* 3 : client & server-side

- gửi lên server :

* 1 : ko
* 2 : ko
* 3 : có, trong HTTP request

- sử dụng tối ưu với mục đích :

* 1 : lưu cài đặt user, thông tin sản phẩm trong shopping-cart
* 2 : lưu tiến trình form điền nhiều bước, dữ liệu chỉ cần trong phạm vi 1 tab

- 3 : lưu thông tin đăng nhập, lưu cài đặt cá nhân, thu thập dữ liệu về sở thích duyệt web để hiển thị phù hợp với nhu cầu user

* ưu điểm :
* 1 : dung lượng lưu trữ lớn, tồn tại vĩnh viễn, ko mất khi lỡ tắt browser
* 2 : dung lượng lưu trữ lớn, bảo mật tốt hơn, tách biệt ở các tab khác nhau
* 3 : lưu được nhiều dataType khác nhau, có thể set dead-time, nếu ko set thì sẽ mất khi tab đóng

- nhược điểm :

* 1 :

- chỉ có thể lưu ở dạng string, gây mất cấu trúc ban đầu của dữ liệu
- bảo mật kém, có thể xem ở bất cứ tab nào trong cùng hệ thống

* 2 :

- chỉ có thể lưu ở dạng string, gây mất cấu trúc ban đầu của dữ liệu
- dữ liệu chỉ tồn tại khi tab mở, bị xóa ngay khi đóng tab
- tối đa 5mb, ko đủ cho các ứng dụng phức tạp

* 3 :

- bảo mật kém,dễ bị sửa/xóa
- giới hạn dung lượng chỉ 4kb, chỉ có thể lưu 1 lượng thông tin rất nhỏ
