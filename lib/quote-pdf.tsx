import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Quote, Customer, LineItem } from "@prisma/client";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#78350f",
  },
  companyTagline: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
  },
  quoteInfo: {
    textAlign: "right",
  },
  quoteNumber: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  quoteDate: {
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#78350f",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 4,
  },
  customerInfo: {
    lineHeight: 1.5,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#78350f",
    color: "#fff",
    padding: 8,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    padding: 8,
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  colDescription: {
    flex: 3,
  },
  colQty: {
    flex: 1,
    textAlign: "center",
  },
  colPrice: {
    flex: 1,
    textAlign: "right",
  },
  colTotal: {
    flex: 1,
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    color: "#666",
  },
  grandTotal: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    borderTopWidth: 2,
    borderTopColor: "#78350f",
    paddingTop: 8,
    marginTop: 4,
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fafafa",
    borderRadius: 4,
  },
  notesTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999",
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
  validUntil: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fef3c7",
    borderRadius: 4,
    textAlign: "center",
  },
});

type QuoteWithRelations = Quote & {
  customer: Customer;
  lineItems: LineItem[];
};

function formatCurrency(value: any): string {
  const num = typeof value === "object" ? parseFloat(value.toString()) : parseFloat(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function QuotePDF({ quote }: { quote: QuoteWithRelations }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Woodly Co.</Text>
            <Text style={styles.companyTagline}>
              Handcrafted Wooden Light Posts
            </Text>
            <Text style={{ marginTop: 8, color: "#666" }}>
              Pell City, Alabama
            </Text>
          </View>
          <View style={styles.quoteInfo}>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
            <Text style={styles.quoteDate}>
              Date: {formatDate(quote.createdAt)}
            </Text>
            {quote.validUntil && (
              <Text style={styles.quoteDate}>
                Valid Until: {formatDate(quote.validUntil)}
              </Text>
            )}
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote For</Text>
          <View style={styles.customerInfo}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {quote.customer.name}
            </Text>
            {quote.customer.address && <Text>{quote.customer.address}</Text>}
            {(quote.customer.city || quote.customer.state || quote.customer.zip) && (
              <Text>
                {[quote.customer.city, quote.customer.state, quote.customer.zip]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            )}
            {quote.customer.email && <Text>{quote.customer.email}</Text>}
            {quote.customer.phone && <Text>{quote.customer.phone}</Text>}
          </View>
        </View>

        {/* Quote Title/Description */}
        {(quote.title || quote.description) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Details</Text>
            {quote.title && (
              <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 4 }}>
                {quote.title}
              </Text>
            )}
            {quote.description && <Text>{quote.description}</Text>}
          </View>
        )}

        {/* Line Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quote Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colDescription}>Description</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colPrice}>Unit Price</Text>
              <Text style={styles.colTotal}>Total</Text>
            </View>
            {quote.lineItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={styles.colDescription}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.colTotal}>{formatCurrency(item.total)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text>{formatCurrency(quote.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text>{formatCurrency(quote.tax)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total:</Text>
            <Text>{formatCurrency(quote.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {quote.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text>{quote.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Thank you for considering Woodly Co. for your project!
          </Text>
          <Text style={{ marginTop: 4 }}>
            Questions? Contact us at hello@woodlyco.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
