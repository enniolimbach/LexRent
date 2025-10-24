/**
 * PDF Letter Document Component
 * Renders formal rental reduction letter using @react-pdf/renderer
 */

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { LetterData } from "@/utils/pdfTemplates";

// Register fonts for better Swiss German support
// Note: react-pdf includes Helvetica by default which supports German umlauts

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 40,
  },
  senderAddress: {
    fontSize: 9,
    marginBottom: 20,
  },
  recipientAddress: {
    marginBottom: 30,
  },
  recipientName: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  dateLocation: {
    marginBottom: 30,
    textAlign: "right",
  },
  subject: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    fontSize: 12,
  },
  salutation: {
    marginBottom: 15,
  },
  paragraph: {
    marginBottom: 15,
    textAlign: "justify",
  },
  closing: {
    marginTop: 30,
    marginBottom: 60,
  },
  signature: {
    marginTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    borderTop: "1 solid #ccc",
    paddingTop: 10,
  },
});

interface LetterDocumentProps {
  letterData: LetterData;
  subject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  footer: string;
}

export function LetterDocument({
  letterData,
  subject,
  salutation,
  paragraphs,
  closing,
  footer,
}: LetterDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender address (small, top left) */}
        <View style={styles.senderAddress}>
          <Text>{letterData.tenant.name}</Text>
          <Text>{letterData.tenant.address}</Text>
          <Text>{letterData.tenant.city}</Text>
        </View>

        {/* Recipient address */}
        <View style={styles.recipientAddress}>
          {letterData.landlord.name && (
            <Text style={styles.recipientName}>{letterData.landlord.name}</Text>
          )}
          {letterData.landlord.address && <Text>{letterData.landlord.address}</Text>}
        </View>

        {/* Date and location */}
        <View style={styles.dateLocation}>
          <Text>{letterData.tenant.city}, {letterData.date}</Text>
        </View>

        {/* Subject */}
        <View style={styles.subject}>
          <Text>Betreff: {subject}</Text>
        </View>

        {/* Salutation */}
        <View style={styles.salutation}>
          <Text>{salutation}</Text>
        </View>

        {/* Main content paragraphs */}
        {paragraphs.map((paragraph, index) => (
          <View key={index} style={styles.paragraph}>
            <Text>{paragraph}</Text>
          </View>
        ))}

        {/* Closing and signature */}
        <View style={styles.closing}>
          <Text>{closing}</Text>
        </View>

        <View style={styles.signature}>
          <Text>{letterData.tenant.name}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{footer}</Text>
        </View>
      </Page>
    </Document>
  );
}
