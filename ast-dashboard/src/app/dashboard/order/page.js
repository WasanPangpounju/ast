// src/app/dashboard/users/page.js
"use client"; // For client-side behavior

import { useState, useEffect } from "react";
import "../../globals.css";
import Link from "next/link";
import CustomerPieChart from "./CustomerPieChart.js";


export default function Users() {

    const [astPurchaseorder, setAstPurchaseorder] = useState([]);

    useEffect(() => {
      const fetchAstPurchaseorder = async () => {
        try {
          const response = await fetch("/api/material_outsides");
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

  return (
      <div>
          <h1>User Management</h1>
          <p>Manage all users from this section.</p>
          <CustomerPieChart astPurchaseorder={astPurchaseorder} />

      </div>
  );
}
