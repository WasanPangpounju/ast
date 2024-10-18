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
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setMaterials(data);

        // Sum pallet, box, and sack
        const palletSum = data.reduce(
          (acc, material) => acc + (Number(material.pallet) || 0),
          0
        );
        const boxSum = data.reduce(
          (acc, material) => acc + (Number(material.box) || 0),
          0
        );
        const sackSum = data.reduce(
          (acc, material) => acc + (Number(material.sack) || 0),
          0
        );

        setTotalPallet(palletSum);
        setTotalBox(boxSum);
        setTotalSack(sackSum);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);
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
  // console.log("material_outsides", materialOutsides);

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
  // console.log("materialstore", materialstore);

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

  // console.log("stockList", stockList);

  useEffect(() => {
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
      const createDate = new Date(`${year}-${month}-${day}`);

      // Check the selected filter option
      if (filterOption === "lastYear") {
        return createDate >= oneYearAgo;
      } else if (filterOption === "lastMonth") {
        return createDate >= oneMonthAgo;
      }
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

  const isDateInRange = (createDate, range) => {
    const now = new Date();
    const date = new Date(createDate);

    // Return true for the "all" option to include all records
    if (range === "all") {
      return true;
    }

    if (range === "lastYear") {
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      return date >= oneYearAgo && date <= now;
    }

    if (range === "lastMonth") {
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      return date >= oneMonthAgo && date <= now;
    }

    return false; // Default to false if no valid range is provided
  };

  // Group data by yarnType and sum relevant fields
  useEffect(() => {
    // Apply date filter to all datasets
    const filteredMaterials = materials.filter((item) =>
      isDateInRange(item.createDate, filterOption)
    );
    const filteredMaterialOutsides = materialOutsides.filter((item) =>
      isDateInRange(item.createDate, filterOption)
    );
    const filteredMaterialStore = materialstore.filter((item) =>
      isDateInRange(item.createDate, filterOption)
    );

    console.log("Filtered Materials:", filteredMaterials);
    console.log("Filtered Material Outsides:", filteredMaterialOutsides);
    console.log("Filtered Material Store:", filteredMaterialStore);

    // Initialize an accumulator to hold combined results
    const combinedData = {};

    // Combine and sum materials
    filteredMaterials.forEach((item) => {
      const { yarnType, spool = 0, weight_p_net = 0, weight_kg_net = 0 } = item;

      // Initialize the yarnType entry if it doesn't exist
      if (!combinedData[yarnType]) {
        combinedData[yarnType] = {
          yarnType,
          spoolSum: 0,
          materialsWeightPNetSum: 0,
          materialsWeightKgNetSum: 0,
          materialstoreWeightPNetSum: 0,
          materialstoreWeightKgNetSum: 0,
          materialOutsidesWeightPNetSum: 0,
          materialOutsidesWeightKgNetSum: 0,
        };
      }

      // Sum for materials
      combinedData[yarnType].spoolSum += Number(spool);
      combinedData[yarnType].materialsWeightPNetSum += Number(weight_p_net);
      combinedData[yarnType].materialsWeightKgNetSum += Number(weight_kg_net);
    });

    // Combine and sum material store
    filteredMaterialStore.forEach((item) => {
      const { yarnType, weight_p_net = 0, weight_kg_net = 0 } = item;

      if (!combinedData[yarnType]) {
        combinedData[yarnType] = {
          yarnType,
          spoolSum: 0,
          materialsWeightPNetSum: 0,
          materialsWeightKgNetSum: 0,
          materialstoreWeightPNetSum: 0,
          materialstoreWeightKgNetSum: 0,
          materialOutsidesWeightPNetSum: 0,
          materialOutsidesWeightKgNetSum: 0,
        };
      }

      // Sum for material store
      combinedData[yarnType].materialstoreWeightPNetSum += Number(weight_p_net);
      combinedData[yarnType].materialstoreWeightKgNetSum +=
        Number(weight_kg_net);
    });

    // Combine and sum material outsides
    filteredMaterialOutsides.forEach((item) => {
      const { yarnType, weight_p_net = 0, weight_kg_net = 0 } = item;

      if (!combinedData[yarnType]) {
        combinedData[yarnType] = {
          yarnType,
          spoolSum: 0,
          materialsWeightPNetSum: 0,
          materialsWeightKgNetSum: 0,
          materialstoreWeightPNetSum: 0,
          materialstoreWeightKgNetSum: 0,
          materialOutsidesWeightPNetSum: 0,
          materialOutsidesWeightKgNetSum: 0,
        };
      }

      // Sum for material outsides
      combinedData[yarnType].materialOutsidesWeightPNetSum +=
        Number(weight_p_net);
      combinedData[yarnType].materialOutsidesWeightKgNetSum +=
        Number(weight_kg_net);
    });

    // Convert the combined data object to an array
    const groupedDataArray = Object.values(combinedData);

    // Sort by yarnType
    groupedDataArray.sort((a, b) => a.yarnType.localeCompare(b.yarnType));

    // Store the grouped data in state
    setGroupedData(groupedDataArray);
  }, [materials, materialOutsides, materialstore, filterOption]);

  const groupedDataArray = Object.values(groupedData);

  // Sort by yarnType
  groupedDataArray.sort((a, b) => a.yarnType.localeCompare(b.yarnType));

  const filteredData = groupedDataArray.filter((item) => {
    const yarnTypeMatches =
      selectedYarnType === "" || item.yarnType === selectedYarnType;
    const supplierMatches =
      selectedSupplier === "" ||
      materials.some(
        (material) =>
          material.yarnType === item.yarnType &&
          material.supplierName === selectedSupplier
      );
    return yarnTypeMatches && supplierMatches;
  });
  const uniqueYarnTypes = [...new Set(materials.map((item) => item.yarnType))];
  const uniqueSuppliers = [
    ...new Set(materials.map((item) => item.supplierName)),
  ];
  // console.log("uniqueYarnTypes", uniqueYarnTypes);
  // console.log("uniqueSuppliers", uniqueSuppliers);

  // Helper function to filter and sum an individual array
  const filterAndSum = (data) => {
    const now = new Date(); // Current date
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1); // Set to one year ago

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.createDate); // Parse createDate
      return (
        item.yarnType.includes("C 12 OE") && itemDate >= oneYearAgo // Check if within the last year
      );
    });

    const totalWeightPNet = filtered.reduce(
      (sum, item) => sum + Number(item.weight_p_net || 0),
      0
    );

    const totalWeightKgNet = filtered.reduce(
      (sum, item) => sum + Number(item.weight_kg_net || 0),
      0
    );

    return { totalWeightPNet, totalWeightKgNet };
  };

  // Separate calculations for materials, materialOutsides, and materialstore
  useEffect(() => {
    const materialsSum = filterAndSum(materials);
    const materialOutsidesSum = filterAndSum(materialOutsides);
    const materialstoreSum = filterAndSum(materialstore);

    console.log(
      "Materials - Total weight_p_net:",
      materialsSum.totalWeightPNet
    );
    console.log(
      "Materials - Total weight_kg_net:",
      materialsSum.totalWeightKgNet
    );

    console.log(
      "MaterialOutsides - Total weight_p_net:",
      materialOutsidesSum.totalWeightPNet
    );
    console.log(
      "MaterialOutsides - Total weight_kg_net:",
      materialOutsidesSum.totalWeightKgNet
    );

    console.log(
      "Materialstore - Total weight_p_net:",
      materialstoreSum.totalWeightPNet
    );
    console.log(
      "Materialstore - Total weight_kg_net:",
      materialstoreSum.totalWeightKgNet
    );
  }, [materials, materialOutsides, materialstore]); // Re-run when any data changes

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
                      <datalist id="yarnTypeList">
                        {uniqueYarnTypes.map((item, index) => (
                          <option key={index} value={item} />
                        ))}
                      </datalist>

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
                      <datalist id="supplierList">
                        {uniqueSuppliers.map((item, index) => (
                          <option key={index} value={item} />
                        ))}
                      </datalist>
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
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        {/* </div> */}
        <br/>
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
                    <th rowspan="2">จำนวนลูก</th>
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
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.yarnType}</td>
                      <td>{item.spoolSum}</td>
                      <td>{item.materialsWeightPNetSum.toFixed(2)}</td>
                      <td>{item.materialsWeightKgNetSum.toFixed(2)}</td>
                      <td>{item.materialstoreWeightPNetSum.toFixed(2)}</td>
                      <td>{item.materialstoreWeightKgNetSum.toFixed(2)}</td>
                      {/* <td>{item.materialOutsidesWeightPNetSum.toFixed(2)}</td>
                      <td>{item.materialOutsidesWeightKgNetSum.toFixed(2)}</td> */}
                      <td>
                        {(
                          item.materialsWeightPNetSum -
                          item.materialstoreWeightPNetSum
                        ).toFixed(2)}
                      </td>
                      <td>
                        {(
                          item.materialsWeightKgNetSum -
                          item.materialstoreWeightKgNetSum
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
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
