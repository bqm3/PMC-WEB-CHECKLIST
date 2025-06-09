import axios from 'axios';

const STORAGE_KEY = 'accessToken';

const getAccessToken = () => localStorage.getItem(STORAGE_KEY);

export interface FormData {
  ID_Phanhe: string | null;
  TenKhachHang: string;
  Tenyeucau: string;
  NoiDung: string;
  images: File[];
}

export interface FeedbackFormData {
  MoTaCongViec: string;
  TrangThai: string;
  images: File[];
}

// API calls
export const createYeuCau = async (formData: FormData) => {
  const formDataToSend = new FormData();

  // Thêm các trường dữ liệu
  formDataToSend.append('ID_Phanhe', formData?.ID_Phanhe || '');
  formDataToSend.append('TenKhachHang', formData.TenKhachHang);
  formDataToSend.append('Tenyeucau', formData.Tenyeucau);
  formDataToSend.append('NoiDung', formData.NoiDung);
  formDataToSend.append('type', '0');

  // Thêm các file ảnh
  formData.images.forEach((file) => {
    formDataToSend.append(`files`, file);
  });

  const response = await axios.post(
    `${process.env.REACT_APP_HOST_API}/yeucau-kh/create`,
    formDataToSend,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );

  return response.data;
};

export const updateYeuCau = async (id: number, formData: FormData) => {
  const updateData = {
    ID_Phanhe: formData?.ID_Phanhe,
    TenKhachHang: formData.TenKhachHang,
    Tenyeucau: formData.Tenyeucau,
    NoiDung: formData.NoiDung,
  };

  const response = await axios.put(`/api/yeucau/${id}`, updateData);
  return response.data;
};

// export const deleteYeuCau = async (id: number) => {
//   const response = await axios.put(
//     `${process.env.REACT_APP_HOST_API}/yeucau-kh/delete/${id}`,
//     { type: 0 },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${getAccessToken()}`,
//       },
//     }
//   );
//   return response.data;
// };

export const getYeuCauDetail = async (id: string) => {
  const response = await axios.get(`${process.env.REACT_APP_HOST_API}/yeucau-kh/${id}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  return response.data;
};

export const createFeedback = async (formData: FeedbackFormData, requestId: number) => {
  const formDataToSend = new FormData();

  // Thêm các trường dữ liệu
  formDataToSend.append('ID_YeuCau', `${requestId}`);
  formDataToSend.append('MoTaCongViec', formData.MoTaCongViec);
  formDataToSend.append('TrangThai', formData.TrangThai);
  formDataToSend.append('type', '1');

  // Thêm các file ảnh
  formData.images.forEach((file: File) => {
    formDataToSend.append(`files`, file);
  });

  const response = await axios.post(
    `${process.env.REACT_APP_HOST_API}/yeucau-kh/create`,
    formDataToSend,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return response.data;
};


export const deleteXuLy = async (id: number) => {
  const response = await axios.put(
    `${process.env.REACT_APP_HOST_API}/yeucau-kh/delete/${id}`,
    { type: 1 },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  );
  return response.data;
};