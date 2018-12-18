[logo]: https://wisesight.com/wp-content/uploads/2018/07/logo-primary-tagline.jpg "wisesight logo"

![alt text][logo]

## Package
  - Frontend
    - React
    - Bulma
    - Pug

  - Backend
    - node express
    - mongoDB
    - nodemailer
    - Jason WebToken

## Page
- Home
- Authentication
  - Login
  - Register
    - Terms & Condition
    - Form
    - Resend Email
  - Reset Password
  - Verify
- Profile
  - Info
  - Edit Profile
- Work
  - User Management
    - Set Permission

## Profile
```
  = fullname: english
  = email
  = phone: [0-9]{10}
  = username: [a-zA-Z0-9]{5,} 
  = password: [a-zA-Z0-9]{5,} 
  = permission: [admin, supervisor, normal(default)]
  = extra_permission: [String]
  = tags: [String]
```
- `fullname`
  - จะไม่ถูกนำมาประมวณผล
  -  เป็นรูปแบบใดก็ได้แล้วแต่ user จะกำหนด

- `username`
  - ใช่เพื่อให้เข้าสู่ระบบได้ง่ายขึ้น

- `extraPermission`
  - จะใช้ประมวลผลสำหรับงานที่เฉพาะเจาะจงมากๆเท่านั้น

- `tags`
  - จะไม่ถูกนำมาประมวณผล
  - สามารถใส่สถานะหลายอย่างได้ eg. [IT, ประธาน, ประสานงาน]

- `permission` 
  ```
    admin           : can do everything
    supervisor      : can manage users and assign jobs to users
    normal(default) : can only check check sentiment
  ```

- `extra_permission`
  - สำหรับงานที่เฉพาะเจาะจงจริงๆเท่านั้น e.g. เพิ่มคนเข้าทีม
  - สามารถมีหลายสถานะได้

- `username`, `email`, `phone` จะไม่สามารถถูกแก้ไขได้

- ไม่มีการเก็บรูปภาพใดๆทั้งสิ้น

## Authentication
- การลงทะเบียน `username, email, phone` จะต้องไม่ซ้ำกับคนอื่น
- เข้าสู่ระบบโดย `any(username, email, phone) + password`
- คำขอ reset password จะถูกส่งไปที่ email
- จะเป็นการส่ง link ไปให้ยืนยันทาง email สร้างโดย JWT
- การ login ผ่าน platform อื่นๆ eg. gmail, facebook
ยังไม่ถูกดำเนินการตอนนี้ เพราะสามารถเข้าสู่ระบบด้วย
email หรือ username ได้อยู่ดี



## Authentication Detail
- register (unique email, username, phone)
- login using any of [`email`, `username`, `phone`] and `password`
  - must confirm email before login
- forgot password
  - require phone number and (username or email)
  - then sent password reset link to email
  - that link = token , pass to front end, from end actually call API /user/reset-password
- change password
  - need to retype password before changing
- verify token
- test whether token is valid or not (front-end should check here before render webpage)

## Token

- this system uses JWT (JSON web token) to authenticate
- ทุก token มีขอบเขตการทำงานที่ชัดเจน eg. can't use password reset token to login
- บาง token หมดอายุได้ eg. `reset_password`, `confirm_email`
- ทุก tokens จะไม่สามารถใช้ได้ถ้า password เปลี่ยน

## Permissions
|Permission   	  |Admin|Supervisor|Normal| 
| --------------------- | ---	| ---	| ---	|
|Check Sentiment	  	  |  Y  |  Y  |  Y  |
|Export Report   	      |  Y  |  Y  |     |
|Create Task   	        |  Y  |  Y  |     |
|Assign Task  	        |  Y  |  Y  |     |
|Manage User Permission |  Y  |  Y  |     |
|Add New Permission  	  |  Y  |     |     |
