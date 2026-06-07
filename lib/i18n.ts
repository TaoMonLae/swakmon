export type Locale = 'en' | 'my'

export function t(key: string, locale: Locale): string {
  const activeLocale = locale
  const dict = DICTIONARY[activeLocale] || DICTIONARY['en']
  return dict[key] || key
}

const DICTIONARY: Record<Locale, Record<string, string>> = {
  en: {
    // Navbar / Common
    'nav.rent': 'Rent',
    'nav.sale': 'Sale',
    'nav.land': 'Land',
    'nav.motorcycles': 'Motorcycles',
    'nav.signin': 'Sign in',
    'nav.postad': 'Post Ad',
    'nav.signout': 'Sign out',

    // Footer
    'footer.description': 'Southern Myanmar Marketplace',
    'footer.categories': 'Categories',
    'footer.states': 'States',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2025 Swak Mon သွက်မန်. Mon, Karen and Thanintharyi.',

    // Home Page
    'home.hero.title': 'Buy, sell and rent in Mon, Karen and Thanintharyi',
    'home.hero.subtitle': "Southern Myanmar's trusted classifieds platform",
    'home.search.placeholder': 'Search listings...',
    'home.search.all_categories': 'All Categories',
    'home.search.all_states': 'All States',
    'home.search.button': 'Search',
    'home.stats.listings': 'Listings',
    'home.stats.states': 'States',
    'home.stats.free': 'free to list',
    'home.stats.free_value': 'Free',
    'home.latest.title': 'Latest listings',
    'home.latest.view_all': 'View all →',
    'home.latest.empty': 'No listings in this state yet.',
    'home.cta.title': 'Want to list your property or motorcycle?',
    'home.cta.desc': "Contact our team and we'll post it for you – free for basic listings.",
    'home.cta.button': 'Post Your Ad',

    // Browse / Filters Page
    'browse.breadcrumb.home': 'Home',
    'browse.listings_found': 'listing found',
    'browse.listings_found_plural': 'listings found',
    'browse.filters.title': 'Filters',
    'browse.filters.category': 'Category',
    'browse.filters.state': 'State',
    'browse.filters.township': 'Township',
    'browse.filters.township.all': 'All Townships',
    'browse.filters.price_range': 'Price Range',
    'browse.filters.min_price': 'Min MMK',
    'browse.filters.max_price': 'Max MMK',
    'browse.filters.sort': 'Sort',
    'browse.filters.reset': 'Reset Filters',
    'browse.filters.clear': 'Clear Filters',
    'browse.filters.no_results': 'No listings match your filters',
    'browse.filters.try_adjusting': 'Try adjusting your search or filters',
    'browse.pagination.prev': 'Previous',
    'browse.pagination.next': 'Next',

    // Sort Options
    'sort.newest': 'Newest',
    'sort.oldest': 'Oldest',
    'sort.price_asc': 'Price: Low to High',
    'sort.price_desc': 'Price: High to Low',
    'sort.views': 'Most Viewed',

    // Listing Detail Page
    'detail.about': 'About this listing',
    'detail.similar': 'Similar listings',
    'detail.listed_by': 'Listed by',
    'detail.verified': 'Verified listing',
    'detail.admin': 'Swak Mon သွက်မန် Admin',
    'detail.interest': 'Interested in this listing?',
    'detail.posted': 'Posted',
    'detail.contact_managed': 'Contact is managed by the Swak Mon သွက်မန် team',
    'detail.views': 'views',

    // Post Ad Page
    'post.title': 'Post Your Ad on Swak Mon သွက်မန်',
    'post.desc': 'Our team creates your listing – just send us the details. Basic listings are free.',
    'post.how_it_works': 'How it works',
    'post.step1.title': 'Contact us',
    'post.step1.desc': 'via WhatsApp, Viber or Facebook',
    'post.step2.title': 'We review',
    'post.step2.desc': 'Team checks your info and photos',
    'post.step3.title': 'Goes live',
    'post.step3.desc': 'Within 24 hours of receiving complete details',
    'post.checklist.title': 'What to include',
    'post.checklist.item1': 'Category (Property Rent / Sale / Land Sale / Motorcycles)',
    'post.checklist.item2': 'State and Township',
    'post.checklist.item3': 'Asking price (in MMK)',
    'post.checklist.item4': 'Description – 3 to 5 sentences',
    'post.checklist.item5': 'At least 3 photos (landscape preferred)',
    'post.checklist.item6': 'Your contact phone number',
    'post.team.title': 'Contact our team',
    'post.team.recommended': 'Recommended',
    'post.team.fb_page': 'Facebook Page',
    'post.team.reply_time': 'Typical reply: within a few hours',
    'post.tiers.title': 'Choose your listing type',
    'post.tiers.popular': 'Popular',
    'post.tiers.free': 'Free',
    'post.tiers.per_week': 'per week',
  },
  my: {
    // Navbar / Common
    'nav.rent': 'ငှားရန်',
    'nav.sale': 'ရောင်းရန်',
    'nav.land': 'မြေကွက်',
    'nav.motorcycles': 'ဆိုင်ကယ်များ',
    'nav.signin': 'အကောင့်ဝင်ရန်',
    'nav.postad': 'ကြော်ငြာတင်ရန်',
    'nav.signout': 'အကောင့်ထွက်ရန်',

    // Footer
    'footer.description': 'မြန်မာနိုင်ငံတောင်ပိုင်း၏ ကြော်ငြာအရောင်းအဝယ်ဆိုက်',
    'footer.categories': 'ကဏ္ဍများ',
    'footer.states': 'ပြည်နယ်နှင့် တိုင်းဒေသကြီးများ',
    'footer.contact': 'ဆက်သွယ်ရန်',
    'footer.copyright': '© ၂၀၂၅ သွက်မန်။ မွန်၊ ကရင် နှင့် တနင်္သာရီ။',

    // Home Page
    'home.hero.title': 'မွန်၊ ကရင် နှင့် တနင်္သာရီရှိ ပစ္စည်းများ ဝယ်ယူရန်၊ ရောင်းချရန်နှင့် ငှားရမ်းရန်',
    'home.hero.subtitle': 'မြန်မာနိုင်ငံတောင်ပိုင်း၏ ယုံကြည်စိတ်ချရသော ကြော်ငြာဆိုက်',
    'home.search.placeholder': 'ကြော်ငြာများကို ရှာဖွေပါ...',
    'home.search.all_categories': 'ကဏ္ဍအားလုံး',
    'home.search.all_states': 'ပြည်နယ်/တိုင်း အားလုံး',
    'home.search.button': 'ရှာဖွေမည်',
    'home.stats.listings': 'ကြော်ငြာစုစုပေါင်း',
    'home.stats.states': 'ပြည်နယ်နှင့်တိုင်း',
    'home.stats.free': 'အခမဲ့တင်နိုင်သည်',
    'home.stats.free_value': 'အခမဲ့',
    'home.latest.title': 'နောက်ဆုံးတင်ထားသော ကြော်ငြာများ',
    'home.latest.view_all': 'အားလုံးကြည့်ရန် →',
    'home.latest.empty': 'ဤဒေသတွင် တင်ထားသော ကြော်ငြာ မရှိသေးပါ။',
    'home.cta.title': 'သင့်အိမ်၊ မြေ သို့မဟုတ် ဆိုင်ကယ်ကို ကြော်ငြာတင်လိုပါသလား။',
    'home.cta.desc': 'ကျွန်ုပ်တို့အဖွဲ့ကို ဆက်သွယ်ပြီး အသေးစိတ်ပေးပို့ပါက အခမဲ့ (ရိုးရိုးကြော်ငြာများအတွက်) တင်ပေးပါမည်။',
    'home.cta.button': 'ကြော်ငြာတင်ရန် ဆက်သွယ်ပါ',

    // Browse / Filters Page
    'browse.breadcrumb.home': 'ပင်မစာမျက်နှာ',
    'browse.listings_found': 'ကြော်ငြာ တွေ့ရှိသည်',
    'browse.listings_found_plural': 'ကြော်ငြာများ တွေ့ရှိသည်',
    'browse.filters.title': 'စစ်ထုတ်မှုများ',
    'browse.filters.category': 'ကဏ္ဍ',
    'browse.filters.state': 'ပြည်နယ်/တိုင်း',
    'browse.filters.township': 'မြို့နယ်',
    'browse.filters.township.all': 'မြို့နယ်အားလုံး',
    'browse.filters.price_range': 'ဈေးနှုန်းအပိုင်းအခြား',
    'browse.filters.min_price': 'အနည်းဆုံး MMK',
    'browse.filters.max_price': 'အများဆုံး MMK',
    'browse.filters.sort': 'စီရန်',
    'browse.filters.reset': 'စစ်ထုတ်မှုများ ဖျက်ရန်',
    'browse.filters.clear': 'စစ်ထုတ်မှုများ အားလုံးဖျက်ရန်',
    'browse.filters.no_results': 'ရှာဖွေမှုနှင့် ကိုက်ညီသော ကြော်ငြာမရှိပါ',
    'browse.filters.try_adjusting': 'ရှာဖွေမှု သို့မဟုတ် စစ်ထုတ်မှုများကို ပြောင်းလဲကြည့်ပါ',
    'browse.pagination.prev': 'ယခင်စာမျက်နှာ',
    'browse.pagination.next': 'နောက်စာမျက်နှာ',

    // Sort Options
    'sort.newest': 'နောက်ဆုံးတင်ထားသော',
    'sort.oldest': 'အစောဆုံးတင်ထားသော',
    'sort.price_asc': 'ဈေးနှုန်း: အနိမ့်မှ အမြင့်',
    'sort.price_desc': 'ဈေးနှုန်း: အမြင့်မှ အနိမ့်',
    'sort.views': 'ကြည့်ရှုမှုအများဆုံး',

    // Listing Detail Page
    'detail.about': 'ကြော်ငြာအကြောင်း',
    'detail.similar': 'ဆက်စပ်ကြော်ငြာများ',
    'detail.listed_by': 'ကြော်ငြာတင်သူ',
    'detail.verified': 'အတည်ပြုပြီး ကြော်ငြာ',
    'detail.admin': 'သွက်မန် တာဝန်ခံ',
    'detail.interest': 'ဤကြော်ငြာကို စိတ်ဝင်စားပါသလား။',
    'detail.posted': 'တင်ထားသည့်အချိန်',
    'detail.contact_managed': 'ဆက်သွယ်မှုကို သွက်မန် အဖွဲ့သားများမှ ကူညီဆောင်ရွက်ပေးပါသည်',
    'detail.views': 'ကြိမ် ကြည့်ရှုပြီး',

    // Post Ad Page
    'post.title': 'သွက်မန်တွင် ကြော်ငြာတင်ပါ',
    'post.desc': 'အချက်အလက်များကို ပေးပို့လိုက်ရုံဖြင့် သင့်ကြော်ငြာကို အခမဲ့တင်ပေးပါမည်။',
    'post.how_it_works': 'အဆင့်ဆင့် လုပ်ဆောင်ပုံ',
    'post.step1.title': 'ဆက်သွယ်ရန်',
    'post.step1.desc': 'WhatsApp, Viber သို့မဟုတ် Facebook စာမျက်နှာမှတစ်ဆင့်',
    'post.step2.title': 'ဆန်းစစ်ချက်',
    'post.step2.desc': 'ကျွန်ုပ်တို့အဖွဲ့မှ ပုံများနှင့် အချက်အလက်များကို စစ်ဆေးပါမည်',
    'post.step3.title': 'လွှင့်တင်ခြင်း',
    'post.step3.desc': 'အချက်အလက်ပြည့်စုံစွာ ရရှိပြီး ၂၄ နာရီအတွင်း တိုက်ရိုက်လွှင့်တင်ပေးပါမည်',
    'post.checklist.title': 'ပေးပို့ရမည့် အချက်အလက်များ',
    'post.checklist.item1': 'ကဏ္ဍ (အိမ်ခြံမြေ ငှား / အိမ်ခြံမြေ ရောင်း / မြေကွက် ရောင်း / ဆိုင်ကယ်များ)',
    'post.checklist.item2': 'ပြည်နယ်နှင့် မြို့နယ်',
    'post.checklist.item3': 'ရောင်းဈေး သို့မဟုတ် ငှားဈေး (ကျပ်ငွေဖြင့်)',
    'post.checklist.item4': 'အသေးစိတ်အချက်အလက် (စာကြောင်း ၃ ကြောင်းမှ ၅ ကြောင်း)',
    'post.checklist.item5': 'ဓာတ်ပုံ အနည်းဆုံး ၃ ပုံ (အလျားလိုက်ပုံများ ပိုကောင်းပါသည်)',
    'post.checklist.item6': 'ဆက်သွယ်ရမည့် ဖုန်းနံပါတ်',
    'post.team.title': 'ကျွန်ုပ်တို့အဖွဲ့ကို ဆက်သွယ်ပါ',
    'post.team.recommended': 'အကြံပြုချက်',
    'post.team.fb_page': 'Facebook စာမျက်နှာ',
    'post.team.reply_time': 'တုံ့ပြန်ချိန် - များသောအားဖြင့် နာရီပိုင်းအတွင်း',
    'post.tiers.title': 'ကြော်ငြာအမျိုးအစား ရွေးချယ်ပါ',
    'post.tiers.popular': 'လူကြိုက်အများဆုံး',
    'post.tiers.free': 'အခမဲ့',
    'post.tiers.per_week': 'တစ်ပတ်လျှင်',
  },
}

