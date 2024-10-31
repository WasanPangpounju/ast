// src/app/dashboard/users/page.js
"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import "../../../globals.css";
import Link from "next/link";
import CustomerPieChart from "../CustomerPieChart.js";

export default function AstPurchaseorder() {
  const [astPurchaseorder, setAstPurchaseorder] = useState([]);
  const [filterOption, setFilterOption] = useState("lastYear");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPurchaseorders, setFilteredPurchaseorders] =
    useState(astPurchaseorder);
  const [statusCounts, setStatusCounts] = useState({
    approved: 0, // อนุมัติให้ผลิต
    returned: 0, // กลับสร้างใบสั่งซื้อ
    noData: 0, // no data
  });

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
        filteredOrders = astPurchaseorder.filter((order) => {
          const createDate = new Date(order.createDate); // Assuming createDate is in a proper format
          return (
            createDate >= new Date(startDate) && createDate <= new Date(endDate)
          );
        });
      } else if (filterOption === "lastMonth") {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filteredOrders = astPurchaseorder.filter((order) => {
          const createDate = new Date(order.createDate);
          return createDate >= lastMonth;
        });
      } else if (filterOption === "lastYear") {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        filteredOrders = astPurchaseorder.filter((order) => {
          const createDate = new Date(order.createDate);
          return createDate >= lastYear;
        });
      }

      setFilteredPurchaseorders(filteredOrders);
    };

    filterOrders();
  }, [filterOption, startDate, endDate, astPurchaseorder]);

  useEffect(() => {
    // Count the statuses in the filtered purchase orders
    const counts = filteredPurchaseorders.reduce(
      (acc, order) => {
        const status = order.status || "no data";
        if (status === "อนุมัติให้ผลิต") acc.approved++;
        else if (status === "กลับสร้างใบสั่งซื้อ") acc.returned++;
        else if (status === "no data") acc.noData++;
        return acc;
      },
      { approved: 0, returned: 0, noData: 0 }
    );

    setStatusCounts(counts);
  }, [filteredPurchaseorders]);

  const [customerCounts, setCustomerCounts] = useState([]);

  useEffect(() => {
    // Count occurrences of each customerName
    const counts = filteredPurchaseorders.reduce((acc, order) => {
      const name = order.customerName || "no data";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    // Convert the counts object into an array and sort by count (descending)
    const sortedCustomers = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    setCustomerCounts(sortedCustomers); // Set sorted customers to state
  }, [filteredPurchaseorders]);

  return (
    <div>
      {/* <h1>User Management</h1>
      <p>Manage all users from this section.</p> */}
      <section class="Frame">
        <h2>บริษัทที่มีการออกใบสั่งขาย</h2>
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

        {/* <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
              <Link href="/dashboard/stockmaterialUse">
                <button type="button" className="btn btn-primary">
                  ดูรายละเอียด
                </button>
              </Link>
            </div>
            <div class="col-md-3"></div>
          </div> */}
        {/* <CustomerPieChart astPurchaseorder={filteredPurchaseorders} /> */}

        <div class="row">
          <div class="col-md-6">บริษัท</div>
          <div class="col-md-3">จำนวน</div>
        </div>
        {customerCounts.map(([name, count]) => (
          // <li key={name}>
          //   {name}: {count}
          // </li>
          <div key={name}>
            <div class="row">
              <div class="col-md-6">{name}</div>
              <div class="col-md-3">{count}</div>
            </div>
          </div>
        ))}

        <br />
        <div class="d-flex justify-content-end">
          <div class="col-md-4">อนุมัติให้ผลิต: {statusCounts.approved}</div>
          <div class="col-md-4">
            กลับสร้างใบสั่งซื้อ: {statusCounts.returned}
          </div>
          <div class="col-md-4">No Data: {statusCounts.noData}</div>
        </div>
        <br />
      </section>
    </div>
  );
}
