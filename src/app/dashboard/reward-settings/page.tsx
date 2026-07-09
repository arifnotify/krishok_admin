"use client";

import { useEffect, useState } from "react";

import {
  getRewardSettings,
  createRewardSettings,
  updateRewardSettings,
} from "@/src/services/reward.service";

import { RewardSettings } from "@/src/types/reward";


export default function RewardSettingsPage() {


  const [settings, setSettings] =
    useState<RewardSettings>({

      premiumAmount: 10000,

      vipAmount: 50000,

      regularPercentage: 2,

      premiumPercentage: 5,

      vipPercentage: 8,

      perAmount: 100,

      minimumRedeem: 50,

      maximumRedeem: 300,

      expireDays: 365,

      isActive: true,

    });



  const [loading, setLoading] =
    useState(true);



  const [saving, setSaving] =
    useState(false);




  useEffect(() => {

    fetchSettings();

  }, []);




  const fetchSettings = async () => {

    try {

      const data =
        await getRewardSettings();


      console.log(
        "GET SETTINGS:",
        data,
      );


      if (data) {

        setSettings(data);

      }


    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };





  const save = async () => {


    try {


      setSaving(true);



      const payload = {


        // CUSTOMER LEVEL

        premiumAmount:
          settings.premiumAmount,


        vipAmount:
          settings.vipAmount,



        // REWARD %

        regularPercentage:
          settings.regularPercentage,


        premiumPercentage:
          settings.premiumPercentage,


        vipPercentage:
          settings.vipPercentage,



        // RULE

        perAmount:
          settings.perAmount,


        minimumRedeem:
          settings.minimumRedeem,


        maximumRedeem:
          settings.maximumRedeem,


        expireDays:
          settings.expireDays,


        isActive:
          settings.isActive,


      };



      let response;



      // CREATE

      if (!settings._id) {


        response =
          await createRewardSettings(
            payload,
          );


        alert(
          "Reward Settings Created Successfully",
        );


      }



      // UPDATE

      else {


        response =
          await updateRewardSettings(
            payload,
          );


        alert(
          "Reward Settings Updated Successfully",
        );


      }



      console.log(
        "SAVE RESPONSE:",
        response,
      );



      fetchSettings();



    } catch (err:any) {


      console.log(err);



      alert(
        err?.response?.data?.message ||
        "Save Failed",
      );



    } finally {


      setSaving(false);


    }


  };





  if (loading) {

    return (

      <div className="p-6">

        Loading...

      </div>

    );

  }





  return (

    <div className="max-w-4xl">


      <h1 className="text-3xl font-bold mb-8">

        Reward Settings

      </h1>





      <div className="grid grid-cols-2 gap-5">





        {/* Premium Amount */}

        <div>

          <label className="block mb-2">

            Premium Customer Amount

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.premiumAmount
            }


            onChange={(e) =>

              setSettings({

                ...settings,

                premiumAmount:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>






        {/* VIP Amount */}

        <div>


          <label className="block mb-2">

            VIP Customer Amount

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.vipAmount
            }


            onChange={(e) =>

              setSettings({

                ...settings,

                vipAmount:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>







        {/* Regular */}

        <div>

          <label className="block mb-2">

            Regular %

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.regularPercentage
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                regularPercentage:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>








        {/* Premium */}

        <div>


          <label className="block mb-2">

            Premium Reward %

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.premiumPercentage
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                premiumPercentage:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>







        {/* VIP */}

        <div>


          <label className="block mb-2">

            VIP Reward %

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.vipPercentage
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                vipPercentage:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>








        {/* Per Amount */}

        <div>


          <label className="block mb-2">

            Per Amount

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.perAmount
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                perAmount:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>








        {/* Minimum Redeem */}

        <div>


          <label className="block mb-2">

            Minimum Redeem

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.minimumRedeem
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                minimumRedeem:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>








        {/* Maximum Redeem */}

        <div>


          <label className="block mb-2">

            Maximum Redeem

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.maximumRedeem
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                maximumRedeem:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>








        {/* Expire Days */}

        <div>


          <label className="block mb-2">

            Expire Days

          </label>


          <input

            type="number"

            className="border rounded-lg p-3 w-full"

            value={
              settings.expireDays
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                expireDays:
                  Number(
                    e.target.value,
                  ),

              })

            }

          />


        </div>








        {/* Active */}

        <div className="flex items-center gap-3 mt-8">


          <input

            type="checkbox"

            checked={
              settings.isActive
            }


            onChange={(e)=>

              setSettings({

                ...settings,

                isActive:
                  e.target.checked,

              })

            }

          />


          <span>

            Reward System Active

          </span>


        </div>



      </div>






      <button

        onClick={save}

        disabled={saving}


        className="
        mt-8 
        bg-black 
        text-white 
        px-8 
        py-3 
        rounded-xl
        hover:bg-gray-800
        disabled:opacity-50
        "

      >

        {
          saving
          ? "Saving..."
          : settings._id
          ? "Update Settings"
          : "Create Settings"
        }


      </button>




    </div>

  );


}