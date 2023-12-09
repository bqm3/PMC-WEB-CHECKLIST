export type IRoomFilterValue = string | string[] | null;

export type IRoomFilters = {
  labels: string;
  services: string[];
};

export type IFacilities = {
  id: string;
  name: string;
  image: string;
  location: string;
  phone: string;
  logo: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
};

export type ITypeRoom = {
  id: string;
  name: string;
  createdAt: Date;
};

export type IService = {
  id: string;
  name: string;
  detail: string;
  unit: string;
  price: number;
  status: number;
  type_service_id: number | null;
  type_service: string;
};

export type IVoucher = {
  id: string;
  name: string;
  value: number;
  isShow: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IRoomService = {
  id: string;
  name: string;
};
export type IRoomRating = {
  id: string;
  name: string;
  status: string;
};

export type IRoomImage = {
  id: string;
  type: string;
  name: string;
  data: string | null;
  // type: string;
};

export type IRoomReview = {
  id: string;
  fullname: string;
  phonenumber: string;
  email: string;
  content: string;
  image: string;
  rating: number;
  status: number;
  room_id: string;
  customer_id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IRoom = {
  id: string;
  name: string;
  title: string;
  description: string;
  price: number;
  priceSale: number;
  rating: number;
  totalRating: number;
  totalReview: number;
  numberBed: number;
  numberPeople: number;
  numberChildren: number;
  status: number;
  label: number;
  isLiked: number;
  image: string | any;
  voucher_id: number;
  type_room_id: number;
  createdAt: Date;
  updatedAt: Date;
  service: IRoomService[];
  roomImages: IRoomImage[];
  roomRatings: IRoomRating[]
};

export type IBookingOrder = {
  id: string;
  createdDate: Date;
  count: number;
  status: number;
  total: number;
  note: string;
  service_charge: number | null;
  customer_id: number;
  employee_id: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  customer: string;
};
export type IBookingService = {
  id: string;
  quantity: number;
  active: number;
  room_id: number;
  order_id: number;
  service_id: string;
  customer_id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  name: string;
  price: number;
  fullname: string;
  email: string;
};


export type IBookingOrderData = {
  id: number | string;
  createdDate: Date;
  count: number;
  status: number | string;
  total: number;
  note: string;
  customer: number;
  employee: number | null;
  createdAt: Date;
  updatedAt: Date | null;
  od_detail: string;
  service_charge: number;
  email: string;
  code: string;
  phone: string;
  phonenumber: string;
  fullname: string;
  emp_email: string;
  emp_fullname: string;
};

export type IBookingOrderDetail = {
  checkinDate: Date | string | any;
  checkoutDate: Date | string | any;
  status: string;
  dateCount: string;
  personCount: string;
  childCount: string;
  total: string;
  price: string;
  room_name: string;
  room_id: string;
};

export type IOrderBookingTableFilterValue = string | string[] | Date | null;

export type IOrderBookingTableFilters = {
  customer: string;
  service: string[];
  status: number | string;
  createdDate: Date | null;
  endDate: Date | null;
  active: number;
};

export type IUser = {
  id: string;
  fullname: string;
  phonenumber: string;
  code: string;
  passwordHash: string;
  address: string;
  birthday: Date;
  avatar: string;
  status: string;
  email: string;
  role_id: number;
  createdAt: Date;
  updatedAt: Date;
  formatted_birthday: string;
};


export type IUserTableFilters = {
  name: string;
  role_id: string[];
  status: string;
};
