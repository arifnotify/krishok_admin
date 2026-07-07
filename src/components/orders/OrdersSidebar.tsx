"use client";

import {
  Package,
  Phone,
  CalendarDays,
} from "lucide-react";

import { Order } from "@/src/types/order";

interface Props {
  activeOrders: Order[];
  completedOrders: Order[];

  selectedId?: string;

  onSelect: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-700 border-orange-200";

    case "Processing":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "OutForDelivery":
      return "bg-purple-100 text-purple-700 border-purple-200";

    case "Delivered":
      return "bg-green-100 text-green-700 border-green-200";

    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export default function OrdersSidebar({
  activeOrders,
  completedOrders,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      border
      shadow-sm
      h-[calc(100vh-180px)]
      flex
      flex-col
      overflow-hidden
    "
    >
      {/* HEADER */}

      <div className="border-b px-6 py-5 bg-white sticky top-0 z-20">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Orders
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage all customer orders
            </p>

          </div>

          <div
            className="
            w-12
            h-12
            rounded-2xl
            bg-pink-100
            flex
            items-center
            justify-center
          "
          >
            <Package
              className="text-pink-600"
              size={22}
            />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">

          <div className="rounded-xl bg-blue-50 p-3 text-center">

            <p className="text-xs text-blue-600">
              Active
            </p>

            <h3 className="font-bold text-xl text-blue-700">
              {activeOrders.length}
            </h3>

          </div>

          <div className="rounded-xl bg-green-50 p-3 text-center">

            <p className="text-xs text-green-600">
              Completed
            </p>

            <h3 className="font-bold text-xl text-green-700">
              {completedOrders.length}
            </h3>

          </div>

        </div>

      </div>

      {/* ORDER LIST */}

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* =========================
          ACTIVE ORDERS
      ========================= */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <h3
            className="
            text-sm
            font-bold
            uppercase
            tracking-wider
            text-blue-600
            "
          >
            Active Orders
          </h3>


          <span
            className="
            bg-blue-100
            text-blue-700
            text-xs
            font-bold
            px-3
            py-1
            rounded-full
            "
          >
            {activeOrders.length}
          </span>

        </div>



        <div className="space-y-4">


          {
            activeOrders.length === 0 && (

              <div
                className="
                border
                border-dashed
                rounded-2xl
                p-6
                text-center
                text-gray-400
                "
              >
                No Active Orders
              </div>

            )
          }



          {
            activeOrders.map((order) => (

              <button
                key={order._id}
                onClick={() =>
                  onSelect(order._id)
                }
                className={`
                  w-full
                  text-left
                  rounded-2xl
                  border
                  p-5
                  transition-all
                  duration-300

                  ${
                    selectedId === order._id

                    ?

                    `
                    bg-pink-50
                    border-pink-500
                    shadow-lg
                    ring-2
                    ring-pink-100
                    `

                    :

                    `
                    bg-white
                    border-slate-200
                    hover:border-pink-300
                    hover:shadow-md
                    hover:-translate-y-1
                    `
                  }

                `}
              >


                {/* TOP */}

                <div className="flex justify-between items-start">


                  <div>


                    <h4
                      className="
                      font-bold
                      text-slate-900
                      text-lg
                      "
                    >
                      #{order.orderNumber}
                    </h4>



                    <div
                      className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                      mt-2
                      "
                    >

                      <Phone size={14}/>

                      <span>
                        {order.customerPhone}
                      </span>

                    </div>


                  </div>




                  <span
                    className={`
                    text-xs
                    font-semibold
                    px-3
                    py-1
                    rounded-full
                    border
                    ${getStatusColor(
                      order.orderStatus
                    )}
                    `}
                  >

                    {order.orderStatus}

                  </span>



                </div>





                {/* CUSTOMER */}

                <div
                  className="
                  mt-4
                  text-sm
                  text-slate-600
                  "
                >

                  <p>
                    {
                      order.shippingAddress?.fullName
                      ||
                      "Customer"
                    }
                  </p>


                </div>





                {/* DATE + PRICE */}

                <div
                  className="
                  mt-5
                  flex
                  justify-between
                  items-center
                  "
                >


                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-gray-400
                    "
                  >

                    <CalendarDays size={14}/>

                    <span>
                      {
                        order.createdAt
                        ?
                        new Date(
                          order.createdAt
                        ).toLocaleDateString()
                        :
                        "Today"
                      }
                    </span>


                  </div>



                  <div
                    className="
                    text-right
                    "
                  >

                    <p
                      className="
                      text-xs
                      text-gray-400
                      "
                    >
                      Total
                    </p>


                    <p
                      className="
                      text-green-600
                      font-bold
                      text-lg
                      "
                    >
                      ৳{order.totalAmount}
                    </p>


                  </div>



                </div>


              </button>


            ))
          }


        </div>


      </div>
            {/* =========================
          COMPLETED ORDERS
      ========================= */}

      <div>


        <div className="flex items-center justify-between mb-4">


          <h3
            className="
            text-sm
            font-bold
            uppercase
            tracking-wider
            text-green-600
            "
          >
            Completed Orders
          </h3>



          <span
            className="
            bg-green-100
            text-green-700
            text-xs
            font-bold
            px-3
            py-1
            rounded-full
            "
          >
            {completedOrders.length}
          </span>


        </div>



        <div className="space-y-4">


          {
            completedOrders.length === 0 && (

              <div
                className="
                border
                border-dashed
                rounded-2xl
                p-6
                text-center
                text-gray-400
                "
              >
                No Completed Orders
              </div>

            )
          }



          {
            completedOrders.map((order) => (


              <button

                key={order._id}

                onClick={() =>
                  onSelect(order._id)
                }


                className={`

                  w-full

                  text-left

                  rounded-2xl

                  border

                  p-5

                  transition-all

                  duration-300


                  ${
                    selectedId === order._id

                    ?

                    `
                    bg-green-50
                    border-green-500
                    shadow-md
                    `

                    :

                    `
                    bg-white
                    border-slate-200
                    hover:border-green-300
                    hover:shadow-sm
                    `
                  }

                `}

              >



                {/* HEADER */}


                <div
                  className="
                  flex
                  justify-between
                  items-start
                  "
                >



                  <div>


                    <h4
                      className="
                      font-bold
                      text-slate-900
                      text-lg
                      "
                    >
                      #{order.orderNumber}
                    </h4>



                    <div
                      className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                      mt-2
                      "
                    >

                      <Phone size={14}/>

                      <span>
                        {order.customerPhone}
                      </span>

                    </div>



                  </div>




                  <span
                    className={`
                    text-xs
                    font-semibold
                    px-3
                    py-1
                    rounded-full
                    border

                    ${getStatusColor(
                      order.orderStatus
                    )}

                    `}
                  >

                    {order.orderStatus}

                  </span>



                </div>





                {/* CUSTOMER */}


                <div
                  className="
                  mt-4
                  text-sm
                  text-gray-600
                  "
                >

                  {
                    order.shippingAddress?.fullName
                    ||
                    "Customer"
                  }


                </div>






                {/* FOOTER */}


                <div
                  className="
                  mt-5
                  flex
                  justify-between
                  items-center
                  "
                >



                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-gray-400
                    "
                  >

                    <CalendarDays size={14}/>


                    <span>

                      {
                        order.createdAt
                        ?

                        new Date(
                          order.createdAt
                        ).toLocaleDateString()

                        :

                        "Completed"

                      }

                    </span>


                  </div>





                  <div
                    className="
                    text-right
                    "
                  >


                    <p
                      className="
                      text-xs
                      text-gray-400
                      "
                    >
                      Total
                    </p>



                    <p
                      className="
                      text-green-600
                      font-bold
                      text-lg
                      "
                    >

                      ৳{order.totalAmount}

                    </p>


                  </div>



                </div>



              </button>


            ))

          }


        </div>


      </div>



    </div>

  </div>

  );
}