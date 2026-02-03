import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET single quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        lineItems: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

// PUT update quote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Delete existing line items and recreate
    if (body.lineItems) {
      await prisma.lineItem.deleteMany({ where: { quoteId: id } });
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        customerId: body.customerId,
        title: body.title,
        description: body.description,
        status: body.status,
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        notes: body.notes,
        lineItems: body.lineItems
          ? {
              create: body.lineItems.map((item: any, index: number) => ({
                description: item.description,
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice,
                total: item.total || item.unitPrice * (item.quantity || 1),
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        lineItems: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}

// DELETE quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 }
    );
  }
}
