// src/app/dashboard/stockmaterial/page.js

"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";

export default function Users() {
  useEffect(() => {
    // Dynamically import Bootstrap JS from the public folder
    const bootstrapScript = document.createElement("script");
    bootstrapScript.src = "/bootstrap/js/bootstrap.bundle.min.js";
    bootstrapScript.async = true;
    document.body.appendChild(bootstrapScript);
  }, []);
  const [materials, setMaterials] = useState([]);
  const [materialOutsides, setMaterialOutsides] = useState([]);
  const [materialstore, setMaterialstore] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockList, setStockList] = useState([]);

  const [totalPallet, setTotalPallet] = useState(0);
  const [totalBox, setTotalBox] = useState(0);
  const [totalSack, setTotalSack] = useState(0);

  const [spoolSum, setSpoolSum] = useState(0); // State to store the sum
  const [totalWeightPNet, setTotalWeightPNet] = useState(0);
  const [totalWeightKgNet, setTotalWeightKgNet] = useState(0);
  const [filterOption, setFilterOption] = useState("lastYear");
  const [filterOptionSec2, setFilterOptionSec2] = useState("lastYear");

  // Fetch materials from the API on component mount
  // useEffect(() => {
  //   const fetchMaterials = async () => {
  //     try {
  //       const response = await fetch("/api/materials");
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

  const getFilterDate = (filterOption) => {
    const now = new Date();
    if (filterOption === "lastYear") {
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else if (filterOption === "lastMonth") {
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    return null;
  };

  ususeEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setMaterials(data);
        filterAndSumMaterials(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const filterAndSumMaterials = (data) => {
      const filterDate = getFilterDate(filterOptionSec2);

      // Filter materials based on the selected date range
      const filteredMaterials = data.filter((item) => {
        const [day, month, year] = item.createDate.split("/");
        const createDate = new Date(`${year}-${month}-${day}`);
        return createDate >= filterDate && createDate <= new Date();
      });

      // Sum pallet, box, and sack for filtered materials
      const palletSum = filteredMaterials.reduce(
        (acc, material) => acc + (Number(material.pallet) || 0),
        0
      );
      const boxSum = filteredMaterials.reduce(
        (acc, material) => acc + (Number(material.box) || 0),
        0
      );
      const sackSum = filteredMaterials.reduce(
        (acc, material) => acc + (Number(material.sack) || 0),
        0
      );

      setTotalPallet(palletSum);
      setTotalBox(boxSum);
      setTotalSack(sackSum);
    };

    fetchMaterials();
  }, [filterOptionSec2]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  // console.log("materials", materials);
  useEffect(() => {
    const fetchMaterialOutsides = async () => {
      try {
        const response = await fetch("/api/material_outsides");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setMaterialOutsides(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialOutsides();
  }, []);
  console.log("material_outsides", materialOutsides);

  useEffect(() => {
    const fetchMaterialstore = async () => {
      try {
        const response = await fetch("/api/materialstore");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setMaterialstore(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialstore();
  }, []);
  console.log("materialstore", materialstore);

  useEffect(() => {
    if (materials.length > 0) {
      const stockYarns = materials.reduce((acc, material) => {
        if (!acc[material.yarnType]) acc[material.yarnType] = [];
        acc[material.yarnType].push(material);
        return acc;
      }, {});

      const supplierList = materials.reduce((acc, material) => {
        if (!acc[material.supplierName]) acc[material.supplierName] = [];
        acc[material.supplierName].push(material);
        return acc;
      }, {});

      const newStockList = [];

      Object.keys(stockYarns).forEach((yarnType) => {
        const yarnSumList = [];
        Object.keys(supplierList).forEach((supplierName) => {
          const stockQuery = materials.filter(
            (material) =>
              material.yarnType === yarnType &&
              material.supplierName === supplierName
          );

          if (stockQuery.length >= 1) {
            let spool = 0;
            let weight_p_net = 0;
            let weight_kg_net = 0;

            // Ensure the values are treated as numbers
            stockQuery.forEach((item) => {
              spool += Number(item.spool) || 0; // Convert to number or default to 0
              weight_p_net += Number(item.weight_p_net) || 0;
              weight_kg_net += Number(item.weight_kg_net) || 0;
            });

            const average_p = spool > 0 ? weight_p_net / spool : 0;
            const average_kg = spool > 0 ? weight_kg_net / spool : 0;

            // Material stock calculation
            const stockImport = {
              yarnType: yarnType,
              supplierName: supplierName,
              spool: spool,
              weight_p_net: weight_p_net,
              weight_kg_net: weight_kg_net,
              average_p: average_p,
              average_kg: average_kg,
            };

            // Handle material withdraw (from store and outside)
            const stockWithdraws = materialstore.filter(
              (store) =>
                store.yarnType === yarnType &&
                store.supplierName === supplierName
            );

            if (stockWithdraws.length > 0) {
              let spoolWithdraw = 0;
              stockWithdraws.forEach((withdraw) => {
                spoolWithdraw += Number(withdraw.spool) || 0;
              });

              stockImport.spool -= spoolWithdraw;
              stockImport.weight_p_net = stockImport.spool * average_p;
              stockImport.weight_kg_net = stockImport.spool * average_kg;
            }

            const stockWithdrawsOutside = materialOutsides.filter(
              (outside) =>
                outside.yarnType === yarnType &&
                outside.supplierName === supplierName
            );

            if (stockWithdrawsOutside.length > 0) {
              let spoolOutside = 0;
              stockWithdrawsOutside.forEach((outside) => {
                spoolOutside += Number(outside.spool) || 0;
              });

              stockImport.spool -= spoolOutside;
              stockImport.weight_p_net = stockImport.spool * average_p;
              stockImport.weight_kg_net = stockImport.spool * average_kg;
            }

            yarnSumList.push(stockImport);
          }
        });

        newStockList.push(yarnSumList);
      });

      setStockList(newStockList);
    }
  }, [materials, materialstore, materialOutsides]);

  console.log("stockList", stockList);

  useEffect(() => {
    const yarnType = "C 10 OE";
    const supplierName = "บริษัท กังวาลเท็กซ์ไทล์ จำกัด";

    // Get the current date
    const currentDate = new Date();

    // Calculate dates for last year and last month
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    // Filter the materials based on the selected filter (last year or last month)
    const filteredMaterials = materials.filter((item) => {
      const [day, month, year] = item.createDate.split("/");
      const createDate = new Date(`${year}-${month}-${day}`); // Create a Date object from the string

      // Get the current date
      const now = new Date();

      // Calculate the dates for one month ago and one year ago
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );

      // Filter based on the selected filter option
      if (filterOption === "lastYear") {
        return createDate >= oneYearAgo && createDate <= now;
      } else if (filterOption === "lastMonth") {
        return createDate >= oneMonthAgo && createDate <= now;
      }

      return false; // Default case if no filter option matches
    });

    const filteredMaterialsSec2 = materials.filter((item) => {
      const [day, month, year] = item.createDate.split("/");
      const createDate = new Date(`${year}-${month}-${day}`); // Create a Date object from the string

      // Get the current date
      const now = new Date();

      // Calculate the dates for one month ago and one year ago
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );

      // Filter based on the selected filter option
      if (filterOption === "lastYear") {
        return createDate >= oneYearAgo && createDate <= now;
      } else if (filterOption === "lastMonth") {
        return createDate >= oneMonthAgo && createDate <= now;
      }

      return false; // Default case if no filter option matches
    });

    // Sum the spools and weights
    const materialsSpoolSum = filteredMaterials.reduce(
      (sum, item) => sum + Number(item.spool || 0),
      0
    );
    const weightPNetSum = filteredMaterials.reduce(
      (sum, item) => sum + Number(item.weight_p_net || 0),
      0
    );
    const weightKgNetSum = filteredMaterials.reduce(
      (sum, item) => sum + Number(item.weight_kg_net || 0),
      0
    );

    // Update the state with the sums
    setSpoolSum(materialsSpoolSum);
    setTotalWeightPNet(weightPNetSum);
    setTotalWeightKgNet(weightKgNetSum);

    console.log("Filtered materials:", filteredMaterials);
    console.log("Spool Sum:", materialsSpoolSum);
    console.log("Weight P Net Sum:", weightPNetSum);
    console.log("Weight Kg Net Sum:", weightKgNetSum);
  }, [materials, filterOption]);
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

        {/* <div class="content">
          <div class="box-from">
            <div class="">
              <form method="post">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="yarntype">ชนิดด้าย</label>
                      <select name="yarnType" class="form-control">
                        <option disabled selected value="">
                          เลือกชนิดได้
                        </option>

                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="supplier">บริษัท</label>

                      <select name="supplier" class="form-control">
                        <option disabled selected value="">
                          เลือกบริษัท
                        </option>

                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <label for=""></label>
                    <div class="form-group">
                      <button class="btn b_save">
                        <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div> */}
        <section class="Frame">
          <h2>ตรวจสอบวัตถุดิบ น้ำหนักสุทธิ</h2>
          <div class="d-flex justify-content-end">
            <div class="col-md-2">
              <select
                class="form-select"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value="lastYear">ปีล่าสุด</option>
                <option value="lastMonth">เดือนล่าสุด</option>
              </select>
            </div>
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

              <div class="row">
                <div class="col-md-12">
                  {/* <button class="btn b_save">
                    <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                  </button> */}
                  <Link href="/dashboard/stockmaterialUse">
                    <button type="button" className="btn btn-primary">
                      Go to Stock Material Use
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <br />
        <section class="Frame">
          <h2>ตรวจสอบบรรจุภัณต์</h2>
          <div class="d-flex justify-content-end">
            <div class="col-md-2">
              <select
                value={filterOptionSec2}
                onChange={(e) => setFilterOptionSec2(e.target.value)}
              >
                <option value="lastYear">ปีล่าสุด</option>
                <option value="lastMonth">เดือนล่าสุด</option>
              </select>
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-2">พาเลท</div>
                <div class="col-md-2">
                  <a> {totalPallet} </a>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2"> กล่อง</div>
                <div class="col-md-2">
                  <a> {totalBox} </a>
                </div>
              </div>
              <div class="row">
                <div class="col-md-2"> กระสอบ</div>
                <div class="col-md-2">
                  <a> {totalSack} </a>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col-md-12">
                  <button class="btn b_save">
                    <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-3"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
