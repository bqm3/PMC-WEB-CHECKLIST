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
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useState } from 'react';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  row: TbChecklistCalv;
  selected: boolean;
  onSelectRow: VoidFunction;
  index: number;
  handleClickOpen: VoidFunction;
  setDetailChecklist: any;
};

export default function AreaTableRow({ row, selected, onSelectRow, index, handleClickOpen, setDetailChecklist }: Props) {
  const {
    ID_Checklist, Gioht, Ghichu, Anh, ent_checklist, Ngay, Ketqua

  } = row;
  const theme = useTheme();

  const confirm = useBoolean();
  const collapse = useBoolean();

  const popover = usePopover();

  const formattedTime = Gioht.slice(0, 5);

  const newViewImage = (items: any[]) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null; // Không render gì nếu `items` không hợp lệ
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    return items.map((url: string, index: number) => (
      <Avatar
        key={`${url}_${index}`} // Đảm bảo key duy nhất
        onClick={() => {
          setDetailChecklist(url)
          handleClickOpen()
        }} // Hành động khi click vào ảnh
        src={url} // Đường dẫn URL ảnh
        alt={url} // Alt text fallback khi ảnh lỗi
        variant="rounded" // Kiểu avatar bo góc
        sx={{
          width: 70,
          height: 70,
          cursor: 'pointer', // Con trỏ hiển thị dạng tay khi hover
          border: '1px solid #ddd', // Thêm viền nhẹ
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Thêm bóng
          transition: 'transform 0.2s ease-in-out', // Hiệu ứng hover
          '&:hover': {
            transform: 'scale(1.1)', // Phóng to nhẹ khi hover
          },
        }}
      />
    ));
  };

  const backgroundColorStyle =
    index % 2 === 0 ? theme.palette.background.paper : theme.palette.grey[200];

  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: backgroundColorStyle }}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      {/* <TableCell>
        C-{ID_Checklist}
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
      {/* <TableCell onClick={() => handleClickOpen()} sx={{ cursor: 'pointer' }}>
        {(Anh !== null && Anh !== undefined && Anh !== '') && (
          <Avatar
            // src={`https://lh3.googleusercontent.com/d/${Anh}=s1000?authuser=0`}
            src={`${getImageUrls(3, Anh)}`}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          />
        )}
      </TableCell> */}
            <TableCell sx={{ width: 120, padding: 0 }}>
              {Anh ? (
                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto', // Cho phép cuộn ngang
                    gap: 4,
                    width: 120, // Đặt chiều rộng cố định
                    whiteSpace: 'nowrap', // Ngăn hình ảnh xuống dòng
                    padding: 4,
                  }}
                  // CSS cho thanh cuộn nhỏ
                  className="custom-scrollbar"
                >
                  {newViewImage(Anh?.split(',').map((item: any) => getImageUrls(1, item)))}
                </div>
              ) : (
                <></>
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
