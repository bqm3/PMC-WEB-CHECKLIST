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
                <BankingRecentTransitionsRow key={row.Anh} row={row} />
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
  row: RowProps;
};

function BankingRecentTransitionsRow({ row }: BankingRecentTransitionsRowProps) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  // const renderAvatar = (
  //   <Box sx={{ position: 'relative', mr: 2 }}>
  //   </Box>
  // );

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

        <TableCell align="center">
        {(row.Anh !== null && row.Anh !== undefined) ? (
          <Avatar
            src={`https://lh3.googleusercontent.com/d/${row.Anh}=s1000?authuser=0`}
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
      

        {/* <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow >

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
