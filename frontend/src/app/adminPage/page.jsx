"use client";

import { useEffect } from "react";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import { Sniglet } from "next/font/google";
import './styles.css';
import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

const sniglet = Sniglet({
  subsets: ["latin"],
  weight: ["400"], // โหลดแค่ตัวธรรมดา ไม่โหลดตัวหนา
  display: "swap"
});

const DataTable = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Destroy the DataTable if already initialized to avoid duplication
      const existingTable1 = $.fn.dataTable.isDataTable('#example1');
      const existingTable2 = $.fn.dataTable.isDataTable('#example2');
      if (existingTable1) {
        $('#example1').DataTable().destroy();
      }

      // Initialize DataTable with responsive configuration
      $('#example1').DataTable({
        responsive: true,
        autoWidth: false,
        paging: false,
        lengthChange: false,
        columnDefs: [
          { responsivePriority: 1, targets: 1 }, // Username สำคัญสุด
          { responsivePriority: 2, targets: 6 }, // Role ลำดับถัดมา
          { responsivePriority: 3, targets: 10 }, // Status ตามลำดับ
          { responsivePriority: 100, targets: '_all' } // คอลัมน์อื่นลำดับท้าย
        ],
      });

      if (existingTable2) {
        $('#example2').DataTable().destroy();
      }

      // Initialize DataTable with responsive configuration
      $('#example2').DataTable({
        responsive: true,
        autoWidth: false,
        paging: false,
        lengthChange: false,
        columnDefs: [
          { responsivePriority: 1, targets: 1 }, // Hotel สำคัญสุด
          { responsivePriority: 2, targets: 2 }, // Registrant ลำดับถัดมา
          { responsivePriority: 3, targets: 3 }, // Status ตามลำดับ
          { responsivePriority: 4, targets: 4 }, // Approved By ตามลำดับ
          { responsivePriority: 100, targets: '_all' } // คอลัมน์อื่นลำดับท้าย
        ],
      });
    }
  }, []);

  return (
    <main className={`${sniglet.className} flex min-h-screen bg-neutral-100 text-sm`}>
      {/* Sidebar ชิดซ้าย */}
      <div className="lg:hidden py-16 text-center">
        <button type="button" className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-950 focus:outline-none focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-sidebar-basic-usage" aria-label="Toggle navigation" data-hs-overlay="#hs-sidebar-basic-usage">
          Open
        </button>
      </div>

      <div id="hs-sidebar-basic-usage" className="hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 w-64 hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform h-full hidden fixed top-0 start-0 bottom-0 z-[60] bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700" role="dialog" tabIndex={-1} aria-label="Sidebar">
        <div className="relative flex flex-col h-full max-h-full">
          <header className="p-4 flex justify-between items-center gap-x-2">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-petloga-lightmodel.svg" alt="Petgoda Logo" width={220} height={100} priority
              className="h-12 w-auto"
            />
          </Link>

            <div className="lg:hidden -me-2">
              <button type="button" className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200" data-hs-overlay="#hs-sidebar-basic-usage">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>

          <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="pb-0 px-2 w-full flex flex-col flex-wrap">
              <ul className="space-y-1">
                <li>
                  <a className="flex items-center gap-x-3 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white" href="#">
                    <HomeIcon className="w-6 h-6" />
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Content Area แบ่งครึ่งพื้นที่ที่เหลือ */}
      <div className="centerr ml-64 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white p-6 rounded shadow rounded-xl w-full max-w-xl">
          <h1 className="maintopic">User Management</h1>
          <div className="overflow-auto h-[450px]">
            <table id="example1" className="display stripe hover w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Birth Date</th>
                  <th>Gender</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Created At</th>
                  <th>Edit At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>lafl0ra</td>
                  <td>65070088@kmitl.ac.th</td>
                  <td>Purinprat Arsanok</td>
                  <td>08/11/2003</td>
                  <td>Female</td>
                  <td>Pet Owner</td>
                  <td>0960654407</td>
                  <td>16/2/2025</td>
                  <td>16/2/2025</td>
                  <td>
                    <form method="POST" action="#">
                      <select name="status">
                        <option value="Active">Active</option>
                        <option value="Banned">Banned</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </form>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow rounded-xl w-full max-w-xl">
          <h1 className="maintopic">Hotel Approve</h1>
          <div className="overflow-auto h-[450px]">
            <table id="example2" className="display stripe hover w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hotel</th>
                  <th>Registrant</th>
                  <th>Status</th>
                  <th>Approved By</th>
                  <th>Approved At</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>NN hotel</td>
                  <td>NN</td>
                  <td>65070088@kmitl.ac.th</td>
                  <td>Purinprat Arsanok</td>
                  <td>08/11/2003</td>
                  <td>08/11/2003</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DataTable;