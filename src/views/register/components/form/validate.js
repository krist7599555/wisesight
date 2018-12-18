export function validate(evt) {
  let {type, name, value} = evt.target;
  let validate = {
    password: val => /^[a-zA-Z0-9]{8,}$/.test(val),
    password_2: val => val == this.state.password,
    email: val => /^.+@.+\..+$/.test(val),
  }
  let error = {
    password: "atleast 8 number or english charactor",
    password_2: "password must same as above",
    email: "email address is invalid",
  }
  evt.target.setCustomValidity(validate[name](value) ? "" : error[name]);
}