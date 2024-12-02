import { useMemo } from 'react';
import { Page, View, Text, Image, Document, Font, StyleSheet } from '@react-pdf/renderer';
// utils
import { TbChecklistCalv } from 'src/types/khuvuc';

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
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
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
          width: '40%',
          paddingRight: 4,
        },
        tableCell_3: {
          width: '15%',
        },
        tableCell_4: {
          width: '25%',
          paddingRight: 4,
        },
      }),
    []
  );

// ----------------------------------------------------------------------

type Props = {
  currentChecklist?: TbChecklistCalv[];
  dataChecklistC: any;
};

export default function InvoicePDF({ dataChecklistC, currentChecklist }: Props) {
  // const {
  //   Anh, Ghichu, Gioht, ID_Checklist, ID_ChecklistC, ID_Checklistchitiet, Ketqua, ent_checklist, tb_checklistc, status
  // } = currentChecklist;

  const { ent_calv, ent_user, ent_khoicv, Ngay, Giobd, Giokt, Tinhtrang } = dataChecklistC

  const styles = useStyles();

  const formatDateString = (dateString: any) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }

    return dateString;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/logo-pmc-big.png" style={{ width: 110, height: 90 }} />

          {/* <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{dataChecklistC?.Tinhtrang === 0 ? 'Mở ra' : 'Đóng ca'}</Text>
            <Text> {invoiceNumber} </Text>
          </View> */}
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Thông tin trong ca</Text>
            <Text style={styles.body2}>Ca: {dataChecklistC?.ent_calv?.Tenca}</Text>
            <Text style={styles.body2}>Nguời Checklist: {dataChecklistC?.ent_user?.Hoten}</Text>
            <Text style={styles.body2}>Khối: {dataChecklistC?.ent_khoicv?.KhoiCV}</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>{" "}</Text>
            <Text style={styles.body2}>Ngày: {formatDateString(dataChecklistC?.Ngay)}</Text>
            <Text style={styles.body2}>Giờ mở/khóa: {dataChecklistC?.Giobd} - {dataChecklistC?.Giokt}</Text>
            <Text style={styles.body2}>Tình trạng: {dataChecklistC?.Tinhtrang === 0 ? 'Mở ra' : 'Đóng ca'}</Text>
          </View>
        </View>

        {/* <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Date create</Text>
            <Text style={styles.body2}>{fDate(createDate)}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Due date</Text>
            <Text style={styles.body2}>{fDate(dueDate)}</Text>
          </View>
        </View> */}

        <Text style={[styles.subtitle1, styles.mb8]}>Danh sách chi tiết</Text>

        <View style={styles.table}>
          <View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_4}>
                <Text style={styles.subtitle2}>Tên checklist</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Hạng mục(Khu vực - Tòa)</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Tầng</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Kết quả</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Giờ kiểm tra</Text>
              </View>
              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Ghi chú</Text>
              </View>


            </View>
          </View>

          <View>
            {currentChecklist?.map((item, index) => (
              <View style={styles.tableRow} key={item.ID_Checklist}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text>{item.ent_checklist.Checklist}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.ent_checklist.ent_hangmuc.Hangmuc}</Text>
                  <Text>{item.ent_checklist.ent_khuvuc.Tenkhuvuc} - {item.ent_checklist.ent_khuvuc.ent_toanha.Toanha}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.ent_checklist.ent_tang.Tentang}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.Ketqua} {`${item.ent_checklist?.isCheck}` === '1' ? `(${item.ent_checklist?.Giatrinhan})` : ''}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.Gioht}</Text>
                </View>
                <View style={styles.tableCell_3}>
                  <Text>{item.Ghichu}</Text>
                </View>
                {/* <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.price * item.quantity)}</Text>
                </View> */}
              </View>
            ))}

            {/* <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Subtotal</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(subTotal)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Shipping</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-shipping)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Discount</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-discount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Taxes</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(taxes)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(totalAmount)}</Text>
              </View>
            </View> */}
          </View>
        </View>

        {/* <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text>support@abcapp.com</Text>
          </View>
        </View> */}
      </Page>
    </Document>
  );
}
