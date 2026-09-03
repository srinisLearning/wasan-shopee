"use client";

import { Button } from "@/components/ui/button";
import { PaymentElement,AddressElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
 
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutFormProps {
  clientSecret: string;
  showCheckout: boolean;
  setShowCheckout: (showCheckout: boolean) => void;
  onSuccess: (paymentIntentId?: string) => Promise<void> | void;
}

const CheckoutForm = ({
  clientSecret,
  showCheckout,
  setShowCheckout,
  onSuccess,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/user/orders`
              : "http://localhost:3000/user/orders",
        },
        redirect: "if_required",
      });

      if (result.error) {
        toast.error(result.error.message || "Payment could not be completed.");
        setLoading(false);
      } else {
        await onSuccess(result.paymentIntent?.id);
      }
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      toast.error(error.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Enter your payment details to place your order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <PaymentElement />
          <AddressElement options={{ mode: "shipping", allowedCountries: ["IN", "US"] }} />
          <div className="flex mt-6 justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCheckout(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!stripe || loading}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutForm;
