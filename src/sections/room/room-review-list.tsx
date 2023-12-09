// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import axios from 'axios';
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

  const handleAction = async (id: any) => {
    await axios.put(`https://be-nodejs-project.vercel.app/api/reviews/hidden-review/${id}`)

  }

  return (
    <>
      {reviews.map((review) => (
        <RoomReviewItem key={review.id} review={review} handleAction={handleAction} />
      ))}
    </>
  );
}
