import { IRoom, IRoomImage, IService } from 'src/types/room';
import Lightbox, { useLightBox } from 'src/components/lightbox';

// @mui
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
// components
import Image from 'src/components/image';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import Markdown from 'src/components/markdown';
import Stack from '@mui/material/Stack';
// _mock
import { TOUR_SERVICE_OPTIONS } from 'src/_mock';
import Typography from '@mui/material/Typography';
//
import { fCurrency } from 'src/utils/format-number';
// utils
import { fDate } from 'src/utils/format-time';
import { m } from 'framer-motion';
import { varTranHover } from 'src/components/animate';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  data: IRoom;
  // services: IService[];
  images: IRoomImage[];
};

export default function RoomDetailsContent({ data, images }: Props) {
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
    numberChildren,
    image,
    roomImages,
    roomRatings,
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
  } = data;

  // Initialize slides with an empty array
  const [slides, setSlides] = useState<IRoomImage[] | any>([]);

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


  const [arrImages, setArrImages] = useState<IRoomImage[]>([]);

  useEffect(() => {
    if (roomImages) {
      const slidess = roomImages?.map((slide: IRoomImage | any) => ({
        src: slide?.name,
      }));
      setSlides(slidess);
    }
  }, [roomImages]);

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  const renderGallery = (
    <>
      <Box
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <m.div
          key={`${image}`}
          whileHover="hover"
          variants={{
            hover: { opacity: 0.8 },
          }}
          transition={varTranHover()}
        >
          <Image
            alt={`${image}`}
            src={`${image}`}
            ratio="1/1"
            onClick={() => handleOpenLightbox(`${image}`)}
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
        </m.div>

        <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {slides && slides?.slice(0, 4).map((item: any) => (
            <m.div
              key={`${item.src}`}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                src={`${item.src}`}
                ratio="1/1"
                onClick={() => handleOpenLightbox(`${item.src}`)}
                sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </m.div>
          ))}
        </Box>
      </Box>

      {slides &&
        <Lightbox
          index={selectedImage}
          slides={slides}
          open={openLightbox}
          close={handleCloseLightbox}
        />
      }
    </>
  );

  const renderHead = (
    <>
      <Stack direction="row" sx={{ mb: 1 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {name}
        </Typography>

        <IconButton>
          <Iconify icon="solar:share-bold" />
        </IconButton>

        <Checkbox
          defaultChecked
          color="error"
          icon={<Iconify icon="solar:heart-outline" />}
          checkedIcon={<Iconify icon="solar:heart-bold" />}
        />
      </Stack>
      <Typography variant="body1" sx={{ flexGrow: 1, mb: 2 }}>
        {title}
      </Typography>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
          <Iconify icon="ic:baseline-price-change" color="red" />
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Price
          </Box>
          {!!price && (
            <Box
              component="span"
              sx={{ color: 'grey.500', mr: 0.25, textDecoration: 'line-through' }}
            >
              {fCurrency(price)}
            </Box>
          )}
          {fCurrency(priceSale)}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {ratingTB}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>({roomRatings ? roomRatings.length : 0} reviews)</Link>
        </Stack>


      </Stack>
      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
          <Iconify icon="ic:baseline-bed" color="green" />

          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {numberBed}
          </Box>
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Bed
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="ic:baseline-supervisor-account" sx={{ color: 'black' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {numberPeople}
          </Box>
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Adults
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="fa6-solid:children" sx={{ color: 'black' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {numberChildren}
          </Box>
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Childrens
          </Box>
        </Stack>


      </Stack>
    </>
  );

  const renderOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      {[
        {
          label: 'Total Ratings',
          value: `${roomRatings ? roomRatings.length : 0} `,
          icon: <Iconify icon="ic:round-star-rate" />,
        },
        {
          label: 'Phone Number Contact',
          value: '365-374-4961',
          icon: <Iconify icon="solar:phone-bold" />,
        },
        {
          label: 'Total Reviews',
          value: `${roomRatings ? roomRatings.length : 0} `,
          icon: <Iconify icon="ic:baseline-rate-review" />,
        },
        {
          label: 'Information',
          value: 'Customer Service Advisor',
          icon: <Iconify icon="solar:user-rounded-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderContent = (
    <>
      {/* <Stack spacing={2}>
        <Typography variant="h6"> Services</Typography>

        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {services.map((ser: IService) => (
            <Stack
              key={ser.id}
              spacing={1}
              direction="row"
              alignItems="center"

            >
              <Iconify
                icon="eva:checkmark-circle-2-outline"
                sx={{
                  color: 'green',
                }}
              />
              {ser.name}
            </Stack>
          ))}
        </Box>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed', my: 2 }} /> */}

      <Markdown children={description} />

    </>
  );

  return (
    <>
      {slides && renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

        {renderContent}
      </Stack>
    </>
  );
}
