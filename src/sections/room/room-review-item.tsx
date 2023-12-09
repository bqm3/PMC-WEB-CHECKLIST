// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
// utils
import { fDate } from 'src/utils/format-time';
// types
// import { IProductReview } from 'src/types/product';
import { IRoomReview } from 'src/types/room';
// components
// import Iconify from 'src/components/iconify';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  review: IRoomReview;
  handleAction: VoidFunction | any;
};

export default function ProductReviewItem({ review, handleAction }: Props) {
  const popover = usePopover();

  const { user, logout } = useAuthContext();
  const { id, rating, content, customer_id, image, status, room_id, createdAt, updatedAt } = review;

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'row',
        md: 'column',
      }}
      sx={{
        width: { md: 240 },
        textAlign: { md: 'center' },
      }}
    >
      <Avatar
        src={image}
        sx={{
          width: { xs: 48, md: 64 },
          height: { xs: 48, md: 64 },
        }}
      />

      <ListItemText
        primary="Bui Quang Minh"
        secondary={fDate(createdAt)}
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
          mb: 0.5,
        }}
        secondaryTypographyProps={{
          noWrap: true,
          typography: 'caption',
          component: 'span',
        }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack spacing={1} flexGrow={1}>
      <Rating size="small" value={rating} precision={0.1} readOnly />

      {status === 1 && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            color: 'success.main',
            typography: 'caption',
          }}
        >
          <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
          Verified purchase
        </Stack>
      )}

      <Typography variant="body2">{content}</Typography>



      <Stack direction="row" >
        {/* {user?.role_id && ( */}
        <IconButton onClick={popover.onOpen} >
          <Iconify icon="solar:pen-bold" />
        </IconButton>
        <>

          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            arrow="right-top"
            sx={{ width: 140 }}
          >
            <MenuItem
              onClick={() => {
                popover.onClose();
                // onView();
                handleAction(id)
              }}
            >
              <Iconify icon="solar:eye-bold" />
              Hidden
            </MenuItem>


          </CustomPopover>
        </>

        {/* )} */}
      </Stack>
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 } }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
