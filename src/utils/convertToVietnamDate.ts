// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment-timezone';


export const convertToVietnamDate = (date: string | Date | null): string | null => {
  if (!date) return null;
  
  return moment(date)
    .tz('Asia/Ho_Chi_Minh') // Chuyển về múi giờ +7
    .startOf('day') // Bỏ phần giờ, giữ nguyên ngày
    .format('YYYY-MM-DD'); // Định dạng YYYY-MM-DD
}; 