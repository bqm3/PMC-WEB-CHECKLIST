
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { IDayChecklistC } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IDayChecklistC;
  selected: boolean;
  onViewNot: VoidFunction;
};

export default function AreaTableRow({
  row,
  selected,
  onViewNot,
}: Props) {
  const {
    Ngay,
    Ca,
    Tong,
    TongC,
    KhoiCV,
    ID_KhoiCV,
    Chuky
  } = row;


  const popover = usePopover();

  const [year, month, day] = Ngay.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell>{formattedDate}</TableCell>

      <TableCell>
        {' '}
        {TongC} / {Tong}
      </TableCell>

      <TableCell> {Ca} </TableCell>
      <TableCell> {Chuky} </TableCell>
      <TableCell>
        {' '}
        <Label
          variant="soft"
          color={
            (`${ID_KhoiCV}` === '1' && 'success') ||
            (`${ID_KhoiCV}` === '2' && 'warning') ||
            (`${ID_KhoiCV}` === '3' && 'error') ||
            (`${ID_KhoiCV}` === '4' && 'info') ||
            'default'
          }
        >
          {KhoiCV}
        </Label>
      </TableCell>
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
        sx={{ width: 150 }}
      >

        <MenuItem
          onClick={() => {
            onViewNot();
            popover.onClose();
          }}
        >
          <Iconify icon="eva:close-circle-fill" />
          Chưa checklist
        </MenuItem>


      </CustomPopover>


    </>
  );
}
