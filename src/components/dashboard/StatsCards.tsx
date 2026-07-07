"use client";

import {
  LucideIcon,
} from "lucide-react";


interface StatCardProps {

  title: string;

  value: string | number;

  icon?: LucideIcon;

  gradient?: string;

  description?: string;

}


export default function StatCard({

  title,

  value,

  icon: Icon,

  gradient = "from-blue-500 to-cyan-500",

  description,

}: StatCardProps) {


  return (

    <div
      className="
      bg-white
      rounded-2xl
      border
      shadow-sm
      p-5
      hover:shadow-lg
      transition-all
      duration-300
      hover:-translate-y-1
      "
    >


      <div
        className="
        flex
        items-center
        justify-between
        "
      >


        {/* TEXT */}

        <div>


          <p
            className="
            text-sm
            text-gray-500
            font-medium
            "
          >
            {title}
          </p>



          <h2
            className="
            text-3xl
            font-bold
            text-gray-800
            mt-2
            "
          >
            {value}
          </h2>



          {
            description && (

              <p
                className="
                text-xs
                text-gray-400
                mt-2
                "
              >
                {description}
              </p>

            )
          }


        </div>



        {/* ICON */}

        {
          Icon && (

            <div
              className={`
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-r
              ${gradient}
              flex
              items-center
              justify-center
              text-white
              shadow-md
              `}
            >

              <Icon
                size={26}
              />


            </div>

          )
        }


      </div>


    </div>

  );

}