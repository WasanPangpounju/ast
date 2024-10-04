// src/app/dashboard/stockmaterial/page.js

"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import '../../globals.css';

export default function Users() {
  useEffect(() => {
    // Dynamically import Bootstrap JS from the public folder
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = '/bootstrap/js/bootstrap.bundle.min.js';
    bootstrapScript.async = true;
    document.body.appendChild(bootstrapScript);
  }, []);
  const [materials, setMaterials] = useState([]);
  const [materialOutsides, setMaterialOutsides] = useState([]);
  const [materialstore, setMaterialstore] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockList, setStockList] = useState([]);
  

  // Fetch materials from the API on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/materials");
        if (!response.ok) {
          throw new Error(`Failed to fetch materials: ${response.status}`);
        }
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);
  console.log("materials", materials);
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

  const [spoolSum, setSpoolSum] = useState(0); // State to store the sum

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
    // Define the yarnType and supplierName
    const yarnType = "C 10 OE";
    const supplierName = "บริษัท กังวาลเท็กซ์ไทล์ จำกัด";

    // Filter and sum spools from materials
    const materialsSpoolSum = materials
      .filter(
        (item) =>
          item.yarnType === yarnType && item.supplierName === supplierName
      )
      .reduce((sum, item) => sum + Number(item.spool), 0);

    // Filter and sum spools from materialstore
    const materialstoreSpoolSum = materialstore
      .filter(
        (item) =>
          item.yarnType === yarnType && item.supplierName === supplierName
      )
      .reduce((sum, item) => sum + Number(item.spool), 0);

    // Filter and sum spools from materialOutsides
    const materialOutsidesSpoolSum = materialOutsides
      .filter(
        (item) =>
          item.yarnType === yarnType && item.supplierName === supplierName
      )
      .reduce((sum, item) => sum + Number(item.spool), 0);

    // Total spool sum
    const totalSpoolSum =
      materialsSpoolSum + materialstoreSpoolSum + materialOutsidesSpoolSum;

    setSpoolSum(totalSpoolSum);
    console.log("materialsSpoolSum", materialsSpoolSum);
    console.log("materialstoreSpoolSum", materialstoreSpoolSum);
    console.log("materialOutsidesSpoolSum", materialOutsidesSpoolSum);
  }, [materials, materialstore, materialOutsides]);
  console.log("spoolSum", spoolSum);
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

        <div class="content">
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
                    <div class="form-group">
                      {/* <button
                        type="submit"
                        name="submit"
                        value="search"
                        id="search"
                        class="btn btn-etc"
                        style={{ marginTop: "2em" }}
                      >
                        <i class="fas fa-folder"></i> ค้นหา
                      </button> */}
                      <button class="btn b_save">
                        <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <section class="Frame">
          <div class="row">
          <div class="col-md-5">
              
            </div>
            <div class="col-md-2">
              <div class="row">
                <div class="col-md-12">
                  ด้าย<a> {spoolSum} </a>ลูก
                </div>
              </div>
              <br/>
              <div class="row">
                <div class="col-md-12">
                <button class="btn b_save">
                        <i class="nav-icon fas fa-search"></i> &nbsp; ค้นหา
                      </button>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              
              </div>
          </div>
        </section>
      </div>
    </div>
  );
}
