"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { getStripePaymentIntentToken } from "@/services/payment";
import CheckoutForm from "./checkout-form";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { createOrder } from "@/services/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IOrder } from "@/interfaces";

interface CheckoutButtonProps {
  amount: number;
  selectedAddressId: string;
  subtotal?: number;
  shipping?: number;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const CheckoutButton = ({
  amount,
  selectedAddressId,
  subtotal,
  shipping,
}: CheckoutButtonProps) => {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const { currentUser } = useUserStore();

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");

  const handleCheckout = async () => {
    if (!currentUser?.id) {
      toast.error("Please login to proceed with checkout.");
      return;
    }

    if (!selectedAddressId || selectedAddressId === "none") {
      toast.error("Please select a shipping address.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsCheckingOut(true);
      const paymentIntentResponse = await getStripePaymentIntentToken(amount);
      console.log("Payment Intent Response: ", paymentIntentResponse);

      if (!paymentIntentResponse?.clientSecret) {
        throw new Error("Unable to retrieve payment session. Please try again.");
      }

      setClientSecret(paymentIntentResponse.clientSecret);
      setPaymentId(paymentIntentResponse.paymentIntentId || "");
      setShowCheckoutForm(true);
    } catch (error: any) {
      console.error("Error in handleCheckout: ", error);
      toast.error(error?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSuccess = async (confirmedPaymentId?: string) => {
    try {
      if (!currentUser?.id) {
        toast.error("User not found. Please log in.");
        return;
      }

      const calculatedSubtotal =
        typeof subtotal === "number"
          ? subtotal
          : cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const calculatedShipping =
        typeof shipping === "number"
          ? shipping
          : calculatedSubtotal > 0
            ? 15
            : 0;

      const orderPayload: Partial<IOrder> = {
        user_id: currentUser.id,
        items: cartItems,
        subtotal: calculatedSubtotal,
        shipping_fee: calculatedShipping,
        tax: 0,
        total: amount,
        payment_id: confirmedPaymentId || paymentId,
        address_id: selectedAddressId,
        status: "order placed",
      };

      const result = await createOrder(orderPayload);

      if (!result.success) {
        throw new Error(result.message || "Failed to record order.");
      }

      // Clear cart from Zustand store
      clearCart();

      // Close modal
      setShowCheckoutForm(false);

      // Notify user
      toast.success("Order placed successfully!");

      // Navigate to /user/orders
      router.push("/user/orders");
    } catch (error: any) {
      console.error("Error creating order after payment: ", error);
      toast.error(
        error?.message ||
          "Payment succeeded, but failed to record the order. Please contact support.",
      );
    }
  };

  return (
    <>
      <Button
        className="w-full text-lg h-14 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
        size="lg"
        disabled={
          isCheckingOut ||
          !selectedAddressId ||
          selectedAddressId === "none" ||
          cartItems.length === 0
        }
        onClick={handleCheckout}
      >
        {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
      </Button>
      {showCheckoutForm && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            showCheckout={showCheckoutForm}
            setShowCheckout={setShowCheckoutForm}
            onSuccess={handleSuccess}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </>
  );
};

export default CheckoutButton;
