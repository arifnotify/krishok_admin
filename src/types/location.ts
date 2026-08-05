export interface TranslatedText {
  en: string;
  bn: string;
}

export interface Location {
  _id: string;
  division: TranslatedText;
  district: TranslatedText;
  deliveryCharge: number;
  isActive: boolean;
}