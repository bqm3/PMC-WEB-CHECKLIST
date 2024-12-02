import { format } from 'date-fns';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import Badge, { badgeClasses } from '@mui/material/Badge';
import TableContainer from '@mui/material/TableContainer';
// utils
import { fCurrency } from 'src/utils/format-number';
import { getImageUrls } from 'src/utils/get-image';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { useState } from 'react';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  checklistName: string;
  image: string;
  Anh: string;
  note: number;
  gioht: string;
  khoilv: string;
  Giamsat: string;
  calv: string | null;
  avatarUrl: string | null;
  Ngay: Date | number | string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: RowProps[];
  tableLabels: any;
  handleViewRow: any;
}

export default function BankingRecentTransitions({
  title,
  subheader,
  tableLabels,
  tableData,
  handleViewRow,
  ...other
}: Props) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Sliced data for pagination
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {paginatedData.map((row) => (
                <BankingRecentTransitionsRow key={row.Anh} row={row} handleViewRow={() => handleViewRow(row)} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        count={tableData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        dense={false}
      />
      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View All
        </Button>
      </Box> */}
    </Card>
  );
}

// ----------------------------------------------------------------------

type BankingRecentTransitionsRowProps = {
  row: RowProps;
  handleViewRow: VoidFunction
};

function BankingRecentTransitionsRow({ row, handleViewRow }: BankingRecentTransitionsRowProps) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const popover = usePopover();

  return (
    <>
      <TableRow>
        <TableCell>
          {row.checklistName}
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(row.Ngay), 'dd MMM yyyy')}
            secondary={row.gioht}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{(row.calv)}</TableCell>
        <TableCell>{(row.note)}</TableCell>
        <TableCell>
          <ListItemText
            primary={row.Giamsat}
            secondary={row.khoilv}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="center" onClick={handleViewRow} sx={{ cursor: 'pointer' }}>
          {(row.Anh !== null && row.Anh !== undefined) ? (
            <Avatar
              // src={`https://lh3.googleusercontent.com/d/${row.Anh}=s1000?authuser=0`}
              src = {`${getImageUrls(1,row.Anh)}`}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />
          ) : (
            <Avatar
              src={row.image}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />

          )}
        </TableCell>


        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow >

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={() => {
          popover.onClose();
          handleViewRow()
        }}>
          <Iconify icon="solar:eye-bold" />
          Xem ảnh
        </MenuItem>
      </CustomPopover>
    </>
  );
}
