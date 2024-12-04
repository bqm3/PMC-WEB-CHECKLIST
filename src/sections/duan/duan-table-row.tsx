// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { IDuan } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IDuan;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onViewDuAnRow: VoidFunction;
  user: any
};

export default function CalvTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onViewDuAnRow,
  user
}: Props) {
  const { ID_Duan, Duan, Diachi, ent_chinhanh } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>

      <TableCell>
        <Box
          onClick={user.ID_Chucvu === 1 ? onViewRow : onViewDuAnRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {ID_Duan}
        </Box>
      </TableCell>
      <TableCell>{Duan}</TableCell>
      <TableCell>{ent_chinhanh?.Tenchinhanh}</TableCell>
      <TableCell>{Diachi}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

      </TableCell>
    </TableRow>
  );

  // const renderSecondary = (
  //   <TableRow>
  //     <TableCell sx={{ p: 0, border: 'none' }} colSpan={12}>
  //       <Collapse
  //         in={collapse.value}
  //         timeout="auto"
  //         unmountOnExit
  //         sx={{ bgcolor: 'background.neutral' }}
  //       >
  //         <Stack component={Paper} sx={{ m: 1 }}>
  //           {toanhas?.map((item: any) => (
  //             <Stack
  //               key={item.ID_Khuvuc}
  //               direction="row"
  //               alignItems="center"
  //               sx={{
  //                 p: (theme) => theme.spacing(1, 1, 1, 1),

  //               }}
  //             >
  //               <ListItemText
  //                 primary={item.Toanha}
  //                 primaryTypographyProps={{
  //                   typography: 'body2',
  //                 }}
  //                 secondaryTypographyProps={{
  //                   component: 'span',
  //                   color: 'text.disabled',
  //                 }}
  //               />

  //               <TableCell> {item.Sotang} tầng</TableCell>
  //               <TableCell> {item.khuvucLength} Khu vực</TableCell>
  //               <TableCell> {item.totalHangmucInToanha} Hạng mục</TableCell>
  //               <TableCell width={300}> {item?.tenKhois?.join(", \n")}</TableCell>
  //             </Stack>
  //           ))}
  //         </Stack>
  //       </Collapse>
  //     </TableCell>
  //   </TableRow>
  // );

  return (
    <>
      {renderPrimary}

      {/* {renderSecondary} */}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {
          user.ID_Chucvu === 1 && <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Xem
          </MenuItem>
        }

        <MenuItem
          onClick={() => {
            onViewDuAnRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem dự án
        </MenuItem>

        {
          user.ID_Chucvu === 1 && <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        }

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
