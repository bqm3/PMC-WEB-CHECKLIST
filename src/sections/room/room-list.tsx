import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { paths } from 'src/routes/paths';
import { IRoom } from 'src/types/room';
import { useRouter } from 'src/routes/hooks';
import RoomItem from './room-item';

type Props = {
  rooms: IRoom[];
  roomsLoading: boolean;
};

export default function TourList({ rooms, roomsLoading }: Props) {
  const router = useRouter();
  const itemsPerPage = 9; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const handleView = useCallback((id: string) => {
    router.push(paths.dashboard.room.details(id));
  }, [router]);

  const handleEdit = useCallback((id: string) => {
    router.push(paths.dashboard.room.edit(id));
  }, [router]);

  const handleDelete = useCallback((id: string) => {
    console.info('DELETE', id);
  }, []);

  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const roomsToDisplay = rooms.slice(startIndex, endIndex);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {roomsToDisplay.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            onView={() => handleView(room.id)}
            onEdit={() => handleEdit(room.id)}
            onDelete={() => handleDelete(room.id)}
          />
        ))}
      </Box>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
