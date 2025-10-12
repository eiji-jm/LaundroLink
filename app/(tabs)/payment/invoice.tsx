import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useLayoutEffect } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Invoice() {
  const router = useRouter();
  const navigation = useNavigation();
  const { invoice, amount, status, date } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { 
        backgroundColor: "#89CFF0",
        borderBottomWidth: 1.5,        
        borderBottomColor: "#5EC1EF",
      },
      headerTintColor: "#000",
      headerShadowVisible: false,
      headerTitle: () => <Text style={styles.headerText}>INVOICE</Text>,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleDownload = async () => {
    try {
      const html = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 30px;
          background-color: #f2f7fb;
          color: #333;
        }
        .invoice-container {
          max-width: 750px;
          margin: auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(90deg, #004aad, #5EC1EF);
          color: white;
          text-align: center;
          padding: 25px 20px;
        }
        .header h2 {
          margin: 0;
          font-size: 28px;
          letter-spacing: 0.5px;
        }
        .section {
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
        }
        .section:last-child {
          border-bottom: none;
        }
        h3 {
          color: #004aad;
          margin-bottom: 12px;
          border-left: 4px solid #004aad;
          padding-left: 8px;
        }
        p {
          margin: 4px 0;
          line-height: 1.5;
        }
        .info {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .info div {
          width: 48%;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .table th {
          background-color: #e9f3ff;
          text-align: center;
          padding: 10px;
          font-size: 14px;
          color: #004aad;
        }
        .table td {
          text-align: center;
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }
        .table td.item {
          text-align: left;
          font-weight: 500;
        }
        .table tr:last-child td {
          border-bottom: none;
        }
        .summary {
          background-color: #f9fbff;
          padding: 15px 20px;
          border-radius: 8px;
          margin-top: 15px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin: 6px 0;
          font-size: 15px;
        }
        .summary-row .label {
          font-weight: 600;
          color: #444;
        }
        .summary-row .value {
          font-weight: 700;
          color: #004aad;
        }
        .discount {
          color: #e63946;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 13px;
          color: #555;
          background-color: #f8faff;
          border-top: 1px solid #eaeaea;
        }
        .footer span {
          color: #004aad;
          font-weight: 600;
        }
      </style>
    </head>

    <body>
      <div class="invoice-container">
        <div class="header">
          <h2>LaundroLink Invoice</h2>
          <p>Professional Laundry & Delivery Service</p>
        </div>

        <div class="section">
          <div class="info">
            <div>
              <p><b>Invoice #:</b> ${invoice || "INV-2025-0911-001"}</p>
              <p><b>Invoice Date:</b> ${date || "25 Sept 2025"}</p>
            </div>
            <div style="text-align: right;">
              <p><b>Status:</b> ${status || "Paid"}</p>
              <p><b>Payment Method:</b> GCash</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Customer Details</h3>
          <p>👤 <b>MJ Dimapas</b></p>
          <p>📞 +63 123 456 789</p>
          <p>🏠 123 St., Cebu City</p>
        </div>

        <div class="section">
          <h3>Order Breakdown</h3>
          <table class="table">
            <tr>
              <th>Item</th><th>Qty</th><th>Price</th><th>Total</th>
            </tr>
            <tr>
              <td class="item">Laundry (Wash & Fold)</td>
              <td>5 kg</td>
              <td>₱50/kg</td>
              <td>₱250</td>
            </tr>
            <tr>
              <td class="item">Service Fee</td>
              <td>-</td>
              <td>-</td>
              <td>₱50</td>
            </tr>
            <tr>
              <td class="item">Delivery Fee</td>
              <td>-</td>
              <td>-</td>
              <td>₱70</td>
            </tr>
            <tr>
              <td class="item discount">Discount Promo</td>
              <td>-</td>
              <td>-</td>
              <td class="discount">-₱20</td>
            </tr>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span class="label">Subtotal:</span>
              <span class="value">₱370</span>
            </div>
            <div class="summary-row">
              <span class="label">Discount:</span>
              <span class="value discount">-₱20</span>
            </div>
            <div class="summary-row">
              <span class="label">Total:</span>
              <span class="value">${amount || "₱350"}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          💙 Thank you for trusting <span>LaundroLink</span>! <br/>
          For assistance, contact (123) 456-7890 or visit our app.
        </div>
      </div>
    </body>
  </html>
`;


      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("PDF Generated", `Saved to: ${uri}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate invoice PDF");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Invoice Info */}
      <View style={styles.sectionCard}>
        <Text style={styles.label}>Invoice #:</Text>
        <Text style={styles.value}>{invoice || "INV-2025-0911-001"}</Text>
        <Text style={styles.label}>Invoice Date:</Text>
        <Text style={styles.value}>{date || "25 Sept 2025"}</Text>
      </View>

      {/* Customer Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.subHeader}>Customer Details</Text>
        <View style={styles.customerRow}>
          <Ionicons name="person-circle-outline" size={20} color="#004aad" />
          <Text style={styles.customerText}>MJ Dimpas</Text>
        </View>
        <View style={styles.customerRow}>
          <Ionicons name="call-outline" size={20} color="#004aad" />
          <Text style={styles.customerText}>+63 123 456 789</Text>
        </View>
        <View style={styles.customerRow}>
          <Ionicons name="location-outline" size={20} color="#004aad" />
          <Text style={styles.customerText}>123 St., Cebu City</Text>
        </View>
      </View>

      {/* Order Breakdown */}
      <View style={styles.sectionCard}>
        <Text style={styles.subHeader}>Order Breakdown</Text>
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.tableItem}>Item</Text>
          <Text style={styles.tableQty}>Qty</Text>
          <Text style={styles.tablePrice}>Price</Text>
          <Text style={styles.tableTotal}>Total</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.tableItem}>Laundry (Wash & Fold)</Text>
          <Text style={styles.tableQty}>5 kg</Text>
          <Text style={styles.tablePrice}>₱50/kg</Text>
          <Text style={styles.tableTotal}>₱250</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.tableItem}>Service Fee</Text>
          <Text style={styles.tableQty}>-</Text>
          <Text style={styles.tablePrice}>-</Text>
          <Text style={styles.tableTotal}>₱50</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.tableItem}>Delivery Fee</Text>
          <Text style={styles.tableQty}>-</Text>
          <Text style={styles.tablePrice}>-</Text>
          <Text style={styles.tableTotal}>₱70</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.tableItem, styles.discount]}>Discount Promo</Text>
          <Text style={styles.tableQty}>-</Text>
          <Text style={styles.tablePrice}>-</Text>
          <Text style={[styles.tableTotal, styles.discount]}>-₱20</Text>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.sectionCard}>
        <Text style={styles.subHeader}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Subtotal:</Text>
          <Text style={styles.value}>₱370</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Discount:</Text>
          <Text style={[styles.value, styles.discount]}>-₱20</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.label, styles.bold]}>Total:</Text>
          <Text style={[styles.value, styles.bold]}>{amount || "₱350"}</Text>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.sectionCard}>
        <Text style={styles.subHeader}>Payment</Text>
        <View style={styles.paymentRow}>
          <Ionicons name="card-outline" size={20} color="#004aad" />
          <Text style={styles.paymentText}>GCash</Text>
        </View>
        <View style={styles.paymentRow}>
          <Ionicons name="checkmark-circle-outline" size={20} color={status === "Paid" ? "green" : status === "Cancelled" ? "red" : "orange"} />
          <Text style={[styles.paymentText, status === "Paid" ? { color: "green", fontWeight: "bold" } : status === "Cancelled" ? { color: "red", fontWeight: "bold" } : { color: "orange", fontWeight: "bold" }]}>
            {status || "Paid"} ({date || "9 Sept 2025"})
          </Text>
        </View>
      </View>

      {/* Download Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleDownload}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Download / Share PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>💙 Thank you for trusting LaundroLink! 💙</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#000" },

  sectionCard: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  subHeader: { fontWeight: "bold", fontSize: 16, marginBottom: 8, color: "#333" },

  customerRow: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  customerText: { fontSize: 14, color: "#333", marginLeft: 8 },

  row: { 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderColor: "#eee", 
    paddingVertical: 8, 
    alignItems: "center",
    flexWrap: "wrap",
  },
  tableHeader: { backgroundColor: "#d6e8ff" },
  tableItem: { flex: 3, fontSize: 14, color: "#333", paddingRight: 5, minWidth: 120 },
  tableQty: { flex: 1, textAlign: "center", fontSize: 14, minWidth: 40 },
  tablePrice: { flex: 1, textAlign: "center", fontSize: 14, minWidth: 60 },
  tableTotal: { flex: 1, textAlign: "center", fontSize: 14, fontWeight: "bold", minWidth: 60 },

  bold: { fontWeight: "bold" },
  discount: { color: "red", fontWeight: "bold" },

  label: { fontSize: 14, color: "#555", flex: 1 },
  value: { fontSize: 14, color: "#000", marginBottom: 3, flex: 1, textAlign: "right" },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3, alignItems: "center" },

  paymentRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  paymentText: { fontSize: 14, color: "#333", marginLeft: 8 },

  buttonContainer: { padding: 15, alignItems: "center" },
  btn: {
    flexDirection: "row",
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  btnText: { color: "#fff", fontWeight: "bold", marginLeft: 10, fontSize: 15 },

  footer: { textAlign: "center", marginVertical: 20, fontStyle: "italic", color: "#555", fontSize: 13 },
});