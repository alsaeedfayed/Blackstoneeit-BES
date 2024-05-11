export interface IPerson {
  id?: string;
  name: string;
  image: string;
  backgroundColor: string;
  isActive: boolean;
  position: string;
  email?: string;
}

export interface iOwner {
  name: {
    en: string;
    ar: string;
  };
  userId: string;
  profileImage: string;
  position: string;
  email: string;
  date: any;
}

export interface IRequester {
  id: string;
  fileName: string;
  fullName: string;
  fullArabicName: string;
  email: string;
  position: string;
}
