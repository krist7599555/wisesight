import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
const Content = ({email, resend}) => (
  <div> 
    <h3>Waiting verify</h3>
    <p>
      เราได้ส่ง link ยืนยันการสมัครสมาชิกไปที่ <br/>
      <strong>{email}</strong> ของคุณแล้ว
    </p>
    <p>แบบยืนยันมีอายุ 1 ชม หากไม่ได้รับแบบยืนยัน <br/>
      สามารถขอคำร้องใหม่ได้ด้านล่าง และคำร้องเก่าจะไม่สามารถใช้งานได้
    </p>
    <button className="button is-danger" onClick={resend}> 
      <span className="icon">
        <FontAwesomeIcon icon="envelope"></FontAwesomeIcon>
      </span>
      <span>ส่งคำร้องไปที่ email อีกครั้ง </span>
    </button>
  </div>
)
export default Content;