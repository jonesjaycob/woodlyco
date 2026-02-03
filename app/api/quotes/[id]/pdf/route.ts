import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { QuotePDF } from "@/lib/quote-pdf";

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

    const pdfBuffer = await renderToBuffer(QuotePDF({ quote }));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${quote.quoteNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
