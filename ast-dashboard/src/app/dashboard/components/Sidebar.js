// src/app/dashboard/components/Sidebar.js

import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li><Link href="/dashboard/home">หน้าแรก</Link></li>
                <li><Link href="/dashboard/users">ผู้ใช้งาน</Link></li>
                <li><Link href="/dashboard/order">ออเดอร์</Link></li>
                <li><Link href="/dashboard/stock">สต๊อกผ้า</Link></li>
                <li><Link href="/dashboard/stockcustomer">สต๊อกผ้าฝากจัดเก็บ</Link></li>
                <li><Link href="/dashboard/stockmaterial">สต๊อกวัตถุดิบ</Link></li>
                <li><Link href="/dashboard/settings">ตั้งค่า</Link></li>
            </ul>
        </div>
    );
}
