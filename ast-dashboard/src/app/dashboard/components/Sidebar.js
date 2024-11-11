// src/app/dashboard/components/Sidebar.js

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar" style={{ backgroundColor: "#091e91" }}>
      <img
        src="/assets/images/logo.png"
        alt="Logo"
        class="brand-image"
        style={{ width: "30px", height: "30px" }}
      />

      <span class="brand-text font-weight-light">ASIA TEXTILE CO., LTD.</span>
      <br/>
      <span class="brand-text font-weight-light" style={{marginTop:"5px"}}>
        <img
          src="/assets/images/logo.png"
          alt="Logo"
          class="brand-image"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%", 
          }}
        />
        User test
      </span>
      <ul>
        <li>
          <Link href="/dashboard/home">หน้าแรก</Link>
        </li>
        <li>
          <Link href="/dashboard/users">ผู้ใช้งาน</Link>
        </li>
        <li>
          <Link href="/dashboard/order">ออเดอร์</Link>
        </li>
        <li>
          <Link href="/dashboard/stock">สต๊อกผ้า</Link>
        </li>
        <li>
          <Link href="/dashboard/stockcustomer">สต๊อกผ้าฝากจัดเก็บ</Link>
        </li>
        <li>
          <Link href="/dashboard/stockmaterial">สต๊อกวัตถุดิบ</Link>
        </li>
        <li>
          <Link href="/dashboard/settings">ตั้งค่า</Link>
        </li>
      </ul>
    </div>
  );
}
