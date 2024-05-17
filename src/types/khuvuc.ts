export type IRoomFilterValue = string | string[] | null;

export type IRoomFilters = {
  labels: string;
  services: string[];
};

export type IKhuvucTableFilterValue = string | null;

export type IKhuvucTableFilters = {
  name: string;
  status: string;
};

export type E_KhoiCV = {
  KhoiCV: string;
  ID_KhoiCV: string;
};

export type E_Chucvu = {
  Chucvu: string;
};

export type E_Toanha = {
  ID_Toanha: string;
  Sotang: string;
  Toanha: string;
};

export type E_Duan = {
  Duan: string;
};

export type E_Calv = {
  Tenca: string;
  ID_Calv: string;
  Giobatdau: string;
  Gioketthuc: string;
};

export type E_Tang = {
  ID_Tang: string;
  Tentang: string;
  Sotang: string;
};

export type IDuan = {
  ID_Duan: string;
  Duan: string;
  Diachi: string;
  Vido: string;
  Kinhdo: string;
}

export type IGiamsat = {
  ID_Giamsat: string;
  ID_Duan: string;
  ID_Chucvu: string;
  ID_KhoiCV: string;
  Hoten: string;
  Ngaysinh: string;
  Sodienthoai: string;
  Gioitinh: string;
  iQuyen: string;
  ent_khoicv: E_KhoiCV;
  ent_chucvu: E_Chucvu;
  // ent_quyen: ;
  isDelete: string;
};


export type IUser = {
  ID_User: string;
  ID_Duan: string;
  UserName: string;
  Permission: string;
  ID_KhoiCV: string | any;
  Emails: string;
  Password: string;
  isDelete: string;
  ent_khoicv: E_KhoiCV;
  ent_duan: IDuan;
  ent_chucvu: IChucvu;
};

export type IChucvu = {
  ID_Chucvu: string;
  Chucvu: string;
}


export type IKhuvuc = {
  ID_Khuvuc: string;
  ID_Toanha: string;
  ID_KhoiCV: string;
  Sothutu: string;
  Makhuvuc: string;
  MaQrCode: string;
  Tenkhuvuc: string;
  ID_User: string;
  isDelete: string;
  ent_khoicv: E_KhoiCV;
  ent_toanha: E_Toanha;
};

export type IToanha = {
  ID_Toanha: string;
  ID_Duan: string;
  Toanha: string;
  Sotang: string;
  isDelete: string;
  ent_duan: E_Duan;
};

export type IKhoiCV = {
  ID_Khoi: string;
  KhoiCV: string;
};

export type ICalv = {
  ID_Calv: string;
  ID_KhoiCV: string;
  ID_Duan: string;
  Tenca: string;
  Giobatdau: string;
  Gioketthuc: string;
  ID_User: string;
  isDelete: string;
  ent_khoicv: IKhoiCV;
};

export type IHangMuc = {
  ID_Hangmuc: string;
  ID_Khuvuc: string;
  MaQrCode: string;
  Hangmuc: string;
  Tieuchuankt: string;
  isDelete: string;
  ent_khuvuc: IKhuvuc;
};

export type IChecklist = {
  ID_Checklist: string;
  ID_Khuvuc: string;
  ID_Hangmuc: string;
  ID_Tang: string;
  Sothutu: string;
  Maso: string;
  MaQrCode: string;
  Checklist: string;
  Giatridinhdanh: string;
  Giatrinhan: string;
  Ghichu: string;
  Tieuchuan: string;
  ID_User: string;
  sCalv: string;
  calv_1: string;
  calv_2: string;
  calv_3: string;
  calv_4: string;
  isDelete: string;
  ent_toanha: E_Toanha;
  ent_hangmuc: IHangMuc;
  ent_tang: E_Tang;
  ent_calv: ICalv;
};
