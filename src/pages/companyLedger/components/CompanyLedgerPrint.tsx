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

interface ICompanyLedgerPrint {
  customerName: string;
  totalSales: string;
  cashReceived: string;
  credit: string;
  items: { transactionNumber: string; data: string; amount: string }[];
}

export const CompanyLedgerPrint = (props: ICompanyLedgerPrint) => {
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
          </View>{" "}
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Company Name: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.customerName}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Company Cash: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{formatAmount(props.cashReceived)}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Company Credit: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{formatAmount(props.credit)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={{ border: "1px solid #000", display: "flex", flexDirection: "row", alignItems: "center", padding: "5px", columnGap: 20 }}>
            <View style={{ width: 40 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>S.no</Text>
            </View>
            <View style={{ width: 150 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Transaction Number</Text>
            </View>
            <View style={{ width: 160 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Date/Time</Text>
            </View>
            <View style={{ width: 120 }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Amount</Text>
            </View>
          </View>
          <View>
            {props.items?.map((item, i) => (
              <View style={{ borderBottom: "1px solid #000", display: "flex", flexDirection: "row", alignItems: "center", padding: "5px", columnGap: 20 }}>
                <View style={{ width: 40 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{i + 1}</Text>
                </View>
                <View style={{ width: 150 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{item.transactionNumber}</Text>
                </View>
                <View style={{ width: 160 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{item.date}</Text>
                </View>
                <View style={{ width: 120 }}>
                  <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>{formatAmount(item.amount)}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 30 }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Grand Total: </Text>
              <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT, textDecoration: "underline" }}>Rs. {formatAmount(props.totalSales)}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: "auto", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Company Ledger</Text>
          <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Print at: {moment().format("DD/MM/YYYY")}</Text>
        </View>
      </Page>
    </Document>
  );
};
