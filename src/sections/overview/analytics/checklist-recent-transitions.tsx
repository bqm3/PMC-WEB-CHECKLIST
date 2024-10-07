import { format } from 'date-fns';
// @mui
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { IChecklist } from 'src/types/khuvuc';
import { useState } from 'react';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  Checklist: string;
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
  tableData: IChecklist[];
  tableLabels: any;
}

export default function BankingRecentTransitions({
  title,
  subheader,
  tableLabels,
  tableData,
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
                <BankingRecentTransitionsRow key={row.ID_Checklist} row={row} />
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
  row: IChecklist;
};

function BankingRecentTransitionsRow({ row }: BankingRecentTransitionsRowProps) {
  const theme = useTheme();
  return (
    <>
      <TableRow hover style={{ backgroundColor: `${row.Tinhtrang}` === '1' ? '#FF563029' : '' }}>
        <TableCell>{row.Checklist}</TableCell>

        <TableCell> {row.Giatridinhdanh} </TableCell>
        <TableCell> {row.Giatrinhan} </TableCell>
        <TableCell> {row.ent_tang?.Tentang} </TableCell>
        <TableCell> {row.Sothutu} </TableCell>
        <TableCell> {row.Maso} </TableCell>
        <TableCell>
          {' '}
          <ListItemText
            primary={row.ent_hangmuc?.Hangmuc}
            secondary={row.ent_hangmuc?.MaQrCode}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        {/* <TableCell width={140}>{labels}</TableCell> */}
      </TableRow>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}
