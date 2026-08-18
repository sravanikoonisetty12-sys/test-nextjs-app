import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    console.log(
      "RAZORPAY_KEY_ID exists:",
      !!process.env.RAZORPAY_KEY_ID
    );

    console.log(
      "RAZORPAY_KEY_SECRET exists:",
      !!process.env.RAZORPAY_KEY_SECRET
    );

    console.log("Amount received:", amount);

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        {
          error: "Invalid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID) {
      return NextResponse.json(
        {
          error: "RAZORPAY_KEY_ID is missing on server.",
        },
        {
          status: 500,
        }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          error: "RAZORPAY_KEY_SECRET is missing on server.",
        },
        {
          status: 500,
        }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,

      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),

      currency: "INR",

      receipt: `receipt_${Date.now()}`,
    });

    console.log("Razorpay order created:", order.id);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error(
      "Create Order Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.description ||
          error?.message ||
          "Unable to create order.",
      },
      {
        status: 500,
      }
    );
  }
}