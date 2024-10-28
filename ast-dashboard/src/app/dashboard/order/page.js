// src/app/dashboard/users/page.js
"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";
import CustomerPieChart from "./CustomerPieChart.js";


export default function AstPurchaseorder() {

    const [astPurchaseorder, setAstPurchaseorder] = useState([]);
    const [filterOption, setFilterOption] = useState("lastYear");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredPurchaseorders, setFilteredPurchaseorders] = useState(astPurchaseorder);
  

    useEffect(() => {
      const fetchAstPurchaseorder = async () => {
        try {
          const response = await fetch("/api/astPurchaseorder");
          if (!response.ok) {
            throw new Error(`Failed to fetch materials: ${response.status}`);
          }
          const data = await response.json();
          setAstPurchaseorder(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAstPurchaseorder();
    }, []);
    console.log("astPurchaseorder", astPurchaseorder);

    useEffect(() => {
      // Logic to filter astPurchaseorder based on the selected filter option
      const filterOrders = () => {
        let filteredOrders = astPurchaseorder;
  
        if (filterOption === "selectDate" && startDate && endDate) {
          filteredOrders = astPurchaseorder.filter(order => {
            const createDate = new Date(order.createDate); // Assuming createDate is in a proper format
            return createDate >= new Date(startDate) && createDate <= new Date(endDate);
          });
        } else if (filterOption === "lastMonth") {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          filteredOrders = astPurchaseorder.filter(order => {
            const createDate = new Date(order.createDate);
            return createDate >= lastMonth;
          });
        } else if (filterOption === "lastYear") {
          const lastYear = new Date();
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          filteredOrders = astPurchaseorder.filter(order => {
            const createDate = new Date(order.createDate);
            return createDate >= lastYear;
          });
        }
  
        setFilteredPurchaseorders(filteredOrders);
      };
  
      filterOrders();
    }, [filterOption, startDate, endDate, astPurchaseorder]);

  return (
      <div>
          <h1>User Management</h1>
          <p>Manage all users from this section.</p>
          <section class="Frame">
          <h2>ตรวจสอบวัตถุดิบ น้ำหนักสุทธิ</h2>
          <div class="d-flex justify-content-end">
            <div className="row">
              <div class="col-md-12">
                <select
                  value={filterOption}
                  class="form-select"
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="lastYear">ปีล่าสุด</option>
                  <option value="lastMonth">เดือนล่าสุด</option>
                  <option value="selectDate">เลือกวันที่</option>
                </select>
              </div>
            </div>
          </div>
          <br />

          <div class="d-flex justify-content-end">
            {filterOption === "selectDate" && (
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <label>เริ่มวันที่:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>สิ้นสุดวันที่:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <br />
          <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
              <div class="container">
                <div class="row align-items-center mb-2">
                  <div class="col-md-4">ด้าย</div>
                  <div class="col-md-4">
                    <a>{spoolSum}</a>
                  </div>
                  <div class="col-md-3">ลูก</div>
                </div>

                <div class="row align-items-center mb-2">
                  <div class="col-md-4">ปอนด์</div>
                  <div class="col-md-4">
                    <a>{totalWeightPNet.toFixed(2)}</a>
                  </div>
                  <div class="col-md-4"></div>
                </div>

                <div class="row align-items-center mb-2">
                  <div class="col-md-4">กิโลกรัม</div>
                  <div class="col-md-4">
                    <a>{totalWeightKgNet.toFixed(2)}</a>
                  </div>
                  <div class="col-md-3"></div>
                </div>
              </div>
              <br />
            </div>
          </div>
          <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
              {/* <button class="btn b_save">
                    <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                  </button> */}
              <Link href="/dashboard/stockmaterialUse">
                <button type="button" className="btn btn-primary">
                  ดูรายละเอียด
                </button>
              </Link>
            </div>
            <div class="col-md-3"></div>
          </div>
        </section>
          <CustomerPieChart astPurchaseorder={filteredPurchaseorders} />

      </div>
  );
}
