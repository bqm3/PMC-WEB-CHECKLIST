import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
// @mui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { getImageUrls } from 'src/utils/get-image';
import Image from 'src/components/image';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  index: number;
};

const TABLE_HEAD = [
  { id: 'ID_Baocaochiso', label: 'Mã', width: 100 },
  { id: 'Day', label: 'Ngày gửi', width: 120 },
  { id: 'ThangNam', label: 'Tháng Năm', width: 120 },
  { id: 'Ten_Hangmuc_Chiso', label: 'Hạng mục', width: 150 },
  { id: 'Chiso', label: 'Số tiêu thụ', width: 120 },
  { id: 'Chiso_Before', label: 'Số tiêu thụ tháng trước', width: 200 },
  { id: 'Hoten', label: 'Người gửi', width: 200 },
  { id: 'Anh', label: 'Hình ảnh', width: 200 },
  { id: 'Ghichu', label: 'Ghi chú', width: 100 },
  { id: '', width: 20 },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
}: Props) {
  const collapse = useBoolean();
  const backgroundColorStyle = index % 2 !== 0 ? '#f3f6f4' : '';

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string | null) => {
    if (image) {
      setSelectedImage(image);
      setOpenDialog(true); // Mở Dialog khi click vào ảnh
    }
  };

  // Đóng Dialog khi nhấn outside hoặc nút đóng
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
  };

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
          Báo cáo {row.monthYear}
        </Box>
      </TableCell>

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
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={TABLE_HEAD.length}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {/* Header Row */}
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                p: (theme) => theme.spacing(1.5, 2),
                borderBottom: (theme) => `solid 2px ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                fontWeight: 'bold',
              }}
            >
              {TABLE_HEAD.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ width: column.width || 'auto', textAlign: 'center' }} // Căn giữa cho các header
                >
                  {column.label}
                </TableCell>
              ))}
            </Stack>

            {/* Data Rows */}
            {row?.data?.map((item: any) => (
              <Stack
                key={item?.ID_Baocaochiso}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                {TABLE_HEAD.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ width: column.width || 'auto', textAlign: 'center' }}
                  >
                    {(() => {
                      switch (column.id) {
                        case 'ID_Baocaochiso':
                          return <Box>BC-{item.ID_Baocaochiso}</Box>;
                        case 'Day':
                          return item.Day;
                        case 'ThangNam':
                          return `${item.Month}/${item.Year}`;
                        case 'Ten_Hangmuc_Chiso':
                          return item.ent_hangmuc_chiso?.Ten_Hangmuc_Chiso || '';
                        case 'Chiso':
                          return `${item.Chiso} ${item.ent_hangmuc_chiso?.Donvi || ''}`;
                        case 'Chiso_Before':
                          return `${item.Chiso_Before || 0} ${item.ent_hangmuc_chiso?.Donvi || ''}`;
                        case 'Hoten':
                          return item.ent_user?.Hoten || '';
                        case 'Anh':
                          return (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleImageClick(item?.Image)}
                            >
                              <Image
                                maxWidth={100}
                                maxHeight={100}
                                src={`${getImageUrls(2, item?.Image)}`}
                                ratio="1/1"
                              />
                            </Box>
                          );
                        case 'Ghichu':
                          return item.Ghichu || '';
                        default:
                          return null;
                      }
                    })()}
                  </TableCell>
                ))}
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
      <BootstrapDialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">

        </DialogTitle> */}
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        />

        <DialogContent dividers>
          <Image
            minWidth={500}
            minHeight={500}
            src={`${getImageUrls(2, selectedImage)}`}
            ratio="1/1"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog}>
            Đóng
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
