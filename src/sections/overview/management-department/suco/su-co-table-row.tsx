import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
import { getImageUrls } from 'src/utils/get-image';
// types
import { IOrderItem } from 'src/types/order';
import { IKhuvuc, IKhoiCV, ISucongoai, TbChecklistCalv } from 'src/types/khuvuc';
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';


// ----------------------------------------------------------------------

type Props = {
  row: TbChecklistCalv;
  selected: boolean;
  onSelectRow: VoidFunction;
  index: number;
  handleClickOpen: VoidFunction;
};

export default function AreaTableRow({ row, selected, onSelectRow, index, handleClickOpen }: Props) {
  const {
    ID_Checklist, Gioht, Ghichu, Anh, ent_checklist, Ngay, Ketqua
  } = row;
  const theme = useTheme()

  const confirm = useBoolean();
  const collapse = useBoolean();

  const popover = usePopover();

  const formattedTime = Gioht.slice(0, 5);

  const backgroundColorStyle =
    index % 2 === 0 ? theme.palette.background.paper : theme.palette.grey[500];

  const arrImage: any = typeof Anh === 'string' && Anh.trim().length > 0 ? Anh.split(',') : null;

  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: backgroundColorStyle }}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>{ent_checklist?.Checklist}</TableCell>
      <TableCell>{ent_checklist?.ent_hangmuc?.Hangmuc}</TableCell>
      <TableCell>{Ketqua}</TableCell>
      <TableCell>
        <ListItemText
          primary={moment(Ngay).format('DD-MM-YYYY')}
          secondary={formattedTime}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />{' '}
      </TableCell>
      <TableCell onClick={() => handleClickOpen()} sx={{ cursor: 'pointer' }}>
        {(Anh !== null && Anh !== undefined && Anh !== '') && (
          <Avatar
            src={`${getImageUrls(3, Anh)}`}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          />
        )}
      </TableCell>
      <TableCell> {Ghichu} </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleClickOpen();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem ảnh
        </MenuItem>
      </CustomPopover>


    </>
  );
}
