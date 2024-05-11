export interface ISidebarMenu {
  id: number;
  index: number;
  name: {
    en: string;
    ar: string;
  };
  icon: string;
  claims: (string | number)[];
  visible: boolean;
  children?: {
    id: number;
    index: number;
    name: {
      en: string;
      ar: string;
    };
    icon: string;
    routerLink: string;
    claims: (string | number)[];
    visible: boolean;
    hasCounter: boolean;
    children?: {
      id: number;
      index: number;
      name: {
        en: string;
        ar: string;
      };
      routerLink: string;
      claims: (string | number)[];
      visible: boolean;
    }[];
  }[];
}
