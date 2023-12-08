
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

  const total = values?.total ?? 0; // Nếu values?.total không tồn tại, gán giá trị mặc định là 0
  const serviceCharge = values?.service_charge ?? 0;

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
          {fCurrency(total - serviceCharge)}
        </TableCell>
      </StyledTableRow>


      {
        serviceCharge !== 0 &&

        <StyledTableRow>
          <TableCell colSpan={3} />
          <TableCell sx={{ color: 'text.secondary' }}>
            <Box sx={{ mt: 2 }} />
            Service Charge
          </TableCell>
          <TableCell width={120} sx={{ typography: 'subtitle2' }}>
            <Box sx={{ mt: 2 }} />
            {fCurrency(serviceCharge)}
          </TableCell>
        </StyledTableRow>
      }

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(total)}
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

                <TableCell align="center">Days Count</TableCell>

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

                  <TableCell align="right">{fCurrency(row.price)} /day</TableCell>

                  <TableCell align="right">{fCurrency(row.total)}</TableCell>
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
