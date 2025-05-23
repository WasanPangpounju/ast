// src/app/dashboard/users/page.js
"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";
import CustomerPieChart from "./CustomerPieChart.js";
import CustomerPieChartYarnVertical from "./CustomerPieChartYarnVertical";
import CustomerPieChartYarnHorizontal from "./CustomerPieChartYarnHorizontal";

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

  const extractedTextArray = filteredPurchaseorders.map((order) => {
    const fabricStructure = order.fabricStructure || ""; // Ensure fabricStructure exists
    return fabricStructure.split(" * ")[0].trim(); // Get text before the first '*', remove extra spaces
  });

  const countMap = extractedTextArray.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const extractedAfterTextArray = filteredPurchaseorders.map((order) => {
    const fabricStructure = order.fabricStructure || "";

    // Get text between '*' and '/'
    const parts = fabricStructure.split(" * ");
    if (parts.length > 1) {
      const textAfterAsterisk = parts[1].split(" / ")[0].trim(); // Get the part after '*' and before '/'
      return textAfterAsterisk;
    }
    return ""; // Return empty string if no '*' found
  });

  const countMapAfter = extractedAfterTextArray.reduce((acc, name) => {
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  console.log("extractedTextArray", extractedTextArray);

  console.log("extractedAfterTextArray", extractedAfterTextArray);

  return (
    <div>
      {/* <h1>User Management</h1>
      <p>Manage all users from this section.</p> */}
      <section class="Frame">
        <h2>ออร์เดอร์</h2>
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
        {/* <div class="d-flex justify-content-end"><h2>ใบสั่งขาย 5 บริษัทที่มากที่สุด</h2></div> */}
        <div className="d-flex justify-content-center">
          <CustomerPieChart astPurchaseorder={filteredPurchaseorders} />
        </div>
        <br />
        <div class="d-flex justify-content-end">
          <div class="col-md-4">อนุมัติให้ผลิต: {statusCounts.approved}</div>
          <div class="col-md-4">
            กลับสร้างใบสั่งซื้อ: {statusCounts.returned}
          </div>
          <div class="col-md-4">No Data: {statusCounts.noData}</div>
        </div>
        <br />
        <div class="d-flex justify-content-end">
          <div class="col-md-6">
            {/* <h2>ด้ายยืน 5 ด้ายที่มากที่สุด</h2> */}
            <CustomerPieChartYarnVertical
              astPurchaseorder={filteredPurchaseorders}
            />
          </div>
          <div class="col-md-6">
            {/* <h2>ด้ายพุ่ง 5 ด้ายที่มากที่สุด</h2> */}
            <CustomerPieChartYarnHorizontal
              astPurchaseorder={filteredPurchaseorders}
            />
          </div>
        </div>
        <br />
        <div className="d-flex justify-content-center">
          <Link href="/dashboard/order/orderAll">
            <button type="button" className="btn btn-primary">
              ดูรายละเอียด
            </button>
          </Link>
        </div>

        <br />
      </section>
    </div>
  );
}
