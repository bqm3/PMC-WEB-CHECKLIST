
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { inputBaseClasses } from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
// utils
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
// _mock
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
// types
import { IInvoiceItem } from 'src/types/invoice';
import { IBookingOrderDetail } from 'src/types/room';
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';


// ----------------------------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  // const totalOnRow = values.items.map((item: IInvoiceItem) => item.quantity * item.price);

  // const subTotal = sum(totalOnRow);

  // const totalAmount = subTotal - values.discount - values.shipping + values.taxes;

  // useEffect(() => {
  //   setValue('totalAmount', totalAmount);
  // }, [setValue, totalAmount]);

  // const handleAdd = () => {
  //   append({
  //     title: '',
  //     description: '',
  //     service: '',
  //     quantity: 1,
  //     price: 0,
  //     total: 0,
  //   });
  // };

  // const handleRemove = (index: number) => {
  //   remove(index);
  // };

  // const handleClearService = useCallback(
  //   (index: number) => {
  //     resetField(`items[${index}].quantity`);
  //     resetField(`items[${index}].price`);
  //     resetField(`items[${index}].total`);
  //   },
  //   [resetField]
  // );

  // const handleSelectService = useCallback(
  //   (index: number, option: string) => {
  //     setValue(
  //       `items[${index}].price`,
  //       INVOICE_SERVICE_OPTIONS.find((service) => service.name === option)?.price
  //     );
  //     setValue(
  //       `items[${index}].total`,
  //       values.items.map((item: IInvoiceItem) => item.quantity * item.price)[index]
  //     );
  //   },
  //   [setValue, values.items]
  // );

  // const handleChangeQuantity = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
  //     setValue(`items[${index}].quantity`, Number(event.target.value));
  //     setValue(
  //       `items[${index}].total`,
  //       values.items.map((item: IInvoiceItem) => item.quantity * item.price)[index]
  //     );
  //   },
  //   [setValue, values.items]
  // );

  // const handleChangePrice = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
  //     setValue(`items[${index}].price`, Number(event.target.value));
  //     setValue(
  //       `items[${index}].total`,
  //       values.items.map((item: IInvoiceItem) => item.quantity * item.price)[index]
  //     );
  //   },
  //   [setValue, values.items]
  // );

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(values?.total)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(values?.total)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell width={40}>#</TableCell>

                <TableCell sx={{ typography: 'subtitle2' }}>Name Room</TableCell>

                <TableCell>Count</TableCell>

                <TableCell align="right">Price</TableCell>

                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {values.order_details?.map((row: IBookingOrderDetail, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Box sx={{ maxWidth: 560 }}>
                      <Typography variant="subtitle2">{row.room_name}</Typography>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {fDate(row?.checkinDate)}  -  {fDate(row?.checkoutDate)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">{row.personCount}</TableCell>

                  <TableCell align="center">{row.dateCount} days</TableCell>

                  <TableCell align="right">{fCurrency(row.total)} /day</TableCell>

                  <TableCell align="right">{fCurrency((Number(row.total)) * Number(row.dateCount))}</TableCell>
                </TableRow>
              ))}

              {renderTotal}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Box>
  );
}