export const DYNAMIC_NAMES: Record<Locale, Record<string, string>> = {
  en: {},
  my: {
    // Categories
    'Property Rent': 'အိမ်ခြံမြေ ငှားရန်',
    'Property Sale': 'အိမ်ခြံမြေ ရောင်းရန်',
    'Land Sale': 'မြေကွက် ရောင်းရန်',
    'Motorcycles': 'မော်တော်ဆိုင်ကယ်များ',

    // States
    'Mon State': 'မွန်ပြည်နယ်',
    'Karen State': 'ကရင်ပြည်နယ်',
    'Kayin State': 'ကရင်ပြည်နယ်',
    'Thanintharyi Region': 'တနင်္သာရီတိုင်းဒေသကြီး',
    'Thanintharyi': 'တနင်္သာရီ',
    'Kachin State': 'ကချင်ပြည်နယ်',
    'Kayah State': 'ကယားပြည်နယ်',
    'Chin State': 'ချင်းပြည်နယ်',
    'Rakhine State': 'ရခိုင်ပြည်နယ်',
    'Shan State': 'ရှမ်းပြည်နယ်',
    'Sagaing Region': 'စစ်ကိုင်းတိုင်းဒေသကြီး',
    'Bago Region': 'ပဲခူးတိုင်းဒေသကြီး',
    'Magway Region': 'မကွေးတိုင်းဒေသကြီး',
    'Mandalay Region': 'မန္တလေးတိုင်းဒေသကြီး',
    'Yangon Region': 'ရန်ကုန်တိုင်းဒေသကြီး',
    'Ayeyarwady Region': 'ဧရာဝတီတိုင်းဒေသကြီး',
    'Naypyidaw Union Territory': 'နေပြည်တော် ပြည်ထောင်စုနယ်မြေ',
    'Naypyidaw': 'နေပြည်တော်',
    'Yangon': 'ရန်ကုန်',
    'Mandalay': 'မန္တလေး',

    // Townships (Mon State)
    'Mawlamyine': 'မော်လမြိုင်',
    'Kyaikmaraw': 'ကျိုက်မရော',
    'Chaungzon': 'ချောင်းဆုံ',
    'Thanbyuzayat': 'သံဖြူဇရပ်',
    'Ye': 'ရေး',
    'Mudon': 'မုဒုံ',
    'Thaton': 'သထုံ',
    'Paung': 'ပေါင်',
    'Kyaikto': 'ကျိုက်ထို',
    'Bilin': 'ဘီးလင်း',

    // Townships (Karen State)
    'Hpa-An': 'ဘားအံ',
    'Hlaingbwe': 'လှိုင်းဘွဲ့',
    'Thandaunggyi': 'သံတောင်ကြီး',
    'Myawaddy': 'မြဝတီ',
    'Kawkareik': 'ကော့ကရိတ်',
    'Kyainseikgyi': 'ကြာအင်းဆိပ်ကြီး',
    'Papun': 'ဖာပွန်',

    // Townships (Tanintharyi Region)
    'Dawei': 'ထားဝယ်',
    'Launglon': 'လောင်းလုံး',
    'Thayetchaung': 'သရက်ချောင်း',
    'Yebyu': 'ရေဖြူ',
    'Myeik': 'မြိတ်',
    'Kyunsu': 'ကျွန်းစု',
    'Palaw': 'ပုလော',
    'Kawthaung': 'ကော့သောင်း',
    'Bokpyin': 'ဘုတ်ပြင်း',

    // Townships (Yangon Region)
    'Dagon': 'ဒဂုံ',
    'Bahan': 'ဗဟန်း',
    'Kamayut': 'ကမာရွတ်',
    'Sanchaung': 'စမ်းချောင်း',
    'Hlaing': 'လှိုင်',
    'Mayangone': 'မရမ်းကုန်း',
    'Insein': 'အင်းစိန်',
    'Mingaladon': 'မင်္ဂလာဒုံ',
    'Hlaingthaya': 'လှိုင်သာယာ',
    'Shwepyitha': 'ရွှေပြည်သာ',
    'Kyauktada': 'ကျောက်တံတား',
    'Pabedan': 'ပန်းဘဲတန်း',
    'Latha': 'လသာ',
    'Lanmadaw': 'လမ်းမတော်',
    'Ahlone': 'အလုံ',
    'Kyimyindaing': 'ကြည့်မြင်တိုင်',
    'Dagon Seikkan': 'ဒဂုံဆိပ်ကမ်း',
    'North Okkalapa': 'မြောက်ဥက္ကလာပ',
    'South Okkalapa': 'တောင်ဥက္ကလာပ',
    'Thingangyun': 'သင်္ဃန်းကျွန်း',
    'Yankin': 'ရန်ကင်း',
    'Tamwe': 'တာမွေ',
    'Mingala Taungnyunt': 'မင်္ဂလာတောင်ညွန့်',
    'Botataung': 'ဗိုလ်တထောင်',
    'Pazundaung': 'ပုဇွန်တောင်',
    'Dawbon': 'ဒေါပုံ',
    'Thaketa': 'သာကေတ',
    'Thanlyin': 'သန်လျင်',
    'Kyauktan': 'ကျောက်တန်း',
    'Thongwa': 'သုံးခွ',
    'Kayan': 'ခရမ်း',
    'Twante': 'တွံတေး',
    'Kawhmu': 'ကော့မှူး',
    'Kungyangon': 'ကွမ်းခြံကုန်း',
    'Dala': 'ဒလ',
    'Seikkyi Kanaungto': 'ဆိပ်ကြီးခနောင်တို',
    'Hmawbi': 'မှော်ဘီ',
    'Htantabin': 'ထန်းတပင်',
    'Taikkyi': 'တိုက်ကြီး',
    'Hlegu': 'လှည်းကူး',

    // Pricing / Status / Tiers
    'Negotiable': 'ညှိနှိုင်း',
    'POA': 'ညှိနှိုင်း',
    'Free': 'အခမဲ့',
    'Basic': 'ရိုးရိုး',
    'Featured': 'အထူး',
    'Premium': 'ပရီမီယံ',
    'All Categories': 'ကဏ္ဍအားလုံး',
    'All States': 'ပြည်နယ်/တိုင်း အားလုံး',
    'All Townships': 'မြို့နယ်အားလုံး',
    'All': 'အားလုံး',
    'All Listings': 'ကြော်ငြာအားလုံး',
    'All listings': 'ကြော်ငြာအားလုံး',

    // Tiers features
    'Standard search position': 'သာမန် ရှာဖွေမှု အနေအထား',
    'Live within 24 hours': '၂၄ နာရီအတွင်း တိုက်ရိုက်လွှင့်တင်ပေးခြင်း',
    'Up to 3 photos': 'ဓာတ်ပုံ ၃ ပုံအထိ တင်နိုင်ခြင်း',
    'Top of category results': 'ကဏ္ဍ၏ ထိပ်ဆုံးတွင် ပြသခြင်း',
    'Featured badge': 'အထူးကြော်ငြာ တံဆိပ်',
    'Up to 10 photos': 'ဓာတ်ပုံ ၁၀ ပုံအထိ တင်နိုင်ခြင်း',
    'Priority review': 'ဦးစားပေး ဆန်းစစ်ခြင်း',
    'Homepage spotlight': 'ပင်မစာမျက်နှာ ထိပ်ဆုံးတွင် ပြသခြင်း',
    'All categories top': 'ကဏ္ဍအားလုံး၏ ထိပ်ဆုံးတွင် ပြသခြင်း',
    'Up to 20 photos': 'ဓာတ်ပုံ ၂၀ အထိ တင်နိုင်ခြင်း',
    'Social media share': 'ဆိုရှယ်မီဒီယာများသို့ မျှဝေခြင်း',
  },
}

