import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, productName, name, email, phone, message } = body;

    if (!productId || !productName || !name || !email) {
      return NextResponse.json(
        { error: "Product info, name, and email are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        productId,
        productName,
        name,
        email,
        phone: phone || null,
        message: message || null,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
