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
  const [totalPackageHtr, setTotalPackageHtr] = useState({
    boxSum: 0,
    spoolSum: 0,
    sackSum: 0,
    palletSum: 0,
    partitionSum: 0,
    spoolPaperSum: 0,
    spoolPlasticSum: 0,
    spoolCPlasticSum: 0,
    spoolCPaperSum: 0,
    palletWoodSum: 0,
    palletSteelSum: 0,
  });
  const [materials, setMaterials] = useState([]);

  const [totals, setTotals] = useState({
    boxSum: 0,
    spoolSum: 0,
    sackSum: 0,
    palletSum: 0,
  });

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
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('/api/materials'); // Adjust if using external API
        const data = await response.json();
        setMaterials(data);

        // Sum the values for box, spool, sack, and pallet
        const sums = data.reduce(
          (acc, item) => {
            acc.boxSum += Number(item.box || 0);
            acc.spoolSum += Number(item.spool || 0);
            acc.sackSum += Number(item.sack || 0);
            acc.palletSum += Number(item.pallet || 0);
            return acc;
          },
          { boxSum: 0, spoolSum: 0, sackSum: 0, palletSum: 0 }
        );

        setTotals(sums);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    const fetchPackageasts = async () => {
      try {
        const response = await fetch("/api/package");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setPackageasts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageasts();
  }, []);
  console.log("packageasts", packageasts);

  useEffect(() => {
    const fetchPackageHtr = async () => {
      try {
        const response = await fetch("/api/packageHtr");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setPackageHtr(data);

        const sums = data.reduce(
          (acc, item) => {
            acc.boxSum += Number(item.box || 0);
            acc.spoolSum += Number(item.spool || 0);
            acc.sackSum += Number(item.sack || 0);
            acc.palletSum += Number(item.pallet || 0);
            acc.partitionSum += Number(item.partition || 0);
            acc.spoolPaperSum += Number(item.spool_paper || 0);
            acc.spoolPlasticSum += Number(item.spool_plastic || 0);
            acc.spoolCPlasticSum += Number(item.spoolC_plastic || 0);
            acc.spoolCPaperSum += Number(item.spoolC_paper || 0);
            acc.palletWoodSum += Number(item.pallet_wood || 0);
            acc.palletSteelSum += Number(item.pallet_steel || 0);
            return acc;
          },
          {
            boxSum: 0,
            spoolSum: 0,
            sackSum: 0,
            palletSum: 0,
            partitionSum: 0,
            spoolPaperSum: 0,
            spoolPlasticSum: 0,
            spoolCPlasticSum: 0,
            spoolCPaperSum: 0,
            palletWoodSum: 0,
            palletSteelSum: 0,
          }
        );

        setTotalPackageHtr(sums);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageHtr();
  }, []);
  console.log("packageHtr", packageHtr);

  const spoolSums = packageasts.reduce(
    (acc, item) => {
      // Ensure we're processing only "packageImport" items
      if (item.package_status === "packageImport") {
        // Handle spool sums
        switch (item.spool_type) {
          case "spool_plastic":
            acc.spoolPlasticSum += Number(item.spool || 0);
            break;
          case "spool_paper":
            acc.spoolPaperSum += Number(item.spool || 0);
            break;
          case "spoolC_plastic":
            acc.spoolCPlasticSum += Number(item.spool || 0);
            break;
          case "spoolC_paper":
            acc.spoolCPaperSum += Number(item.spool || 0);
            break;
          default:
            break; // Handle unknown spool types if needed
        }
  
        // Handle pallet sums
        switch (item.pallet_type) {
          case "wood":
            acc.palletWoodImp += Number(item.pallet || 0);
            break;
          case "steel":
            acc.palletSteelImp += Number(item.pallet || 0);
            break;
          default:
            break; // Handle unknown pallet types if needed
        }
  
        // Sum partitions
        acc.partitionSum += Number(item.partition || 0);
      }
      if (item.package_status === "packageReturn") {
        // Handle spool sums
        switch (item.spool_type) {
          case "spool_plastic":
            acc.spoolPlasticRetSum += Number(item.spool || 0);
            break;
          case "spool_paper":
            acc.spoolPaperRetSum += Number(item.spool || 0);
            break;
          case "spoolC_plastic":
            acc.spoolCPlasticRetSum += Number(item.spool || 0);
            break;
          case "spoolC_paper":
            acc.spoolCPaperRetSum += Number(item.spool || 0);
            break;
          default:
            break; // Handle unknown spool types if needed
        }
  
        // Handle pallet sums
        switch (item.pallet_type) {
          case "wood":
            acc.palletWoodImpRet += Number(item.pallet || 0);
            break;
          case "steel":
            acc.palletSteelImpRet += Number(item.pallet || 0);
            break;
          default:
            break; // Handle unknown pallet types if needed
        }
  
        // Sum partitions
        acc.partitionRetSum += Number(item.partition || 0);
      }
  
      return acc; // Return the accumulator
    },
    // Initialize accumulator with all required fields
    {
      spoolPlasticSum: 0,
      spoolPaperSum: 0,
      spoolCPlasticSum: 0,
      spoolCPaperSum: 0,
      palletWoodImp: 0,
      palletSteelImp: 0,
      partitionSum: 0,

      spoolPlasticRetSum: 0,
      spoolPaperRetSum: 0,
      spoolCPlasticRetSum: 0,
      spoolCPaperRetSum: 0,
      palletWoodImpRet: 0,
      palletSteelImpRet: 0,
      partitionRetSum: 0,
    }
  );
  
  // Destructure the sums for easier access
  const {
    spoolPlasticSum,
    spoolPaperSum,
    spoolCPlasticSum,
    spoolCPaperSum,
    palletWoodImp,
    palletSteelImp,
    partitionSum,

    spoolPlasticRetSum,
    spoolPaperRetSum,
    spoolCPlasticRetSum,
    spoolCPaperRetSum,
    palletWoodImpRet,
    palletSteelImpRet,
    partitionRetSum,
  } = spoolSums;
  
//   console.log("Sums:", spoolSums);
  

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
                  ตรวจสอบวัตถุดิบวัตถุดิบ
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
          <h2>ตรวจสอบวัตถุดิบ</h2>
          <br />
          <div class="row">
            <div class="col-md-12">
              {/* <table className="table table-bordered table-a"> */}
              <table className="custom-table">
                <thead className="sticky-header">
                  <tr>
                    <th rowspan="2">ชนิด</th>
                    <th rowspan="2">จำนวน(ลูก)</th>
                    <th rowspan="2">นำเข้า </th>
                    <th rowspan="2">ต้องส่งคืน </th>
                    <th rowspan="2">ส่งคืนแล้ว </th>
                    <th rowspan="2">คงเหลือ </th>

                    <th rowspan="2">ยืมไป </th>
                    <th rowspan="2">รับกลับแล้ว </th>
                    <th rowspan="2">คงค้าง </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>พาเลทเหล็ก</td>
                    <td></td>
                    <td>{palletSteelImp}</td>
                    <td>{palletSteelImpRet}</td>
                    <td>{totalPackageHtr.palletSteelSum}</td>
                    <td>{palletSteelImpRet - totalPackageHtr.palletSteelSum}</td>
                  </tr>
                  <tr>
                    <td>พาเลทไม้</td>
                    <td></td>
                    <td>{palletWoodImp}</td>
                    <td>{palletWoodImpRet}</td>
                    <td>{totalPackageHtr.palletWoodSum}</td>
                    <td>{palletWoodImpRet - totalPackageHtr.palletWoodSum}</td>

                  </tr>
                  <tr>
                    <td>กรวยกระดาษ</td>
                    <td></td>
                    <td>{spoolPaperSum}</td>
                    <td>{spoolPaperRetSum}</td>
                    <td>{totalPackageHtr.spoolPaperSum}</td>
                    <td>{spoolPaperRetSum - totalPackageHtr.spoolPaperSum}</td>

                  </tr>
                  <tr>
                    <td>กรวยพลาสิก</td>
                    <td></td>
                    <td>{spoolPlasticSum}</td>
                    <td>{spoolPlasticRetSum}</td>
                    <td>{totalPackageHtr.spoolPlasticSum}</td>
                    <td>{spoolPlasticRetSum - totalPackageHtr.spoolPlasticSum}</td>

                  </tr>
                  <tr>
                    <td>กระบอกกระดาษ</td>
                    <td></td>
                    <td>{spoolCPaperSum}</td>
                    <td>{spoolCPaperRetSum}</td>
                    <td>{totalPackageHtr.spoolCPaperSum}</td>
                    <td>{spoolCPaperRetSum - totalPackageHtr.spoolCPaperSum}</td>

                  </tr>
                  <tr>
                    <td>กระบอกพลาสิก</td>
                    <td></td>
                    <td>{spoolCPlasticSum}</td>
                    <td>{spoolCPlasticRetSum}</td>
                    <td>{totalPackageHtr.spoolCPlasticSum}</td>
                    <td>{spoolCPlasticRetSum - totalPackageHtr.spoolCPlasticSum}</td>

                  </tr>
                  {/* <tr>
                    <td>กระสอบพลาสิก</td>
                    <td></td>
                    <td>{totals.sackSum}</td>
                    <td>{totals.sackSum}</td>

                  </tr> */}
                  {/* <tr>
                    <td>กล่อง</td>
                    <td></td>
                    <td>{totals.boxSum}</td>
                  </tr> */}
                  <tr>
                    <td>กระดาษกั้น</td>
                    <td></td>
                    <td>{partitionSum}</td>
                    <td>{partitionRetSum}</td>
                    <td>{totalPackageHtr.partitionSum}</td>
                    <td>{partitionRetSum - totalPackageHtr.partitionSum}</td>

                  </tr>
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