export function translateName(name: string | null | undefined, locale: Locale): string {
  if (!name) return ''
  const activeLocale = locale
  const dict = DYNAMIC_NAMES[activeLocale] || DYNAMIC_NAMES['en']
  return dict[name] || name
}

export function formatPrice(amount: number | null | undefined, locale: Locale, priceLabel?: string | null): string {
  const activeLocale = locale

  if (amount === 0) {
    return activeLocale === 'my' ? 'အခမဲ့' : 'Free'
  }
  if (amount == null) {
    if (priceLabel) {
      return translateName(priceLabel, activeLocale)
    }
    return activeLocale === 'my' ? 'ညှိနှိုင်း' : 'POA'
  }

  // Format amount e.g. 350,000 MMK or just format label
  const formattedNum = amount.toLocaleString('en-US')
  if (activeLocale === 'my') {
    if (priceLabel) {
      // e.g. "350,000/mo" -> "350,000/လ"
      const localizedLabel = priceLabel
        .replace('/mo', '/လ')
        .replace('/week', '/ပတ်')
        .replace('negotiable', 'ညှိနှိုင်း')
        .replace('Negotiable', 'ညှိနှိုင်း')
      return `${localizedLabel} ကျပ်`
    }
    return `${formattedNum} ကျပ်`
  }

  return priceLabel ? `${priceLabel} MMK` : `MMK ${formattedNum}`
}

export function translateTimeAgo(date: Date | string | number, locale: Locale): string {
  const activeLocale = locale
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (activeLocale === 'en') {
    // Fallback to standard timeAgo
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`

    // Calendar month diff
    let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
    if (months < 1) months = 1
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
    const years = Math.floor(months / 12)
    return `${years} year${years === 1 ? '' : 's'} ago`
  }

  // Burmese time ago
  if (seconds < 60) return 'ခုနကတင်'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} မိနစ်က`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} နာရီက`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ရက်က`

  let months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
  if (months < 1) months = 1
  if (months < 12) return `${months} လက`

  const years = Math.floor(months / 12)
  return `${years} နှစ်က`
}
