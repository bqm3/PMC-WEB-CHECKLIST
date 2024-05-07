export type IRoomFilterValue = string | string[] | null;

export type IRoomFilters = {
  labels: string;
  services: string[];
};

export type IKhuvucTableFilterValue = string  | null;

export type IKhuvucTableFilters = {
  name: string;
  status: string;
};

export type E_KhoiCV = {
  KhoiCV: string;
}

export type E_Toanha = {
  ID_Toanha: string;
  Sotang: string;
  Toanha: string;
}

export type E_Duan = {
  Duan: string;
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
    ent_toanha: E_Toanha
  };

export type IToanha = {
  ID_Toanha: string;
  ID_Duan: string;
  Toanha: string;
  Sotang: string;
  isDelete: string;
  ent_duan: E_Duan;
}

export type IKhoiCV = {
  ID_Khoi: string;
  KhoiCV: string;
}

export type IHangMuc = {
  ID_Hangmuc: string;
  ID_Khuvuc: string;
  MaQrCode: string;
  Hangmuc: string;
  Tieuchuankt: string;
  isDelete: string;
  ent_khuvuc: IKhuvuc
};