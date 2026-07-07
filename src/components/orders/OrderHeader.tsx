"use client";

import { Printer, Download } from "lucide-react";

interface Props {
  orderNumber?: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

export default function OrderHeader({
  orderNumber,
  onPrint,
  onDownload,
}: Props) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Order Details - #{orderNumber}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage order information, rider assignment and invoice.
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex gap-3">

          <button
            onClick={onPrint}
            className="
              flex
              items-center
              gap-2
              border
              px-4
              py-2
              rounded-xl
              hover:bg-gray-50
              transition
            "
          >
            <Printer size={18} />
            Print Invoice
          </button>

          <button
            onClick={onDownload}
            className="
              flex
              items-center
              gap-2
              bg-pink-600
              text-white
              px-4
              py-2
              rounded-xl
              hover:bg-pink-700
              transition
            "
          >
            <Download size={18} />
            Download Invoice
          </button>

        </div>

      </div>

    </div>
  );
}