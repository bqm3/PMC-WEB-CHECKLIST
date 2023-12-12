// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import axios from 'axios';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// types
// import { IProductReview } from 'src/types/product';
import { IRoomReview } from 'src/types/room';
//
import RoomReviewItem from './room-review-item';

// ----------------------------------------------------------------------

type Props = {
  reviews: IRoomReview[];
};

export default function ProductReviewList({ reviews }: Props) {
  const router = useRouter();

  const handleAction = async (id: any) => {
    const res = await axios.put(
      `https://be-nodejs-project.vercel.app/api/reviews/hidden-review/${id}`
    );
    if (res.status === 200) {
      window.location.reload();
    }
    // router.push(paths.dashboard.room.);
  };

  return (
    <>
      {reviews.map((review) => (
        <RoomReviewItem key={review.id} review={review} handleAction={handleAction} />
      ))}
    </>
  );
}
