import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { IRoom, IRoomImage } from 'src/types/room';
import { useEffect, useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// types
import { ITourItem } from 'src/types/tour';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
// components
import Image from 'src/components/image';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import { constants } from 'fs';
import { fCurrency } from 'src/utils/format-number';
// utils
import { fDateTime } from 'src/utils/format-time';
// routes
import { paths } from 'src/routes/paths';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

type Props = {
  room: IRoom;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function RoomItem({ room, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();

  const {
    id,
    name,
    price,
    description,
    isLiked,
    label,
    numberBed,
    numberPeople,
    rating,
    image,
    roomImages,
    service,
    status,
    title,
    totalRating,
    totalReview,
    type_room_id,
    updatedAt,
    voucher_id,
    createdAt,
    priceSale,
    roomRatings,
  } = room;

  const [ratingTB, setRatingTB] = useState(0)
  useEffect(() => {
    if (roomRatings && roomRatings.length > 0) {
      const total = roomRatings.reduce((acc, roomRating) => {
        const parsedRating = parseInt(roomRating.name, 10);
        return Number.isNaN(parsedRating) ? acc : acc + parsedRating;
      }, 0);
      const average = total / roomRatings.length || 0; // Ensure no division by zero
      setRatingTB(average);
    } else {
      setRatingTB(0);
    }
  }, [roomRatings]);



  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: 'warning.main', mr: 0.25 }} />
      {ratingTB}

      {/* {rating} */}
    </Stack>
  );

  const renderPrice = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: 'grey.800',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {!!price && (
        <Box component="span" sx={{ color: 'grey.500', mr: 0.25, textDecoration: 'line-through' }}>
          {fCurrency(price)}
        </Box>
      )}
      {fCurrency(priceSale)}
    </Stack>
  );

  const renderLabel = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 48,
        left: 16,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: 'success.main',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {(label === 1 && 'Excellent') ||
        (label === 2 && 'Very Good') ||
        (label === 3 && 'Exceptional') ||
        'default'}
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      {roomImages && (
        <>
          <Stack flexGrow={1} sx={{ position: 'relative' }}>
            {renderPrice}
            {renderRating}
            <Image
              alt={`${image}`}
              src={`${image}`}
              sx={{ borderRadius: 1, height: 164, width: 1 }}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Image
              alt={`${roomImages[0]?.name}`}
              src={`${roomImages[0]?.name}`}
              ratio="1/1"
              sx={{ borderRadius: 1, width: 80 }}
            />
            <Image
              alt={`${roomImages[1]?.name}`}
              src={`${roomImages[1]?.name}`}
              ratio="1/1"
              sx={{ borderRadius: 1, width: 80 }}
            />
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`Posted date: ${fDateTime(createdAt)}`}
      secondary={
        <Link component={RouterLink} href={paths.dashboard.room.details(id)} color="inherit">
          {name}
        </Link>
      }
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', bottom: 20, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      {[
        {
          label: `${totalRating} Reviews`,
          icon: <Iconify icon="ic:baseline-rate-review" sx={{ color: 'error.main' }} />,
        },
        {
          label: `${numberBed} Bed`,
          icon: <Iconify icon="ic:round-single-bed" sx={{ color: 'primary.main' }} />,
        },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}

        {renderTexts}
        {renderLabel}

        {renderInfo}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      </CustomPopover>
    </>
  );
}
