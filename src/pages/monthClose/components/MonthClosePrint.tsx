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

interface IMonthClosePrint {
  startDate: string;
  endDate: string;
  purchase: string;
  sales: string;
  saleReturns: string;
  expenses: string;
  profit: string;
}

export const MonthClosePrint = (props: IMonthClosePrint) => {
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
          <View style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Date From: </Text>
              <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.startDate}</Text>
            </View>
            <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
              <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>To: </Text>
              <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.endDate}</Text>
            </View>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start", marginTop: "20px" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Purchasing: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.purchase}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Sale: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.sales}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Sale Return: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.saleReturns}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Expenses: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.expenses}</Text>
          </View>
          <View style={{ ...rowStyles, justifyContent: "flex-start" }}>
            <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT, width: 170 }}>Profit: </Text>
            <Text style={{ fontFamily: BOLD_FONT, fontSize: SMALL_TEXT }}>{props.profit}</Text>
          </View>
        </View>

        <View style={{ marginTop: "auto", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Month Close Report</Text>
          <Text style={{ fontFamily: LIGHT_FONT, fontSize: SMALL_TEXT }}>Print at: {moment().format("DD/MM/YYYY")}</Text>
        </View>
      </Page>
    </Document>
  );
};
