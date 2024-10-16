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
import { IKhuvuc, IKhoiCV, ILocation } from 'src/types/khuvuc';
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  row: ILocation;
  selected: boolean;
  // khoiCV: IKhoiCV[];
  
  // onViewRow: VoidFunction;
  // onSelectRow: VoidFunction;
  // onDeleteRow: VoidFunction;
  // onQrRow: VoidFunction;
  // onViewRow1: any;
  // onQrRowHM: any;
  index: number;
};

export default function AreaTableRow({
  row,
  selected,
  // onViewRow,
  // onSelectRow,
  // onQrRow,
  // onDeleteRow,
  // onViewRow1,
  // onQrRowHM,
  // khoiCV,
  index,
}: Props) {
  const {
    id,
    project,
    ca,
    nguoi,
    cv,
    detailedCoordinates
  } = row;

  const collapse = useBoolean();

  const popover = usePopover();

 
  const backgroundColorStyle = index % 2 !== 0 ? '#f3f6f4' : '';
  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: backgroundColorStyle }}>

      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          KV{id}
        </Box>
      </TableCell>

      <TableCell>{project}</TableCell>
      <TableCell> {ca} </TableCell>

      <TableCell sx={{color: 'black', fontWeight: '700'}}> {nguoi} </TableCell>

      <TableCell>{cv}</TableCell>
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
          <Stack component={Paper} sx={{ m: 1, }}>
            {detailedCoordinates?.map((item: any) => (
              <Stack
                key={item?.coordinates}
                direction="row"
                sx={{ mt: 1, borderWidth: 2, borderColor: 'black', borderTop: 1}}
              >
                <TableCell sx={{color: 'black', fontSize: 15}}>
                {item.coordinates}
                </TableCell>

                <TableCell>
                {item?.detailedItems?.map((it: any) => (
              <Stack
                key={it?.Gioht}
                direction="row"
                alignItems="center"
               
              >
                <TableCell>
                  <Box>{it.Gioht}</Box>
                </TableCell>

                <TableCell>{it?.relatedHangmuc}</TableCell>
               
              </Stack>
            ))}
                </TableCell>
               
               
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
    

     
    </>
  );
}
