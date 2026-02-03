import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a customer
export async function POST(request: Request) {
  const { name, email } = await request.json();
  const customer = await prisma.customer.create({
    data: { name, email },
  });
  return NextResponse.json(customer);
}

// Get all customers
export async function GET() {
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers);
}

// Update a customer
export async function PUT(request: Request) {
  const { id, name, email } = await request.json();
  const customer = await prisma.customer.update({
    where: { id },
    data: { name, email },
  });
  return NextResponse.json(customer);
}

// Delete a customer
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.customer.delete({
    where: { id },
  });
  return NextResponse.json({ message: `Customer ${id} deleted` });
}