import { format } from 'date-fns';
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
// types
import { IOrderItem } from 'src/types/order';
import { IKhuvuc, IKhoiCV, IBaocaochiso, IHangMucChiSo } from 'src/types/khuvuc';
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useState } from 'react';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  row: IHangMucChiSo;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  index: number;
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
}: Props) {
  const {
    Donvi,
    Heso,
    ID_LoaiCS,
    Ten_Hangmuc_Chiso,
    ID_Hangmuc_Chiso,
    ent_loai_chiso
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const backgroundColorStyle = index % 2 !== 0 ? '#f3f6f4' : '';

  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: backgroundColorStyle }}>

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          SC{ID_Hangmuc_Chiso}
        </Box>
      </TableCell>
      <TableCell>{ent_loai_chiso?.TenLoaiCS}</TableCell>

      <TableCell> {Ten_Hangmuc_Chiso} </TableCell>
      <TableCell> {Heso} </TableCell>
      <TableCell> {Donvi} </TableCell>
      <TableCell>
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
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Cập nhật
        </MenuItem>

      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />
    </>
  );
}
