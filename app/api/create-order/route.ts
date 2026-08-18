import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId) {
      return NextResponse.json(
        {
          error: "RAZORPAY_KEY_ID is missing on server",
        },
        { status: 500 }
      );
    }

    if (!keySecret) {
      return NextResponse.json(
        {
          error: "RAZORPAY_KEY_SECRET is missing on server",
        },
        { status: 500 }
      );
    }

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        {
          error: "Invalid payment amount",
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("RAZORPAY ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.error?.description ||
          error?.description ||
          error?.message ||
          "Unable to create order",
      },
      { status: 500 }
    );
  }
}