import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProductToolbar from "./ProductToolbar";
import ProductFilterBar from "./ProductFilterBar";
import ProductTable from "./ProductTable";
import Pagination from "./Pagination";

export default function AdminDash() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="p-6">
          <ProductToolbar />
          <ProductFilterBar />
          <ProductTable />
          <Pagination />
        </main>
      </div>
    </div>
  );
}