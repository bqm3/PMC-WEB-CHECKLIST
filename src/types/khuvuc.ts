export type IRoomFilterValue = string | string[] | null;

export type IRoomFilters = {
  labels: string;
  services: string[];
};

export type IKhuvucTableFilterValue = string | null | [] | string[];

export type IKhuvucTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type IChecklistTableFilters ={
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  building: string[]
}

export type IBaoCaoTableFilterValue = string | null | string[] | Date;

export type IBaoCaoTableFilters = {
  name: string;
  stock: string[];
  publish: string[];
  startDate: Date | null;
  endDate: Date | null;
};



export type ITbChecklistTableFilterValue = string | Date | null;

export type ITbChecklistTableFilters = {
  name: string;
  status: number | string;
  startDate: Date | null;
  endDate: Date | null;
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
  ID_Duan: string;
  ent_duan_khoicv: IDuanKhoiCV
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

export type INhom ={
  ID_Nhom: string;
  Tennhom: string;
}

export type IDuan = {
  ID_Duan: string;
  Duan: string;
  Diachi: string;
  Vido: string;
  Kinhdo: string;
  Logo: string;
  ID_Nhom: string;
  totalKhuvucInDuan: string;
  totalHangmucInDuan: string;
  toanhas: IToanha[];
  ent_nhom: INhom;
  ent_duan_khoicv: IDuanKhoiCV[]
  
};

export type IGiamsat = {
  ID_Giamsat: string;
  ID_Duan: string;
  ID_Chucvu: string;
  ID_KhoiCV: string;
  Hoten: string;
  Ngaysinh: Date;
  Sodienthoai: string;
  Gioitinh: string;
  iQuyen: string;
  ent_khoicv: E_KhoiCV;
  ent_chucvu: E_Chucvu;
  // ent_quyen: ;
  isDelete: string;
};

export type IThietLapCa = {
  ID_ThietLapCa: string;
  Ngaythu: string;
  ID_Calv: string;
  Sochecklist: string;
  ID_Hangmucs: string;
  ID_Duan: string;
  isDelte: string;
  ent_calv: ICalv;
  ent_duan: IDuan;
}

export type IUser = {
  ID_User: string;
  ID_Duan: string;
  UserName: string;
  ID_Khuvucs: string;
  ID_Chucvu: string;
  ID_KhoiCV: string;
  ID_Chinhanh: string;
  Hoten: string;
  Ngaysinh: Date | null;
  Sodienthoai: string;
  Gioitinh: string;
  Email: string;
  Password: string;
  isDelete: string;
  ent_khoicv: E_KhoiCV;
  ent_duan: IDuan;
  ent_chucvu: IChucvu;
};

export type ISucongoai = {
  ID_Suco: string;
  ID_KV_CV: string;
  ID_Hangmuc: string;
  Ngaysuco: string;
  Giosuco: string;
  Noidungsuco: string;
  Duongdancacanh: string;
  ID_User: string;
  Tinhtrangxuly: string;
  Ngayxuly: string;
  isDelete: string;
  ent_hangmuc: IHangMuc;
  ent_user: IUser;
}

export type IChucvu = {
  ID_Chucvu: string;
  Chucvu: string;
};

export type ITang = {
  ID_Tang: string;
  Tentang: string;
  ID_Duan: string;
  ID_User: string;
  ent_duan: IDuan;
  ent_user: IUser;
};

export type E_Khuvuc_KhoiCV = {
  ID_KV_CV: string;
  ID_Khuvuc: string;
  ID_KhoiCV: string;
  ent_khoicv: E_KhoiCV;
}

export type E_Calv_KhoiCV = {
  ID_Calv_KhoiCV: string;
  ID_Calv: string;
  ID_KhoiCV: string;
  ent_khoicv: E_KhoiCV;
}

export type IKhuvuc = {
  ID_Khuvuc: string;
  ID_Toanha: string;
  Sothutu: string;
  ID_KhoiCVs: string;
  Makhuvuc: string;
  MaQrCode: string;
  Tenkhuvuc: string;
  ID_User: string;
  isDelete: string;
  ent_khuvuc_khoicvs: E_Khuvuc_KhoiCV[];
  ent_toanha: E_Toanha;
  hangMucLength: string;
  ent_hangmuc: IHangMuc[];
  KhoiCVs: IKhoiCV[]
};

export type IToanha = {
  ID_Toanha: string;
  ID_Duan: string;
  Toanha: string;
  Sotang: string;
  isDelete: string;
  khuvucLength: string;
  ent_duan: E_Duan;
  khuvuc: IKhuvuc;
  ent_khuvuc: IKhuvuc[];
  tenKhois: string[];
};

export type IKhoiCV = {
  ID_KhoiCV: string;
  KhoiCV: string;
  Chuky: string;
  Ngaybatdau: Date;
  
};

export type IDuanKhoiCV = {
  ID_Duan_KhoiCV: string;
  ID_KhoiCV: string;
  ID_Duan: string;
  Ngaybatdau: string;
  Chuky: string;
  ent_duan: IDuan;
  ent_khoicv: IKhoiCV;
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
  FileTieuChuan: string;
  Important: string;
  Tieuchuankt: string;
  isDelete: string;
  ent_khuvuc: IKhuvuc;
};

export type ITbChecklist = {
  ID_ChecklistC: string;
  ID_Duan: string;
  ID_KhoiCV: string;
  Ngay: string;
  ID_Calv: string;
  ID_User: string;
  ID_ThietLapCa: string;
  TongC: string;
  Tong: string;
  Giobd: string;
  Giokt: string;
  Ghichu: string;
  Tinhtrang: string;
  Giochupanh1: string;
  Anh1: string;
  Giochupanh2: string;
  Anh2: string;
  Giochupanh3: string;
  Anh3: string;
  Giochupanh4: string;
  Anh4: string;
  ent_khoicv: IKhoiCV;
  ent_giamsat: IGiamsat;
  ent_calv: ICalv;
  ent_user: IUser;
  ent_thietlapca: IThietLapCa
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
  Tinhtrang: string;
  isCheck: string;
  isImportant: string;
  ID_User: string;
  sCalv: string;
  calv_1: string;
  calv_2: string;
  calv_3: string;
  calv_4: string;
  isDelete: string;
  ent_toanha: E_Toanha;
  ent_hangmuc: IHangMuc;
  ent_khuvuc: IKhuvuc;
  ent_tang: E_Tang;
  ent_calv: ICalv;
};

export type TbChecklistCalv = {
  ID_Checklistchitiet: string;
  ID_ChecklistC: string;
  ID_Checklist: string;
  Ketqua: string;
  Anh: string;
  Gioht: string;
  Ghichu: string;
  isDelete: string;
  status: string;
  tb_checklistc: ITbChecklist;
  ent_checklist: IChecklist;
};
