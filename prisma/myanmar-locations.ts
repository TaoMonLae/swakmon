// ---------------------------------------------------------------------------
// Myanmar States, Regions & Townships
// ---------------------------------------------------------------------------
// Complete list of Myanmar's administrative divisions: 7 States, 7 Regions
// and 1 Union Territory (Naypyidaw), along with their townships.
//
// NOTE: A few slugs are intentionally kept for backwards compatibility with
// existing links/seed data:
//   - Kayin (Karen) State -> 'karen-state'
//   - Tanintharyi Region  -> 'thanintharyi'
//   - Mon State           -> 'mon-state'
// ---------------------------------------------------------------------------

export interface StateSeed {
    name: string
    slug: string
    townships: string[]
}

export const MYANMAR_STATES: StateSeed[] = [
    // ── States ────────────────────────────────────────────────────────────────
    {
        name: 'Kachin State',
        slug: 'kachin-state',
        townships: [
            'Myitkyina', 'Waingmaw', 'Tanai', 'Chipwi', 'Tsawlaw', 'Injangyang',
            'Mogaung', 'Mohnyin', 'Hpakant', 'Bhamo', 'Shwegu', 'Momauk', 'Mansi',
            'Puta-O', 'Sumprabum', 'Machanbaw', 'Nawngmun', 'Khaunglanhpu',
        ],
    },
    {
        name: 'Kayah State',
        slug: 'kayah-state',
        townships: [
            'Loikaw', 'Demoso', 'Hpruso', 'Shadaw', 'Bawlakhe', 'Hpasawng', 'Mese',
        ],
    },
    {
        name: 'Kayin State',
        slug: 'karen-state',
        townships: [
            'Hpa-An', 'Hlaingbwe', 'Thandaunggyi', 'Myawaddy', 'Kawkareik',
            'Kyainseikgyi', 'Papun',
        ],
    },
    {
        name: 'Chin State',
        slug: 'chin-state',
        townships: [
            'Hakha', 'Thantlang', 'Falam', 'Tedim', 'Tonzang', 'Mindat', 'Matupi',
            'Kanpetlet', 'Paletwa',
        ],
    },
    {
        name: 'Mon State',
        slug: 'mon-state',
        townships: [
            'Mawlamyine', 'Kyaikmaraw', 'Chaungzon', 'Thanbyuzayat', 'Ye', 'Mudon',
            'Thaton', 'Paung', 'Kyaikto', 'Bilin',
        ],
    },
    {
        name: 'Rakhine State',
        slug: 'rakhine-state',
        townships: [
            'Sittwe', 'Ponnagyun', 'Rathedaung', 'Pauktaw', 'Myebon', 'Minbya',
            'Mrauk-U', 'Kyauktaw', 'Maungdaw', 'Buthidaung', 'Kyaukpyu', 'Ann',
            'Ramree', 'Manaung', 'Toungup', 'Thandwe', 'Gwa',
        ],
    },
    {
        name: 'Shan State',
        slug: 'shan-state',
        townships: [
            'Taunggyi', 'Nyaungshwe', 'Hopong', 'Hsihseng', 'Kalaw', 'Pindaya',
            'Ywangan', 'Pinlaung', 'Lawksawk', 'Pekon', 'Kyethi', 'Mongkaing',
            'Laihka', 'Mongnai', 'Mongpan', 'Langkho', 'Mongton', 'Lashio', 'Hsenwi',
            'Mongyai', 'Tangyan', 'Kunlong', 'Hopang', 'Mongmao', 'Pangwaun',
            'Narphan', 'Laukkaing', 'Konkyan', 'Kutkai', 'Muse', 'Namhkam', 'Namtu',
            'Namhsan', 'Kyaukme', 'Hsipaw', 'Mongmit', 'Kengtung', 'Mongkhet',
            'Mongla', 'Mongyang', 'Mongping', 'Tachileik', 'Mongphyak', 'Mongyawng',
            'Monghsat', 'Mongtong',
        ],
    },

    // ── Regions ─────────────────────────────────────────────────────────────
    {
        name: 'Sagaing Region',
        slug: 'sagaing-region',
        townships: [
            'Sagaing', 'Myinmu', 'Myaung', 'Monywa', 'Chaung-U', 'Yinmabin',
            'Salingyi', 'Pale', 'Budalin', 'Ayadaw', 'Kani', 'Shwebo', 'Khin-U',
            'Wetlet', 'Kanbalu', 'Kyunhla', 'Ye-U', 'Tabayin', 'Taze', 'Tigyaing',
            'Kawlin', 'Wuntho', 'Pinlebu', 'Katha', 'Indaw', 'Banmauk', 'Mawlaik',
            'Paungbyin', 'Kalewa', 'Kale', 'Mingin', 'Tamu', 'Khamti', 'Homalin',
            'Hkamti', 'Lahe', 'Leshi', 'Nanyun',
        ],
    },
    {
        name: 'Tanintharyi Region',
        slug: 'thanintharyi',
        townships: [
            'Dawei', 'Launglon', 'Thayetchaung', 'Yebyu', 'Myeik', 'Kyunsu',
            'Palaw', 'Tanintharyi', 'Kawthaung', 'Bokpyin',
        ],
    },
    {
        name: 'Bago Region',
        slug: 'bago-region',
        townships: [
            'Bago', 'Thanatpin', 'Kawa', 'Waw', 'Nyaunglebin', 'Kyauktaga',
            'Daik-U', 'Shwegyin', 'Taungoo', 'Yedashe', 'Kyaukkyi', 'Phyu',
            'Oktwin', 'Htantabin', 'Pyay', 'Paukkaung', 'Padaung', 'Paungde',
            'Thegon', 'Shwedaung', 'Okpho', 'Zigon', 'Nattalin', 'Minhla',
            'Gyobingauk', 'Letpadan',
        ],
    },
    {
        name: 'Magway Region',
        slug: 'magway-region',
        townships: [
            'Magway', 'Yenangyaung', 'Chauk', 'Taungdwingyi', 'Myothit', 'Natmauk',
            'Minbu', 'Pwintbyu', 'Ngape', 'Salin', 'Sidoktaya', 'Thayet', 'Minhla',
            'Mindon', 'Kamma', 'Aunglan', 'Sinbaungwe', 'Pakokku', 'Yesagyo',
            'Myaing', 'Pauk', 'Seikphyu', 'Gangaw', 'Htilin', 'Saw', 'Tilin',
            'Kyaukpadaung',
        ],
    },
    {
        name: 'Mandalay Region',
        slug: 'mandalay-region',
        townships: [
            'Aungmyethazan', 'Chanayethazan', 'Chanmyathazi', 'Mahaaungmye',
            'Pyigyidagun', 'Amarapura', 'Patheingyi', 'Madaya', 'Singu', 'Pyinoolwin',
            'Mogok', 'Thabeikkyin', 'Kyaukse', 'Sintgaing', 'Myittha', 'Tada-U',
            'Nyaung-U', 'Kyaukpadaung', 'Ngazun', 'Myingyan', 'Taungtha', 'Natogyi',
            'Mahlaing', 'Wundwin', 'Meiktila', 'Thazi', 'Pyawbwe', 'Yamethin',
            'Pyinmana', 'Tatkon',
        ],
    },
    {
        name: 'Yangon Region',
        slug: 'yangon-region',
        townships: [
            'Yangon', 'Dagon', 'Bahan', 'Kamayut', 'Sanchaung', 'Hlaing',
            'Mayangone', 'Insein', 'Mingaladon', 'Hlaingthaya', 'Shwepyitha',
            'Kyauktada', 'Pabedan', 'Latha', 'Lanmadaw', 'Ahlone', 'Kyimyindaing',
            'Dagon Seikkan', 'North Okkalapa', 'South Okkalapa', 'Thingangyun',
            'Yankin', 'Tamwe', 'Mingala Taungnyunt', 'Botataung', 'Pazundaung',
            'Dawbon', 'Thaketa', 'Thanlyin', 'Kyauktan', 'Thongwa', 'Kayan',
            'Twante', 'Kawhmu', 'Kungyangon', 'Dala', 'Seikkyi Kanaungto',
            'Hmawbi', 'Htantabin', 'Taikkyi', 'Hlegu',
        ],
    },
    {
        name: 'Ayeyarwady Region',
        slug: 'ayeyarwady-region',
        townships: [
            'Pathein', 'Kangyidaunt', 'Kyonpyaw', 'Yegyi', 'Ngapudaw', 'Thabaung',
            'Kyaunggon', 'Hinthada', 'Zalun', 'Lemyethna', 'Myanaung', 'Kyangin',
            'Ingapu', 'Myaungmya', 'Einme', 'Labutta', 'Mawlamyinegyun', 'Wakema',
            'Pyapon', 'Bogale', 'Kyaiklat', 'Dedaye', 'Maubin', 'Pantanaw',
            'Nyaungdon', 'Danubyu',
        ],
    },

    // ── Union Territory ───────────────────────────────────────────────────────
    {
        name: 'Naypyidaw Union Territory',
        slug: 'naypyidaw',
        townships: [
            'Zabuthiri', 'Zeyathiri', 'Pobbathiri', 'Ottarathiri', 'Dekkhinathiri',
            'Lewe', 'Pyinmana', 'Tatkon',
        ],
    },
]

