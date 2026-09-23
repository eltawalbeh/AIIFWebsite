import type { CmsPage, CmsSection } from '../types/site';

export const primaryNav = [
  ['/', 'Home'], ['/about-us', 'About Us'], ['/board', 'Board'], ['/media-center', 'Media Center'], ['/contact-us', 'Contact Us']
] as const;
export const pageSeed: CmsPage[] = [
  {slug:'home',title:{en:'Home',ar:'الرئيسية'},seoTitle:{en:'Arab International Investor Forum',ar:'المنتدى العربي الدولي للمستثمرين'},seoDescription:{en:'Where capital, knowledge and opportunity connect.',ar:'حيث تلتقي رؤوس الأموال والمعرفة والفرص.'},status:'approved'},
  {slug:'about-us',title:{en:'About Us',ar:'من نحن'},seoTitle:{en:'About AIIF',ar:'عن المنتدى العربي الدولي للمستثمرين'},seoDescription:{en:'Institutional role, initiatives, partners and milestones.',ar:'الدور المؤسسي والمبادرات والشركاء والمحطات التاريخية.'},status:'draft'},
  {slug:'board',title:{en:'Board',ar:'مجلس الإدارة'},seoTitle:{en:'AIIF Board',ar:'مجلس إدارة المنتدى'},seoDescription:{en:'Leadership and governance.',ar:'القيادة والحوكمة.'},status:'draft'},
  {slug:'media-center',title:{en:'Media Center',ar:'المركز الإعلامي'},seoTitle:{en:'AIIF Media Center',ar:'المركز الإعلامي للمنتدى'},seoDescription:{en:'News, press releases, awards and publications.',ar:'الأخبار والبيانات الصحفية والجوائز والمنشورات.'},status:'draft'},
  {slug:'contact-us',title:{en:'Contact Us',ar:'اتصل بنا'},seoTitle:{en:'Contact AIIF',ar:'اتصل بالمنتدى'},seoDescription:{en:'Contact the Arab International Investor Forum.',ar:'التواصل مع المنتدى العربي الدولي للمستثمرين.'},status:'draft'}
];
export const sectionSeed: CmsSection[] = [
  {id:'about-intro',pageSlug:'about-us',key:'intro',title:{en:'About AIIF',ar:'عن المنتدى'},body:{en:'AIIF connects investment with knowledge. Its role is to create space for dialogue, research exchange and closer relationships between academia, enterprise and the investment community.',ar:'يربط المنتدى العربي الدولي للمستثمرين بين الاستثمار والمعرفة، ويوفر مساحة للحوار وتبادل البحوث وتعزيز العلاقات بين الأوساط الأكاديمية وقطاع الأعمال ومجتمع الاستثمار.'},order:1,status:'draft'},
  {id:'about-initiatives',pageSlug:'about-us',key:'initiatives',title:{en:'Initiatives',ar:'المبادرات'},body:{en:'Current status and details are managed in the CMS and remain unpublished until approved.',ar:'تتم إدارة الحالة والتفاصيل الحالية عبر نظام إدارة المحتوى، وتبقى غير منشورة حتى اعتمادها.'},order:2,status:'draft'},
  {id:'about-partners',pageSlug:'about-us',key:'partners',title:{en:'Partners',ar:'الشركاء'},body:{en:'Current and historical partnerships are maintained separately and require confirmation before publication.',ar:'تُدار الشراكات الحالية والتاريخية بصورة منفصلة، وتتطلب تأكيداً قبل النشر.'},order:3,status:'draft'},
  {id:'board-intro',pageSlug:'board',key:'intro',title:{en:'Leadership and governance',ar:'القيادة والحوكمة'},body:{en:'Board and leadership records appear only when approved in the CMS.',ar:'تظهر سجلات مجلس الإدارة والقيادة فقط بعد اعتمادها في نظام إدارة المحتوى.'},order:1,status:'draft'},
  {id:'media-intro',pageSlug:'media-center',key:'intro',title:{en:'Media Center',ar:'المركز الإعلامي'},body:{en:'News, press releases, awards and publications in one place.',ar:'الأخبار والبيانات الصحفية والجوائز والمنشورات في مكان واحد.'},order:1,status:'draft'},
  {id:'contact-intro',pageSlug:'contact-us',key:'intro',title:{en:'Contact Us',ar:'اتصل بنا'},body:{en:'Official contact information appears here after management confirmation.',ar:'تظهر معلومات الاتصال الرسمية هنا بعد تأكيد الإدارة.'},order:1,status:'draft'}
];
