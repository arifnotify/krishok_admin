"use client";

import CustomerInfoCard from "./CustomerInfoCard";
import StatusCard from "./StatusCard";
import RiderCard from "./RiderCard";
import OrderSummary from "./OrderSummary";
import OrderTimeline from "./OrderTimeline";
import EditableOrderItems from "./EditableOrderItems";

import { generateInvoice } from "@/src/utils/generateInvoice";


interface Props {
  order: any;

  riders: any[];

  selectedRider: string;

  setSelectedRider: (value: string) => void;

  assignRider: () => void;

  updateStatus: (status: string) => void;

  items: any[];

  setItems: (items: any[]) => void;

  saveItems: () => void;

  saving: boolean;
}


export default function OrderDetailsPanel({
  order,
  riders,
  selectedRider,
  setSelectedRider,
  assignRider,
  updateStatus,
  items,
  setItems,
  saveItems,
  saving,
}: Props) {


  if (!order) {
    return (
      <div
        className="
        bg-white
        border
        rounded-2xl
        p-10
        text-center
        text-gray-400
        "
      >
        Select Order
      </div>
    );
  }


  const locked =
    order.orderStatus === "Delivered" ||
    order.orderStatus === "Cancelled";



  const buildInvoice = () => {

    const subtotal =
      items?.reduce(
        (
          sum:number,
          item:any
        ) =>
          sum +
          (
            item.totalPrice ||
            0
          ),
        0
      ) || 0;


    return {

      invoiceNumber:
        order.orderNumber,


      orderNumber:
        order.orderNumber,


      invoiceDate:
        new Date().toISOString(),



      customer: {

        name:
          order.shippingAddress?.fullName ||
          "Customer",


        phone:
          order.customerPhone,


        address:
          `
          ${
            order.shippingAddress?.areaOrVillage || ""
          }
          ${
            order.shippingAddress?.landmark || ""
          }
          `,

      },


      items,


      subtotal,


      deliveryCharge:
        order.deliveryCharge || 0,


      discount:
        order.discount || 0,


      total:
        subtotal +
        (order.deliveryCharge || 0) -
        (order.discount || 0),


      paymentMethod:
        order.paymentMethod,


      paymentStatus:
        order.isPaid,


      orderStatus:
        order.orderStatus,

    };

  };



  return (

    <div className="space-y-6">


      {/* HEADER */}

      <div
        className="
        flex
        justify-between
        items-center
        bg-white
        border
        rounded-2xl
        p-5
        "
      >

        <div>

          <h2 className="text-2xl font-bold">

            Order #
            {order.orderNumber}

          </h2>


          <p className="text-gray-500">

            Manage Order Details

          </p>


        </div>



        <button

          onClick={() =>
            generateInvoice(
              buildInvoice()
            )
          }

          className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-5
          py-3
          rounded-xl
          "

        >

          📄 Invoice

        </button>


      </div>





      {/* TOP CARDS */}


      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-5
        "
      >


        <CustomerInfoCard
          order={order}
        />



        <StatusCard

          order={order}

          onChange={
            updateStatus
          }

        />



        <RiderCard

          riders={riders}

          selectedRider={
            selectedRider
          }


          setSelectedRider={
            setSelectedRider
          }


          assign={
            assignRider
          }


          locked={
            locked
          }

        />


      </div>





      {/* ITEMS */}


      <div
        className="
        bg-white
        border
        rounded-2xl
        p-5
        "
      >


        <h3
          className="
          text-xl
          font-bold
          mb-5
          "
        >

          Order Items

        </h3>



        <EditableOrderItems

          items={items}

          setItems={
            setItems
          }

          locked={
            locked
          }

        />




        {
          !locked && (

            <button

              onClick={
                saveItems
              }


              disabled={
                saving
              }


              className="
              mt-5
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              "

            >

              {
                saving
                ?
                "Saving..."
                :
                "Save Changes"
              }


            </button>

          )
        }



      </div>





      {/* SUMMARY + TIMELINE */}


      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-5
        "
      >


        <OrderSummary

          order={{
            ...order,
            items
          }}

        />



        <OrderTimeline

          order={
            order
          }

        />


      </div>





      {
        locked && (

          <div
            className="
            bg-red-50
            border
            border-red-200
            rounded-2xl
            p-5
            "
          >

            <h3
              className="
              text-red-600
              font-bold
              "
            >

              Order Locked

            </h3>


            <p
              className="
              text-red-500
              text-sm
              "
            >

              Delivered অথবা Cancelled order edit করা যাবে না।

            </p>


          </div>

        )
      }



    </div>

  );

}