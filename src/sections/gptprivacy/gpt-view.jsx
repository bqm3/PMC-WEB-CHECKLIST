import React from 'react';
import { Container, Typography, Link } from '@mui/material';

function GptView() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chính sách quyền riêng tư
      </Typography>

      <Typography variant="body1" paragraph>
        Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn khi sử dụng GPT này.
        GPT này không lưu trữ bất kỳ dữ liệu nào của người dùng, mọi nội dung trao đổi đều chỉ được
        sử dụng trong phiên làm việc và không được lưu trữ hoặc chia sẻ lại. Các thông tin sử dụng
        cho GPT thuộc sở hữu công ty PMC.
      </Typography>

      <Typography variant="body1">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ:{' '}
        <Link href="mailto:phongsohoa@pmcweb.vn">phongsohoa@pmcweb.vn</Link>
      </Typography>
    </Container>
  );
}

export default GptView;
