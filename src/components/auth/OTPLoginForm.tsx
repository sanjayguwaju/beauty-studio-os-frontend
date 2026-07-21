import { Link } from "react-router";
import React, { useState } from "react";


import { toast } from "react-hot-toast";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function OTPLoginForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
   // Assuming we expose an OTP login method, or we use a fetch call
  

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error("Please enter your phone number");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP sent to your phone");
        setStep("verify");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Login successful");
        // Update auth context state, this requires modifying AuthContext
        // For now, we reload to trigger initial auth fetch
        window.location.href = "/dashboard";
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Client Login
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === "request"
              ? "Enter your phone number to receive a one-time password."
              : "Enter the OTP sent to your phone."}
          </p>
        </div>

        {step === "request" ? (
          <form onSubmit={handleRequestOTP}>
            <div className="mb-5">
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full"
                required
              />
            </div>
            <Button
              className="w-full"
              size="sm"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-5">
              <Label>OTP</Label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                className="w-full"
                required
              />
            </div>
            <Button
              className="w-full"
              size="sm"
              disabled={loading}
              type="submit"
            >
              {loading ? "Verifying..." : "Verify & Log In"}
            </Button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep("request")}
                className="text-sm text-brand-500 hover:underline"
              >
                Use a different number
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you a staff member?{" "}
            <Link to="/signin" className="text-brand-500 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
