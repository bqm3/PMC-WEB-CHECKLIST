import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _tours, TOUR_PUBLISH_OPTIONS, ROOM_DETAILS_TABS, } from 'src/_mock';
// components
import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';
//
import { IRoom } from 'src/types/room';
import { useGetRoom, useGetReview } from 'src/api/product';

import { RoomDetailsSkeleton } from '../room-skeleton';
import RoomDetailsToolbar from '../room-details-toolbar';
import RoomDetailsContent from '../room-details-content';
import RoomDetailsReview from '../room-details-reviews';



// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function RoomDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const { room, roomLoading, roomEmpty } = useGetRoom(id)

  const { reviews, reviewLoading, reviewEmpty } = useGetReview(id)

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <RoomDetailsSkeleton />;

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {ROOM_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'reviews' ? (
              <Label variant="filled">{reviews?.length}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <RoomDetailsToolbar
        backLink={paths.dashboard.room.root}
        editLink={paths.dashboard.room.edit(`${room?.data?.id}`)}
        liveLink="#"
        publishOptions={TOUR_PUBLISH_OPTIONS}
      />
      {renderTabs}
      {roomLoading && renderSkeleton}

      {currentTab === 'content' && room && <RoomDetailsContent data={room?.data} images={room?.images} />}

      {currentTab === 'reviews' && <RoomDetailsReview reviews={reviews} />}
    </Container>
  );
}
