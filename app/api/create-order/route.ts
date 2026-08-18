import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log("KEY ID EXISTS:", !!keyId);
    console.log("KEY SECRET EXISTS:", !!keySecret);

    if (!keyId) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_ID missing on server" },
        { status: 500 }
      );
    }

    if (!keySecret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET missing on server" },
        { status: 500 }
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
    console.error("Create Order Error:", error);

    return NextResponse.json(
      {
        error:
          error?.description ||
          error?.message ||
          "Unable to create order",
      },
      { status: 500 }
    );
  }
}