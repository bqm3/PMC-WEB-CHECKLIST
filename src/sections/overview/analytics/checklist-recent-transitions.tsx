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
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { TableHeadCustom } from 'src/components/table';
import { IChecklist } from 'src/types/khuvuc';

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
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <BankingRecentTransitionsRow key={row.ID_Checklist} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

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
