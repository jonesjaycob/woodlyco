import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a quote
export async function POST(request: Request) {
  const { customerId, total, lineItems } = await request.json();
  const quote = await prisma.quote.create({
    data: { customerId, total, lineItems: {
      create: lineItems // array of line items
    } },
  });
  return NextResponse.json(quote);
}

// Get all quotes
export async function GET() {
  const quotes = await prisma.quote.findMany({include: { lineItems: true }});
  return NextResponse.json(quotes);
}

// Update a quote
export async function PUT(request: Request) {
  const { id, total, lineItems } = await request.json();
  const quote = await prisma.quote.update({
    where: { id },
    data: { total, lineItems: {
      create: lineItems // replace with new line items
    } },
  });
  return NextResponse.json(quote);
}

// Delete a quote
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.quote.delete({
    where: { id },
  });
  return NextResponse.json({ message: `Quote ${id} deleted` });
}