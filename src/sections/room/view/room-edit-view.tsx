import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';

//
import RoomNewEditForm from '../room-edit-view';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function RoomEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { room: currentRoom } = useGetRoom(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Room',
            href: paths.dashboard.room.root,
          },
          { name: currentRoom?.data.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RoomNewEditForm currentRoom={currentRoom?.data} />
    </Container>
  );
}
