"use server"

import { supabaseConfig } from "@/config/supabase-client-config";

export const getStripePaymentIntentToken = async (amount: number) => {
    try{
        const supabase = await supabaseConfig();
        const {data, error} = await supabase.functions.invoke('stripe-backend',{
            body: {
                amount
            }
        });

        if(error){
            throw error;
        }
        return data;
       /*  const {paymentIntent, customer, ephemeralKey} = data;
        return {
            paymentIntent,
            customer,
            ephemeralKey,
        } */
    }catch(err){
        console.log("Error in getStripePaymentIntentToken: ", err);
        throw err;
    }
}