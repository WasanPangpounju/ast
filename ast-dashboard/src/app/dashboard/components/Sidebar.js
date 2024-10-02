// src/app/dashboard/components/Sidebar.js

import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="sidebar" style={{ backgroundColor: '#2160A2' }}>
            {/* <h2>Dashboard</h2>
            <ul>
                <li><Link href="/dashboard/home">หน้าแรก</Link></li>
                <li><Link href="/dashboard/users">ผู้ใช้งาน</Link></li>
                <li><Link href="/dashboard/order">ออเดอร์</Link></li>
                <li><Link href="/dashboard/stock">สต๊อกผ้า</Link></li>
                <li><Link href="/dashboard/stockcustomer">สต๊อกผ้าฝากจัดเก็บ</Link></li>
                <li><Link href="/dashboard/stockmaterial">สต๊อกวัตถุดิบ</Link></li>
                <li><Link href="/dashboard/settings">ตั้งค่า</Link></li>
            </ul> */}
            <body class="hold-transition sidebar-mini">

<div class="wrapper">

    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i
                        class="fas fa-bars"></i></a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item Fullscreen">
                {/* <a class="nav-link" data-widget="fullscreen" href="#" role="button"
                    style="letter-spacing: 1px;">
                    ดูเต็มจอ <i class="fas fa-expand-arrows-alt"></i> </a> */}
            </li>
            <li class="nav-item logout">
                <a class="nav-link" href="{{ route('logout') }}"
                    onclick="event.preventDefault();
                                                 document.getElementById('logout-form').submit();">
                    ออกจากระบบ &nbsp;
                    {/* <img src="<?php echo asset('assets/images/arrow-right-from-bracket-solid.png'); ?>" width="17"></i> */}
                </a>

                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                </form>

            </li>
        </ul>
    </nav>

    <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index.php" class="brand-link">
            {/* <img src="<?php echo asset('assets/images/logo.png'); ?>" alt="Logo" class="brand-image" style=""> */}
            <span class="brand-text font-weight-light">ASIA TEXTILE CO., LTD.</span>
        </a>
        <div class="sidebar">
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                <div class="image">
                    {/* <img src="<?php echo asset('assets/images/admin.jpg'); ?>" class="img-circle" alt="User Image"> */}
                </div>
                <div class="info">
                    <a href="#" class="d-block">
                        {/* <p>{{ Auth::user()->name }}</p>{{ Auth::user()->user_type }} */}
                    </a>
                </div>
            </div>
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                    data-accordion="false">
                    <li class="nav-item">
                        <a href="/home" class="nav-link"><i class="nav-icon fas fa-tachometer-alt"></i>
                            <p>หน้าหลัก</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fas fa-shopping-cart"></i>
                            <p>ระบบซื้อขาย <i class="right fas fa-angle-left"></i><i class=""></i></p>
                        </a>

                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{ route('customer.index') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>ข้อมูลลูกค้า</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('supplier.index') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>ข้อมูลซัพพลายเออร์</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('order.create') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>ใบคำใบสั่งขาย</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('order.index') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>ตรวจสอบใบใบสั่งขาย</p>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link"><i class="nav-icon fas fa fa-folder"></i>
                            <p> ระบบคลังสินค้า</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link"><i class="nav-icon fas fa fa-folder"></i>
                            <p> ระบบผลิตสินค้า</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">
                            <i class="nav-icon fas fa-shopping-cart"></i>
                            <p>วัตถุดิบ <i class="right fas fa-angle-left"></i><i class=""></i></p>
                        </a>

                        <ul class="nav nav-treeview">
                            <li class="nav-item">
                                <a href="{{ route('material.index') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>ตรวจสอบนำเข้าวัตถุดิบ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('materialstore.index') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>ตรวจสอบเบิกวัตถุดิบ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('material.create') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>นำเข้าวัตถุดิบ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="add_withdraw_materials_outside.php" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>เบิกวัตถุดิบออกภายนอก</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('materialstore.create') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>เบิกวัตถุดิบออกภายใน</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('package.create') }}" class="nav-link"><i
                                        class="far fa-circle nav-icon"></i>
                                    <p>คืนบรรจุภัณฑ์</p>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link"><i class="nav-icon fas fa fa-user"></i>
                            <p>ผู้ตรวจสอบ<i class="right fas fa-angle-left"></i><i class=""></i></p>
                        </a>
                        <ul class="nav nav-treeview">
                            <li class="nav-item"><a href="{{ route('materialstock.index') }}"
                                    class="nav-link"><i class="far fa-circle nav-icon"></i>
                                    <p>ตรวจสอบวัตถุดิบ</p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="" class="nav-link"><i class="far fa-circle nav-icon"></i>
                                    <p>ตรวจสอบคำใบสั่งขาย</p>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item"><a href="#" class="nav-link"><i
                                class="nav-icon fas fa fa-cog"></i>
                            <p> ตั้งค่า</p>
                        </a></li>
                </ul>
            </nav>
        </div>
    </aside>




</div>

<footer class="main-footer">
    Copyright © 2022 Asia Industrial Textile Co., Ltd. (AIT) All rights reserved.
</footer>


<script src="<?php echo asset('assets/js/jquery.min.js'); ?>"></script>

<script src="<?php echo asset('assets/js/select2.full.min.js'); ?>"></script>

<script src="<?php echo asset('assets/js/moment.min.js'); ?>"></script>
<script src="<?php echo asset('assets/js/jquery.inputmask.min.js'); ?>"></script>
<script src="<?php echo asset('assets/js/daterangepicker.js'); ?>"></script>

<script src="<?php echo asset('assets/js/tempusdominus-bootstrap-4.min.js'); ?>"></script>

<script src="<?php echo asset('assets/js/adminlte.min.js'); ?>"></script>
<script>
    $(function() {
        //Datemask dd/mm/yyyy
        $('#datemask').inputmask('dd/mm/yyyy', {
            'placeholder': 'dd/mm/yyyy'
        })
        //Datemask2 mm/dd/yyyy
        // $('#datemask2').inputmask('dd/mm/yyyy', {
        //     'placeholder': 'dd/mm/yyyy'
        // })
        //Money Euro
        // $('[data-mask]').inputmask()

        //Date picker
        // $('#reservationdate').datetimepicker({
        //     format: 'L'
        // });
    })
</script>


</body>
        </div>
    );
}
