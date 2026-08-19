export interface Banner {
  _id: string;
  title: string;
  image: string;
  linkType?: string; // ব্যাকএন্ডে linkType পাঠাচ্ছেন (যেমন: 'flashSale', 'none')
  linkId?: string;   // ব্যাকএন্ডে linkId পাঠাচ্ছেন
  isActive: boolean;
  createdAt: string;
  updatedAt?: string; // অপশনাল: MongoDB response এ সাধারণত এটিও থাকে
}