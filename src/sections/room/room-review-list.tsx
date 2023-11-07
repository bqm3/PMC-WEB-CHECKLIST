// @mui
import Pagination, { paginationClasses } from '@mui/material/Pagination';
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
  return (
    <>
      {reviews.map((review) => (
        <RoomReviewItem key={review.id} review={review} />
      ))}

      <Pagination
        count={10}
        sx={{
          mx: 'auto',
          [`& .${paginationClasses.ul}`]: {
            my: 5,
            mx: 'auto',
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
}
