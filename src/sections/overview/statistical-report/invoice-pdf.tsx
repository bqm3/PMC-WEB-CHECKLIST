import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// component

// auth
import { useAuthContext } from 'src/auth/hooks';
// utils
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
// types
import { IInvoice } from 'src/types/invoice';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        mt40: { marginTop: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        1: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  spreadsheetData: any;
};

export default function InvoicePDF({ spreadsheetData }: Props) {
  const styles = useStyles();

  const { user, logout } = useAuthContext();

  const formattedData = spreadsheetData.map((row: any) => row.map((cell: any) => cell.value));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image
            src={user?.ent_duan?.Logo || 'https://pmcweb.vn/wp-content/uploads/logo.png'}
            style={{ width: 120, height: 60 }}
          />
        </View>
        <View style={[styles.table, styles.mt40]}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell_1}>{formattedData[0][0]}</Text>
            {formattedData[0].slice(1).map((header: string, index: number) => (
              <Text key={index} style={styles.tableCell_3}>
                {header}
              </Text>
            ))}
          </View>
          {/* Data Rows */}
          {formattedData.slice(1).map((row: any, rowIndex: number) => (
            <View style={styles.tableRow} key={rowIndex}>
              <Text style={styles.tableCell_1}>{row[0]}</Text>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle1}>{row[1]}</Text>
              </View>
              {row.slice(2).map((cell: any, cellIndex: number) => (
                <Text key={cellIndex} style={styles.tableCell_3}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
