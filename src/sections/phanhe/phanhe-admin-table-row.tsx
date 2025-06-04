import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { IDuan, IHSSE } from 'src/types/khuvuc';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onViewRow: VoidFunction;
};

export default function CalvTableRow({ row, selected, onViewRow }: Props) {
  const { Tenduan, Thamso, iGiayphep, Chisogiayphep, Chisotrungbinh, Ghichu, ent_phanhe } = row;

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ width: 150 }}>{Tenduan}</TableCell>
      <TableCell sx={{ width: 150 }}>{ent_phanhe?.Phanhe}</TableCell>
      <TableCell sx={{ width: 150 }}>{Thamso}</TableCell>
      <TableCell sx={{ width: 100 }}>{iGiayphep === 0 ? 'Không' : 'Có'}</TableCell>
      <TableCell sx={{ width: 100 }}>{Chisogiayphep}</TableCell>
      <TableCell sx={{ width: 100 }}>{Chisotrungbinh}</TableCell>
      <TableCell sx={{ width: 100 }}>{Ghichu}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover?.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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
          Xem
        </MenuItem>
      </CustomPopover>
    </>
  );
}
