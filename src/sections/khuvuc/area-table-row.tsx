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
import { IKhuvuc, IKhoiCV } from 'src/types/khuvuc';
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  row: IKhuvuc;
  khoiCV: IKhoiCV[];
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onQrRow: VoidFunction;
  onViewRow1: any;
  onQrRowHM: any
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onQrRow,
  onDeleteRow,
  onViewRow1,
  onQrRowHM,
  khoiCV,
}: Props) {
  const {
    ID_Khuvuc,
    ID_Toanha,
    ID_KhoiCV,
    Sothutu,
    MaQrCode,
    ent_khoicv,
    Makhuvuc,
    Tenkhuvuc,
    ID_User,
    isDelete,
    ent_toanha,
    ID_KhoiCVs,
    ent_hangmuc,
  } = row;

  const confirm = useBoolean();
  const confirm1 = useBoolean();

  const collapse = useBoolean();
  const collapse1 = useBoolean();

  const popover = usePopover();
  const popover1 = usePopover();

  let ID_KhoiCVsArray: number[];

  const [ID_Hangmuc, setIDHangMuc] = useState(null);
  const [qrHM, setQrHM] = useState(null);

  // Kiểm tra xem ID_KhoiCVs là một mảng hoặc không
  if (Array.isArray(ID_KhoiCVs)) {
    // Kiểm tra xem các phần tử trong mảng có phải là số không và chuyển đổi
    ID_KhoiCVsArray = ID_KhoiCVs.filter((item) => typeof item === 'number').map(Number);
  } else if (typeof ID_KhoiCVs === 'string') {
    // Chuyển đổi từ chuỗi sang mảng số
    ID_KhoiCVsArray = ID_KhoiCVs.replace(/\[|\]/g, '') // Loại bỏ dấu ngoặc vuông
      .split(', ') // Phân tách các số
      .map((item) => Number(item?.trim())) // Chuyển đổi từ chuỗi sang số
      .filter((item) => !Number.isNaN(item)); // Loại bỏ các giá trị không hợp lệ
  } else {
    // Trong trường hợp ID_KhoiCVs không phải là mảng hoặc chuỗi, ta gán một mảng rỗng
    ID_KhoiCVsArray = [];
  }

  const shiftNames = ID_KhoiCVsArray.map((calvId) => {
    const workShift = khoiCV?.find((shift) => `${shift.ID_Khoi}` === `${calvId}`);
    return workShift ? workShift.KhoiCV : null;
  })
    .filter((name) => name !== null)
    .join(', ');

  const shiftNamesArray = shiftNames.split(', ');

  const labels = shiftNamesArray.map((name, index) => (
    <Label
      key={index}
      variant="soft"
      color={
        (`${name}` === 'Khối làm sạch' && 'success') ||
        (`${name}` === 'Khối kỹ thuật' && 'warning') ||
        (`${name}` === 'Khối bảo vệ' && 'error') ||
        'default'
      }
      style={{ marginTop: 4 }}
    >
      {name}
    </Label>
  ));

  const handleClickHangMuc = (item: any, pop: any, event:any) => {
    pop.onOpen(event);
    setIDHangMuc(item?.ID_Hangmuc);
    setQrHM(item)
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
       <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      
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
          KV{ID_Khuvuc}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar alt={customer.name} src={customer.avatarUrl} sx={{ mr: 2 }} /> */}

        <ListItemText
          primary={Tenkhuvuc}
          secondary={ent_khoicv?.KhoiCV}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell> {ent_toanha?.Toanha} </TableCell>

      <TableCell align="center"> {MaQrCode} </TableCell>
      <TableCell> {`${Makhuvuc}`}</TableCell>

      <TableCell>{labels}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {ent_hangmuc?.map((item: any) => (
              <Stack
                key={item?.ID_Hangmuc}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                <TableCell>
                  <Box>HM{item.ID_Hangmuc}</Box>
                </TableCell>
                <ListItemText
                  primary={item?.Hangmuc}
                  secondary={item?.MaQrCode}
                  primaryTypographyProps={{
                    typography: 'body2',
                  }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />

                <TableCell>
                  <Label
                    variant="soft"
                    color={
                      (`${item?.ID_KhoiCV}` === '1' && 'success') ||
                      (`${item?.ID_KhoiCV}` === '2' && 'warning') ||
                      (`${item?.ID_KhoiCV}` === '3' && 'error') ||
                      'default'
                    }
                  >
                    {ent_khoicv?.KhoiCV}
                  </Label>
                </TableCell>
                <IconButton
                  color={popover1.open ? 'inherit' : 'default'}
                  onClick={(event) => handleClickHangMuc(item, popover1, event)}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );
  return (
    <>
      {renderPrimary}
      {renderSecondary}
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
          Xem
        </MenuItem>

        <MenuItem
          onClick={() => {
            onQrRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:qrcode" />
          Ảnh Qr
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={popover1.open}
        onClose={popover1.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow1(ID_Hangmuc);
            popover1.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>

        <MenuItem
          onClick={() => {
            onQrRowHM(qrHM);
            popover1.onClose();
          }}
        >
          <Iconify icon="mdi:qrcode" />
          Ảnh Qr
        </MenuItem>

      </CustomPopover>

      <ConfirmDialog
        open={confirm1.value}
        onClose={confirm1.onFalse}
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
