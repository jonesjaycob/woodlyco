import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function generateQuoteNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `WC-${year}${month}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, title, description, notes, validUntil, lineItems } =
      body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer is required" },
        { status: 400 }
      );
    }

    const subtotal =
      lineItems?.reduce(
        (sum: number, item: { unitPrice: number; quantity: number }) =>
          sum + item.unitPrice * (item.quantity || 1),
        0
      ) ?? 0;
    const tax = body.tax ?? 0;
    const total = subtotal + tax;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        customerId,
        title,
        description,
        notes,
        subtotal,
        tax,
        total,
        validUntil: validUntil ? new Date(validUntil) : null,
        lineItems: lineItems
          ? {
              create: lineItems.map(
                (
                  item: {
                    description: string;
                    quantity: number;
                    unitPrice: number;
                    total: number;
                  },
                  index: number
                ) => ({
                  description: item.description,
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice,
                  total: item.total || item.unitPrice * (item.quantity || 1),
                  sortOrder: index,
                })
              ),
            }
          : undefined,
      },
      include: {
        customer: true,
        lineItems: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        customer: true,
        lineItems: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
