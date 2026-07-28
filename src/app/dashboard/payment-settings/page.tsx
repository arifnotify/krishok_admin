"use client";

import {
  useEffect,
  useState,
} from "react";
import { getPaymentSettings, updatePaymentSettings } from "@/src/services/payment-settings.service";



export default function PaymentSettingsPage() {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [settings, setSettings] =
    useState({
      codEnabled: true,
      sslcommerzEnabled: true,
    });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings =
    async () => {
      try {
        const data =
          await getPaymentSettings();

        setSettings({
          codEnabled:
            data.codEnabled,
          sslcommerzEnabled:
            data.sslcommerzEnabled,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleSave =
    async () => {
      try {
        setSaving(true);

        await updatePaymentSettings(
          settings
        );

        alert(
          "Payment settings updated successfully"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to update settings"
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
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Payment Settings
      </h1>

      <div className="space-y-4">

        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <h2 className="font-semibold">
              Cash On Delivery
            </h2>

            <p className="text-sm text-gray-500">
              Enable / Disable COD
            </p>
          </div>

          <input
            type="checkbox"
            checked={
              settings.codEnabled
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                codEnabled:
                  e.target.checked,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <h2 className="font-semibold">
              SSLCOMMERZ
            </h2>

            <p className="text-sm text-gray-500">
              Enable / Disable Online Payment
            </p>
          </div>

          <input
            type="checkbox"
            checked={
              settings.sslcommerzEnabled
            }
            onChange={(e) =>
              setSettings({
                ...settings,
                sslcommerzEnabled:
                  e.target.checked,
              })
            }
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}