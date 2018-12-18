# User management backend 
# db design 
  - User Collection
  - Team Collection
    - User as subdocument; need to be in sync w/ user



# authentication
## features 

### /api/user/..
  - `/register` (unique email, username, phone)
    > required information: 
    - must `/confirm` email before login
       - TODO: resend email
       -
  - `/login` using email/username/phone as `username` and `password` 
  - `/forgot-password`
    - require phone number and (username or email)
    - then sent password reset link to email
    - that link = token , pass to front end, from end actually call API `/reset-password`
  - `/change-password`
    - need to retype password before changing
  - `/verifyToken`
    - test whether token is valid or not (front-end should check here before render webpage)

## debug
  - `/listall` list all users in database

## token
this system uses JWT (JSON web token) to authenticate
  - each token has specified usage (scope) i.e. can't use password reset token to login 
  - some tokens can expire, currently only: `resetPassword`, `confirmEmail`
  - all tokens are invalidated  when user's password is changed


# user management 
 - add user to team
