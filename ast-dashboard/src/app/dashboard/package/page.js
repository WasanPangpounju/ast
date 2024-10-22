// src/app/dashboard/stockmaterial/page.js

"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";

export default function Package() {
  useEffect(() => {
    // Dynamically import Bootstrap JS from the public folder
    const bootstrapScript = document.createElement("script");
    bootstrapScript.src = "/bootstrap/js/bootstrap.bundle.min.js";
    bootstrapScript.async = true;
    document.body.appendChild(bootstrapScript);
  }, []);
  const [packageasts, setPackageasts] = useState([]);
  const [packageHtr, setPackageHtr] = useState([]);

  const [materialOutsides, setMaterialOutsides] = useState([]);
  const [materialstore, setMaterialstore] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedYarnType, setSelectedYarnType] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockList, setStockList] = useState([]);

  const [totalPallet, setTotalPallet] = useState(0);
  const [totalBox, setTotalBox] = useState(0);
  const [totalSack, setTotalSack] = useState(0);

  const [spoolSum, setSpoolSum] = useState(0); // State to store the sum
  const [totalWeightPNet, setTotalWeightPNet] = useState(0);
  const [totalWeightKgNet, setTotalWeightKgNet] = useState(0);
  const [filterOption, setFilterOption] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch materials from the API on component mount
  // useEffect(() => {
  //   const fetchMaterials = async () => {
  //     try {
  //       const response = await fetch("../api/materials");
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch materials: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setMaterials(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMaterials();
  // }, []);
//   useEffect(() => {
//     const fetchPackageasts = async () => {
//       try {
//         const response = await fetch("/api/package");
//         if (!response.ok) {
//           throw new Error(`Failed to fetch materials: ${response.status}`);
//         }
//         const data = await response.json();
//         setPackageasts(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackageasts();
//   }, []);
//   console.log("packageasts", packageasts);

  useEffect(() => {
    const fetchPackageHtr = async () => {
      try {
        const response = await fetch("/api/packageHtr");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setPackageHtr(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageHtr();
  }, []);
  console.log("packageasts", packageasts);
  
  return (
    <div>
      {/* <h1>User Management</h1>
          <p>Manage all users from this section.</p> */}

      <div class="content-wrapper">
        <div class="">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="index.php">หน้าหลัก</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#">วัตถุดิบ</a>
            </li>
            <li class="breadcrumb-item active">สต๊อกวัตถุดิบคงเหลือ</li>
          </ol>
        </div>

        <div class="content-header">
          <div class="container-fluid">
            <div class="row mb-2 Header">
              <div class="col">
                <h1 class="m-0">
                  <i class="nav-icon fas fa fa-arrow-circle-right"></i>{" "}
                  สต๊อกวัตถุดิบ
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* <div class="content"> */}
        <div class="box-from">
          <div class="">
            <form method="post">
              <div class="row">
                <div class="col-md-2">
                  <div class="form-group">
                    <label for="yarntype">ชนิดด้าย</label>
                    <input
                      list="yarnTypeList"
                      name="yarnType"
                      className="form-control"
                      value={selectedYarnType}
                      onChange={(e) => setSelectedYarnType(e.target.value)}
                      placeholder="เลือกชนิดด้าย"
                    />
                    {/* <datalist id="yarnTypeList">
                      {uniqueYarnTypes.map((item, index) => (
                        <option key={index} value={item} />
                      ))}
                    </datalist> */}

                    {/* <datalist id="yarnTypeList">
                        {uniqueYarnTypes.map((yarnType, index) => (
                          <option key={index} value={yarnType} />
                        ))}
                      </datalist> */}
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="form-group">
                    <label for="supplier">บริษัท</label>

                    <input
                      list="supplierList"
                      name="supplier"
                      className="form-control"
                      value={selectedSupplier}
                      onChange={(e) => setSelectedSupplier(e.target.value)}
                      placeholder="เลือกบริษัท"
                    />
                    {/* <datalist id="supplierList">
                      {uniqueSuppliers.map((item, index) => (
                        <option key={index} value={item} />
                      ))}
                    </datalist> */}
                    {/* <datalist id="supplierList">
                        {uniqueSuppliers.map((supplier, index) => (
                          <option key={index} value={supplier} />
                        ))}
                      </datalist> */}
                  </div>
                </div>
                <div class="col-md-2">
                  <label for=""></label>
                  <div class="form-group">
                    {/* <button class="btn b_save">
                        <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                      </button> */}
                    <select
                      value={filterOption}
                      onChange={(e) => setFilterOption(e.target.value)}
                      className="form-control"
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="lastYear">ปีล่าสุด</option>
                      <option value="lastMonth">เดือนล่าสุด</option>
                      <option value="selectDate">กำหนดเลง</option>
                    </select>
                  </div>
                </div>
                {filterOption === "selectDate" && (
                  <div className="row">
                    <div className="col-md-8"></div>
                    <div className="col-md-4">
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
            </form>
          </div>
        </div>
        {/* </div> */}
        <br />
        <section class="Frame">
          <h2>ตรวจสอบวัตถุดิบ น้ำหนักสุทธิ</h2>
          <br />
          <div class="row">
            <div class="col-md-12">
              {/* <table className="table table-bordered table-a"> */}
              <table className="custom-table">
                <thead className="sticky-header">
                  <tr>
                    <th rowspan="2">ชนิดด้าย</th>
                    <th rowspan="2">จำนวนด้าย(ลูก)</th>
                    <th colspan="2">นำเข้า </th>
                    <th colspan="2">เบิกออก </th>
                    {/* <th colspan="2">ทดสอบ </th> */}
                    <th colspan="2">คงเหลือ </th>
                  </tr>
                  <tr>
                    <th>ปอนด์</th>
                    <th>กิโลกรัม</th>
                    <th>ปอนด์</th>
                    <th>กิโลกรัม</th>
                    <th>ปอนด์</th>
                    <th>กิโลกรัม</th>
                    {/* <th>ปอนด์</th>
                    <th>กิโลกรัม</th> */}
                  </tr>
                </thead>
                <tbody>
                  {/* {groupedDataArray.map((item) => (
                    <tr key={item.yarnType}>
                      <td>{item.yarnType}</td>
                      <td>{item.spoolSum}</td>
                      <td>{item.materialsWeightPNetSum.toFixed(2)}</td>
                      <td>{item.materialsWeightKgNetSum.toFixed(2)}</td>
                      <td>{item.materialOutsidesWeightPNetSum.toFixed(2)}</td>
                      <td>{item.materialOutsidesWeightKgNetSum.toFixed(2)}</td>
                      <td>{item.materialstoreWeightPNetSum.toFixed(2)}</td>
                      <td>{item.materialstoreWeightKgNetSum.toFixed(2)}</td>
                      <td>
                        {(
                          item.materialsWeightPNetSum -
                          item.materialOutsidesWeightPNetSum
                        ).toFixed(2)}
                      </td>
                      <td>
                        {(
                          item.materialsWeightKgNetSum -
                          item.materialOutsidesWeightKgNetSum
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <br />
      </div>
    </div>
  );
}
