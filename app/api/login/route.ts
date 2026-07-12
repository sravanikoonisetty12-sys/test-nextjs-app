import { NextResponse } from 'next/server';

// Ikkada 'export default' vadakudadu. 'export async function POST' ani raayali.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Email, password check
    if (email && password) {
      return NextResponse.json(
        { message: "Login successful!" }, 
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Please provide email and password" }, 
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}