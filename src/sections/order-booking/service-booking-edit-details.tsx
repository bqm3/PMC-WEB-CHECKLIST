
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


  return (
    <Box sx={{ p: 3 }}>
      <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                {/* <TableCell width={40}>#</TableCell> */}

                <TableCell sx={{ typography: 'subtitle2' }}>OrderId</TableCell>

                <TableCell align="center">Created At</TableCell>

                <TableCell align="center">Quantity</TableCell>

                <TableCell align="right">Price</TableCell>

                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* {values?.map((row: IBookingOrderDetail, index: number) => ( */}
              <TableRow>
                {/* <TableCell>{index + 1}</TableCell> */}

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">HD-{values?.order_id}</Typography>

                    {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {fDate(values?.createdAt)}
                    </Typography> */}
                  </Box>
                </TableCell>

                <TableCell align="center">{fDate(values?.createdAt)}</TableCell>
                <TableCell align="center">{values?.quantity}</TableCell>

                <TableCell align="right">{fCurrency(values?.price)}</TableCell>

                <TableCell align="right">{fCurrency(values?.price)}</TableCell>
              </TableRow>
              {/* ))} */}

            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Box>
  );
}
