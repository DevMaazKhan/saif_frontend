import { COMPANY_DATA } from "@/constants/setup";
import { formatAmount } from "@/lib/utils";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import moment from "moment";

const LARGE_TEXT = 22;
const SMALL_TEXT = 14;

const LIGHT_FONT = "Helvetica";
const BOLD_FONT = "Helvetica-Bold";

const rowStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

interface IPurchaseInvoicePrint {
  companyName: string;
  invoiceDate: string;
  totalAmount: string;
  items: { name: string; qty: string; price: string }[];
}

export const PurchaseInvoicePrint = (props: IPurchaseInvoicePrint) => {
  return (
    <Document>
      <Page size="A4" style={{ padding: 10 }}>
        <View style={{ ...rowStyles }}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
            <Image src="/public/zain.png" style={{ width: "60px", height: "60px" }} />
            <View>
              <Text style={{ fontSize: LARGE_TEXT, fontFamily: BOLD_FONT }}>{COMPANY_DATA.NAME}</Text>
              <Text style={{ fontSize: SMALL_TEXT, fontFamily: LIGHT_FONT }}>Address: {COMPANY_DATA.ADDRESS}</Text>
              <Text style={{ fontSize: SMALL_TEXT, fontFamily: LIGHT_FONT }}>Phone: {COMPANY_DATA.PHONE}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20, display: "flex", gap: "4px" }}>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 140 }}>Company Name: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.companyName}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 140 }}>Invoice Date: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.invoiceDate}</Text>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={{ border: "1px solid #000", display: "flex", flexDirection: "row", alignItems: "center", padding: "5px", columnGap: 20 }}>
            <View style={{ width: 60 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>S.no</Text>
            </View>
            <View style={{ width: 200 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Name</Text>
            </View>
            <View style={{ width: 90 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Qty</Text>
            </View>
            <View style={{ width: 120 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Price</Text>
            </View>
            <View style={{ width: 120 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Total</Text>
            </View>
          </View>
          <View>
            {props.items?.map((item, i) => (
              <View style={{ borderBottom: "1px solid #000", display: "flex", flexDirection: "row", alignItems: "center", padding: "5px", columnGap: 20 }}>
                <View style={{ width: 60 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{i + 1}</Text>
                </View>
                <View style={{ width: 200 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{item.name}</Text>
                </View>
                <View style={{ width: 90 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{item.price}</Text>
                </View>
                <View style={{ width: 120 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{formatAmount(item.price)}</Text>
                </View>
                <View style={{ width: 120 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{formatAmount(+item.price * +item.qty)}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 30 }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Grand Total: </Text>
              <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT, textDecoration: "underline" }}>Rs. {formatAmount(props.totalAmount)}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: "auto", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Purchase Invoice</Text>
          <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Print at: {moment().format("DD/MM/YYYY")}</Text>
        </View>
      </Page>
    </Document>
  );
};
