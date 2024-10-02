// src/app/dashboard/stockmaterial/page.js

"use client"; // For client-side behavior

import { useState, useEffect } from "react";

export default function Users() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const [spoolSum, setSpoolSum] = useState(0); // State to store the sum

  useEffect(() => {
    // Sum spools with the specific conditions
    const sumSpools = materials
      .filter(
        (material) =>
          material.yarnType === "C 10 OE" &&
          material.supplierName === "บริษัท กังวาลเท็กซ์ไทล์ จำกัด"
      )
      .reduce((sum, material) => sum + (material.spool || 0), 0);

    setSpoolSum(sumSpools);
  }, [materials]);
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
                      <button class="btn b_save" >
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
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12">

                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
