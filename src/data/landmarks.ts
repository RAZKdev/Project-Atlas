/**
 * Data Bangunan Ikonik & Monumen Arsitektur 3D Seluruh Negara Dunia (195 Negara Berdaulat)
 * Digunakan untuk merender miniatur landmark arsitektur khas tiap negara di atas permukaan Bola Dunia 3D,
 * dengan tiang bendera merah/biru tertancap di puncaknya.
 */

export type LandmarkType =
  | 'monas'           // Indonesia (Monas obelisk & cawan emas)
  | 'eiffel'          // France (Menara Eiffel kisi besi)
  | 'pagoda'          // Japan, Korea, China, Vietnam, Thailand (Pagoda bertingkat & atap lengkung)
  | 'pyramid'         // Egypt, Sudan (Piramida batu pasir klasik)
  | 'meso_pyramid'    // Mexico, Guatemala, Honduras, Belize (Piramida bertingkat Maya/Aztek)
  | 'inca_citadel'    // Peru, Bolivia, Ecuador (Benteng teras batu Inka)
  | 'colosseum'       // Italy, Tunisia, Croatia (Amfiteater Romawi melingkar)
  | 'tajmahal'        // India, Pakistan, Uzbekistan, Iran (Kubah Mughal & minaret)
  | 'operahouse'      // Australia (Atap cangkang layar lengkung)
  | 'liberty'         // United States (Patung dewi perunggu & obor emas)
  | 'christ'          // Brazil, Colombia, Timor-Leste (Patung Kristus tangan terentang)
  | 'petronas'        // Malaysia (Menara kembar modern dengan skybridge)
  | 'angkor'          // Cambodia, Laos (Candi menara kuncup teratai)
  | 'burj'            // UAE, Qatar, Kuwait, Singapore, Canada, New Zealand (Pencakar langit jarum kristal modern)
  | 'hallgrim'        // Iceland, Norway, Finland (Gereja kolom kristal basal)
  | 'bigben'          // United Kingdom (Menara jam neogotik)
  | 'brandenburg'     // Germany, Austria, Poland (Gerbang neoklasik pilar pualam)
  | 'windmills'       // Netherlands (Kincir angin kanal kayu)
  | 'parthenon'       // Greece, Cyprus (Kuil pualam berpilar Doria)
  | 'sagrada'         // Spain (Katedral gotik Antoni Gaudí)
  | 'basil'           // Russia, Belarus, Ukraine (Katedral kubah bawang warna-warni)
  | 'kaaba'           // Saudi Arabia (Monolit kubus kain hitam suci)
  | 'castle'          // Romania, Ireland, Czechia, Slovakia, Hungary (Kastel batu berbenteng)
  | 'adobe_mosque'    // Mali, Niger, Chad, Burkina Faso, Senegal (Arsitektur tanah liat Sudano-Sahel)
  | 'rock_church'     // Ethiopia, Armenia, Georgia (Gereja batu monolit terpahat)
  | 'moai'            // Chile (Patung monolit kepala raksasa Moai)
  | 'nature_peak'     // Tanzania, Nepal, Switzerland (Puncak gunung salju alam megah)
  | 'triumphal_arch'  // Argentina, Laos, France (Gerbang lengkung kemenangan)
  | 'monument';       // Monumen perunggu & granit klasik berukir (Bukan menara putih)

export interface LandmarkInfo {
  name: string;
  type: LandmarkType;
  height: number; // Ketinggian geometri 3D (unit Three.js)
  description?: string;
}

/**
 * Pemetaan Lengkap Landmark Ikonik Dunia untuk 195 Negara Berdaulat
 */
export const COUNTRY_LANDMARKS: Record<string, LandmarkInfo> = {
  // ===================== ASIA (48 Negara) =====================
  'ID': { name: 'Monumen Nasional (Monas)', type: 'monas', height: 0.075, description: 'Tugu cawan dan obelisk emas lambang kemerdekaan Indonesia di Jakarta' },
  'MY': { name: 'Menara Kembar Petronas', type: 'petronas', height: 0.080, description: 'Menara kembar berarsitektur modern dengan skybridge di Kuala Lumpur' },
  'SG': { name: 'Marina Bay Sands & Merlion', type: 'burj', height: 0.065, description: 'Mahakarya arsitektur modern tepi teluk Singapura' },
  'TH': { name: 'Wat Arun (Candi Fajar)', type: 'pagoda', height: 0.065, description: 'Prang menara berhias porselen di tepi Sungai Chao Phraya, Bangkok' },
  'VN': { name: 'Pagoda Tran Quoc & Jembatan Emas', type: 'pagoda', height: 0.060, description: 'Pagoda merah teratai tertua di Hanoi dan jembatan tangan raksasa Da Nang' },
  'KH': { name: 'Kuil Angkor Wat', type: 'angkor', height: 0.060, description: 'Candi batu menara kuncup teratai warisan Kekaisaran Khmer' },
  'LA': { name: 'Stupa Emas Pha That Luang', type: 'pagoda', height: 0.060, description: 'Stupa emas suci monumen kebangsaan di Vientiane' },
  'MM': { name: 'Pagoda Emas Shwedagon', type: 'pagoda', height: 0.065, description: 'Stupa emas berkilau setinggi 99 meter di Yangon' },
  'PH': { name: 'Benteng Santiago & Candi San Agustin', type: 'castle', height: 0.055, description: 'Benteng pertahanan batu bersejarah di Intramuros Manila' },
  'BN': { name: 'Masjid Sultan Omar Ali Saifuddien', type: 'tajmahal', height: 0.060, description: 'Kubah emas murni dengan laguna dan perahu mahligai di Bandar Seri Begawan' },
  'TL': { name: 'Patung Kristus Raja (Cristo Rei Dili)', type: 'christ', height: 0.070, description: 'Monumen Kristus perunggu di puncak semenanjung Tanjung Fatucama Dili' },
  'JP': { name: 'Pagoda Sensō-ji & Gerbang Torii', type: 'pagoda', height: 0.065, description: 'Pagoda lima tingkat dan gerbang torii merah tradisional Jepang' },
  'KR': { name: 'Istana Gyeongbokgung & Menara Seoul', type: 'pagoda', height: 0.065, description: 'Paviliun atap lengkung dinasti Joseon dan menara modern Seoul' },
  'CN': { name: 'Kota Terlarang & Tembok Besar', type: 'pagoda', height: 0.070, description: 'Istana kekaisaran atap genteng emas dan benteng terpanjang dunia' },
  'MN': { name: 'Patung Berkuda Genghis Khan', type: 'monument', height: 0.065, description: 'Patung ksatria baja raksasa di atas kuda di Tsonjin Boldog' },
  'KP': { name: 'Menara Juche & Gerbang Kemenangan', type: 'monas', height: 0.075, description: 'Menara obelisk granit putih setinggi 170 meter bermahkotakan obor merah menyala di tepi Sungai Taedong, Pyongyang' },
  'IN': { name: 'Taj Mahal', type: 'tajmahal', height: 0.060, description: 'Makam mahakarya pualam putih Mughal di tepi Sungai Yamuna, Agra' },
  'PK': { name: 'Minar-e-Pakistan & Masjid Badshahi', type: 'tajmahal', height: 0.065, description: 'Menara monumen kebangsaan dan masjid megah Mughal di Lahore' },
  'BD': { name: 'Monumen Martir Jatiyo Smriti Soudho', type: 'monas', height: 0.065, description: 'Tujuh menara prisma beton segitiga memorial di Savar, Dhaka' },
  'LK': { name: 'Benteng Batu Singa Sigiriya', type: 'inca_citadel', height: 0.060, description: 'Istana benteng kuno di atas tebing batu granit raksasa' },
  'NP': { name: 'Puncak Everest & Stupa Boudhanath', type: 'nature_peak', height: 0.075, description: 'Puncak tertinggi bumi di Himalaya dan stupa mata Buddha suci' },
  'BT': { name: 'Biara Sarang Harimau (Paro Taktsang)', type: 'pagoda', height: 0.065, description: 'Kuil suci yang menempel dramatis di tebing jurang Paro' },
  'MV': { name: 'Masjid Hukuru Miskiy Karang Kuno', type: 'monument', height: 0.050, description: 'Masjid bersejarah dari pahatan batu karang laut di Malé' },
  'AF': { name: 'Menara Jam & Lembah Kuno Bamiyan', type: 'bigben', height: 0.065, description: 'Menara bata hias abad ke-12 di lembah pegunungan terpencil' },
  'IR': { name: 'Menara Kemerdekaan Azadi & Persepolis', type: 'triumphal_arch', height: 0.065, description: 'Gerbang lengkung marmer putih di Teheran dan reruntuhan Persia kuno' },
  'IQ': { name: 'Ziggurat Agung Ur Babilonia', type: 'meso_pyramid', height: 0.055, description: 'Piramida bertingkat bata lumpur peradaban Sumeria di Dhi Qar' },
  'SY': { name: 'Benteng Citadel Aleppo & Palmyra', type: 'castle', height: 0.055, description: 'Benteng istana abad pertengahan di atas bukit batu' },
  'JO': { name: 'Kuil Khazneh (The Treasury) Petra', type: 'rock_church', height: 0.065, description: 'Fasad kuil megah terpahat langsung dari tebing batu pasir merah Nabatea' },
  'IL': { name: 'Kubah Shakhrah & Menara Daud', type: 'tajmahal', height: 0.060, description: 'Kubah emas oktagonal bersejarah di Kota Lama Yerusalem' },
  'PS': { name: 'Masjid Al-Aqsa & Gereja Kelahiran', type: 'tajmahal', height: 0.060, description: 'Situs suci bersejarah berkubah perak di Yerusalem Timur' },
  'LB': { name: 'Kuil Romawi Yupiter di Baalbek', type: 'parthenon', height: 0.055, description: 'Kolom pualam raksasa kuil peradaban Romawi di Lembah Bekaa' },
  'TR': { name: 'Hagia Sophia & Menara Galata', type: 'tajmahal', height: 0.065, description: 'Kubah katedral bizantium agung dan minaret megah di Istanbul' },
  'SA': { name: 'Ka\'bah Suci & Menara Abraj Al-Bait', type: 'kaaba', height: 0.055, description: 'Kiblat suci monolit hitam di Masjidil Haram, Makkah' },
  'AE': { name: 'Burj Khalifa Dubai', type: 'burj', height: 0.095, description: 'Pencakar langit tertinggi di muka bumi setinggi 828 meter' },
  'QA': { name: 'Museum Seni Islam & Menara Aspire', type: 'burj', height: 0.070, description: 'Arsitektur kubus geometris modern di tepi pantai Doha' },
  'KW': { name: 'Menara Menara Kuwait (Kuwait Towers)', type: 'burj', height: 0.075, description: 'Tiga menara berhias bola cakram biru khas tepi Teluk Persia' },
  'BH': { name: 'Benteng Bersejarah Qal\'at al-Bahrain', type: 'castle', height: 0.050, description: 'Benteng batu pelabuhan kuno peradaban Dilmun' },
  'OM': { name: 'Benteng Nizwa & Masjid Agung Sultan Qaboos', type: 'castle', height: 0.055, description: 'Benteng drum silinder kokoh peninggalan Imamah Oman' },
  'YE': { name: 'Kota Menara Tanah Liat Shibam', type: 'adobe_mosque', height: 0.060, description: '"Manhattan di Padang Pasir" - gedung apartemen bertingkat tanah liat' },
  'KZ': { name: 'Menara Monumen Baiterek', type: 'monas', height: 0.070, description: 'Menara pohon kehidupan bermahkotakan bola emas raksasa di Astana' },
  'UZ': { name: 'Madrasah Registan Samarkand', type: 'tajmahal', height: 0.060, description: 'Gerbang ubin mosaik biru pirus di Jalur Sutra legendaris' },
  'TM': { name: 'Monumen Kemerdekaan & Lengkungan Netralitas', type: 'monas', height: 0.065, description: 'Monumen pualam putih berkubah emas di Ashgabat' },
  'KG': { name: 'Menara Burana Kuno Balasagun', type: 'bigben', height: 0.055, description: 'Minaret bata merah kuno peninggalan Kekhanan Karakhanid' },
  'TJ': { name: 'Monumen Emas Ismoil Somoni', type: 'triumphal_arch', height: 0.060, description: 'Lengkungan emas megah peringatan dinasti Samaniyah di Dushanbe' },
  'GE': { name: 'Gereja Trinitas Gergeti Kazbegi', type: 'rock_church', height: 0.065, description: 'Gereja batu berlatar belakang puncak Gunung Kazbek di Kaukasus' },
  'AM': { name: 'Kuil Helenistik Garni & Biara Khor Virap', type: 'parthenon', height: 0.055, description: 'Kuil pilar klasik berlatar pemandangan megah Gunung Ararat' },
  'AZ': { name: 'Menara Api Baku (Flame Towers)', type: 'burj', height: 0.075, description: 'Trio pencakar langit berbentuk kobaran lidah api di Laut Kaspia' },
  'CY': { name: 'Kastel Abad Pertengahan Kolossi', type: 'castle', height: 0.050, description: 'Benteng pertahanan batu ksatria Perang Salib di Limassol' },

  // ===================== EROPA (44 Negara) =====================
  'FR': { name: 'Menara Eiffel Paris', type: 'eiffel', height: 0.085, description: 'Menara kisi besi tempa ikonik di Champ de Mars, Paris' },
  'GB': { name: 'Menara Jam Big Ben & Tower Bridge', type: 'bigben', height: 0.075, description: 'Elizabeth Tower neogotik dan jembatan hidrolik Sungai Thames, London' },
  'IT': { name: 'Colosseum Roma & Menara Pisa', type: 'colosseum', height: 0.050, description: 'Amfiteater batu elips Romawi dan menara lonceng miring marmer' },
  'DE': { name: 'Gerbang Brandenburg & Kastel Neuschwanstein', type: 'brandenburg', height: 0.055, description: 'Monumen kemenangan neoklasik di Berlin dan kastel dongeng Bavaria' },
  'ES': { name: 'Basílica de la Sagrada Família & Alhambra', type: 'sagrada', height: 0.080, description: 'Mahakarya arsitektur gotik Antoni Gaudí di Barcelona dan istana Moor' },
  'PT': { name: 'Torre de Belém & Istana Pena', type: 'castle', height: 0.055, description: 'Menara benteng maritim manuelin di tepi Sungai Tagus, Lisboa' },
  'NL': { name: 'Kincir Angin Zaanse Schans', type: 'windmills', height: 0.055, description: 'Kincir angin bersejarah tepi kanal air di Zaanstad' },
  'BE': { name: 'Monumen Atomium & Grand-Place', type: 'burj', height: 0.065, description: 'Struktur kristal besi raksasa atom dan balai kota megah di Brussel' },
  'CH': { name: 'Puncak Piramida Alpen Matterhorn', type: 'nature_peak', height: 0.070, description: 'Puncak piramida batu bersalju paling ikonik di Pegunungan Alpen' },
  'AT': { name: 'Istana Schönbrunn & Katedral St. Stephen', type: 'brandenburg', height: 0.060, description: 'Istana barok kediaman dinasti Habsburg di Wina' },
  'GR': { name: 'Parthenon Akropolis Athena', type: 'parthenon', height: 0.045, description: 'Kuil pualam berpilar Doria di atas bukit suci Akropolis' },
  'RU': { name: 'Katedral Saint Basil Moskow', type: 'basil', height: 0.070, description: 'Katedral kubah bawang warna-warni semarak di Lapangan Merah' },
  'UA': { name: 'Katedral Santa Sofia & Menara Lavra', type: 'basil', height: 0.065, description: 'Kubah emas permata arsitektur Rus Kiev di Kyiv' },
  'PL': { name: 'Kastel Kerajaan Wawel Krakow', type: 'castle', height: 0.060, description: 'Kompleks kastel kastil berbenteng tempat penobatan raja-raja Polandia' },
  'CZ': { name: 'Jembatan Charles & Kastel Praha', type: 'castle', height: 0.060, description: 'Jembatan batu bersejarah berhias patung suci dan kastel kuno terbesar dunia' },
  'HU': { name: 'Gedung Parlemen Budapest', type: 'bigben', height: 0.065, description: 'Mahakarya neogotik megah di tepi Sungai Donau' },
  'RO': { name: 'Kastel Bran (Kastel Drakula)', type: 'castle', height: 0.060, description: 'Kastel benteng abad pertengahan di perbukitan Transilvania' },
  'BG': { name: 'Katedral Alexander Nevsky Sofia', type: 'basil', height: 0.060, description: 'Katedral ortodoks neo-bizantium berkubah lapis emas' },
  'HR': { name: 'Amfiteater Pula & Tembok Dubrovnik', type: 'colosseum', height: 0.050, description: 'Arena gladiator Romawi paling utuh di semenanjung Istria' },
  'RS': { name: 'Benteng Kalemegdan & Gereja Saint Sava', type: 'castle', height: 0.055, description: 'Benteng pertemuan Sungai Donau dan Sava di Beograd' },
  'BA': { name: 'Jembatan Tua Stari Most Mostar', type: 'triumphal_arch', height: 0.050, description: 'Jembatan lengkung batu peninggalan Ottoman di atas Sungai Neretva' },
  'ME': { name: 'Gereja Pulau Gospa od Škrpjela', type: 'rock_church', height: 0.045, description: 'Gereja di atas pulau buatan di Teluk Kotor' },
  'AL': { name: 'Benteng Kuno Rozafa Shkodër', type: 'castle', height: 0.050, description: 'Benteng Iliria di atas bukit berbatu yang dikelilingi sungai' },
  'MK': { name: 'Jembatan Batu Kuno Skopje', type: 'triumphal_arch', height: 0.045, description: 'Jembatan batu menghubungkan alun-alun dengan kota tua Utsmaniyah' },
  'SI': { name: 'Kastel Danau Bled', type: 'castle', height: 0.055, description: 'Kastel batu di puncak tebing menghadap danau glasial biru zamrud' },
  'SK': { name: 'Kastel Berbenteng Empat Menara Bratislava', type: 'castle', height: 0.055, description: 'Kastel meja terbalik di atas bukit terjal Sungai Donau' },
  'IE': { name: 'Kastel Blarney & Biara Kylemore', type: 'castle', height: 0.055, description: 'Kastel benteng batu legendaris di County Cork' },
  'DK': { name: 'Kastel Kronborg (Hamlet) & Nyhavn', type: 'castle', height: 0.055, description: 'Kastel renaisans di tepi selat Øresund di Helsingør' },
  'SE': { name: 'Balai Kota Tiga Mahkota Stockholm', type: 'bigben', height: 0.065, description: 'Menara bata merah bermahkota tiga emas tempat perjamuan Nobel' },
  'NO': { name: 'Gereja Kayu Bertingkat Borgund Stave', type: 'hallgrim', height: 0.065, description: 'Gereja kayu tiang abad pertengahan dengan ukiran naga Viking' },
  'FI': { name: 'Katedral Putih Helsinki & Suomenlinna', type: 'brandenburg', height: 0.060, description: 'Katedral neoklasik megah berkubah hijau di Lapangan Senat' },
  'IS': { name: 'Gereja Menara Basal Hallgrímskirkja', type: 'hallgrim', height: 0.075, description: 'Menara ekspresionis terinspirasi kolom batu basal vulkanik di Reykjavík' },
  'EE': { name: 'Menara Kuno Balai Kota Tallinn', type: 'castle', height: 0.055, description: 'Kota tua berbenteng peninggalan Liga Hansa di tepi Laut Baltik' },
  'LV': { name: 'Monumen Kemerdekaan Milda Riga', type: 'monas', height: 0.065, description: 'Tugu granit dewi kemerdekaan mengangkat tiga bintang emas' },
  'LT': { name: 'Kastel Bata Merah Pulau Trakai', type: 'castle', height: 0.055, description: 'Satu-satunya kastel pulau di Eropa Timur di tengah Danau Galvė' },
  'BY': { name: 'Kastel Gotik Mir & Benteng Brest', type: 'castle', height: 0.055, description: 'Kompleks kastel bata merah campuran gotik dan renaisans' },
  'MD': { name: 'Benteng Lingkar Soroca Dniester', type: 'castle', height: 0.050, description: 'Benteng batu bulat peninggalan Pangeran Stefan cel Mare' },
  'MT': { name: 'Benteng Santo Elmo Valletta', type: 'castle', height: 0.050, description: 'Benteng bintang batu kapur oranye di semenanjung Pelabuhan Agung' },
  'LU': { name: 'Benteng Casemates du Bock', type: 'castle', height: 0.050, description: 'Jaringan terowongan dan meriam bawah tanah di tebing ngarai' },
  'MC': { name: 'Kasino Monte Carlo & Istana Pangeran', type: 'brandenburg', height: 0.050, description: 'Istana megah Belle Époque di tebing pantai Côte d\'Azur' },
  'AD': { name: 'Gereja Romanesque Sant Joan de Caselles', type: 'rock_church', height: 0.045, description: 'Gereja batu menara lonceng kuno di lembah pegunungan Pirenia' },
  'LI': { name: 'Kastel Bertengger Vaduz Alpen', type: 'castle', height: 0.055, description: 'Kediaman resmi Pangeran Liechtenstein di atas tebing bukit Alpen' },
  'SM': { name: 'Tiga Menara Benteng Guaita San Marino', type: 'castle', height: 0.060, description: 'Tiga menara benteng di atas puncak terjal Gunung Titano' },
  'VA': { name: 'Basilika Santo Petrus Vatikan', type: 'tajmahal', height: 0.070, description: 'Kubah raksasa renaisans karya Michelangelo di Alun-Alun Santo Petrus' },

  // ===================== AMERIKA UTARA & KARIBIA (23 Negara) =====================
  'US': { name: 'Patung Liberty & Empire State', type: 'liberty', height: 0.080, description: 'Patung dewi kemerdekaan perunggu neoklasik di New York' },
  'CA': { name: 'Menara CN Tower & Château Frontenac', type: 'burj', height: 0.085, description: 'Menara komunikasi jarum beton ikonik setinggi 553 meter di Toronto' },
  'MX': { name: 'Piramida Bertingkat El Castillo Chichen Itza', type: 'meso_pyramid', height: 0.060, description: 'Kuil piramida berundak peradaban Maya Kukulcan di Yucatán' },
  'GT': { name: 'Kuil Piramida Tikal I (Kuil Jaguar Besar)', type: 'meso_pyramid', height: 0.065, description: 'Piramida curam batu kapur Maya di tengah hutan belantara Petén' },
  'BZ': { name: 'Kuil Piramida Altun Ha & Great Blue Hole', type: 'meso_pyramid', height: 0.055, description: 'Pusat upacara kuno Maya peninggalan kepala giok Dewa Matahari' },
  'HN': { name: 'Reruntuhan Piramida & Tangga Hieroglif Copán', type: 'meso_pyramid', height: 0.055, description: 'Situs peradaban Maya berukir relief batu paling rumit di dunia' },
  'SV': { name: 'Piramida Tazumal Chalchuapa', type: 'meso_pyramid', height: 0.050, description: 'Piramida kompleks upacara kuno Maya terbesar di El Salvador' },
  'NI': { name: 'Katedral Putih Léon (Katedral Asunción)', type: 'brandenburg', height: 0.055, description: 'Katedral neoklasik terbesar di Amerika Tengah dengan kubah kubah barok' },
  'CR': { name: 'Teatro Nacional de Costa Rica', type: 'brandenburg', height: 0.050, description: 'Gedung teater bersejarah bergaya neoklasik megah di San José' },
  'PA': { name: 'Pintu Gerbang Terusan Panama (Miraflores Locks)', type: 'triumphal_arch', height: 0.050, description: 'Kanal keajaiban teknik maritim penghubung Samudra Atlantik dan Pasifik' },
  'CU': { name: 'Gedung El Capitolio de La Habana', type: 'brandenburg', height: 0.065, description: 'Kubah neoklasik megah pualam putih di pusat kota Havana' },
  'HT': { name: 'Benteng Citadelle Laferrière', type: 'castle', height: 0.060, description: 'Benteng gunung batu raksasa lambang kebebasan di puncak Bonnet à l\'Évêque' },
  'DO': { name: 'Alcázar de Colón Santo Domingo', type: 'castle', height: 0.050, description: 'Istana batu karang kediaman putra Christopher Columbus di Zona Colonial' },
  'JM': { name: 'Rumah Kolonial Bersejarah Rose Hall', type: 'castle', height: 0.050, description: 'Rumah besar perkebunan batu bergaya Georgia di Montego Bay' },
  'BS': { name: 'Menara Air Benteng Fincastle', type: 'bigben', height: 0.055, description: 'Menara benteng batu kapur peninggalan abad ke-18 di Nassau' },
  'TT': { name: 'Kastel Stollmeyer (Killarney)', type: 'castle', height: 0.050, description: 'Kastel gaya Skotlandia di Magnificent Seven Port of Spain' },
  'BB': { name: 'Gedung Parlemen Bersejarah Bridgetown', type: 'bigben', height: 0.055, description: 'Menara jam neogotik batu karang di ibu kota Barbados' },
  'LC': { name: 'Puncak Kembar Gunung Api Pitons', type: 'nature_peak', height: 0.070, description: 'Dua kubah lava vulkanik Gros Piton dan Petit Piton menjulang dari laut' },
  'VC': { name: 'Benteng Batu Kolonial Fort Charlotte', type: 'castle', height: 0.050, description: 'Benteng meriam di atas punggung bukit menghadap pelabuhan Kingstown' },
  'GD': { name: 'Benteng Sejarah Fort George', type: 'castle', height: 0.050, description: 'Benteng pertahanan Prancis abad ke-18 di atas pelabuhan St. George\'s' },
  'AG': { name: 'Galangan Kapal Bersejarah Nelson\'s Dockyard', type: 'monument', height: 0.045, description: 'Pelabuhan angkatan laut era Georgia di Teluk English Harbour' },
  'KN': { name: 'Benteng Bukit Belerang (Brimstone Hill)', type: 'castle', height: 0.055, description: '"Gibraltar dari Karibia" - benteng batu basal di atas bukit vulkanik' },
  'DM': { name: 'Katedral Kuno Our Lady of Fair Haven Roseau', type: 'rock_church', height: 0.050, description: 'Katedral batu vulkanik hitam gotik di ibu kota Dominika' },

  // ===================== AMERIKA SELATAN (12 Negara) =====================
  'BR': { name: 'Patung Kristus Penebus (Cristo Redentor)', type: 'christ', height: 0.075, description: 'Monumen Kristus dengan tangan merangkul di puncak Gunung Corcovado, Rio' },
  'PE': { name: 'Benteng Kuno Machu Picchu Inka', type: 'inca_citadel', height: 0.055, description: 'Kompleks batu suci peradaban Inka di pegunungan Andes berkabut' },
  'AR': { name: 'Obelisco de Buenos Aires & Casa Rosada', type: 'monas', height: 0.070, description: 'Tugu obelisk monumen nasional di Plaza de la República' },
  'CL': { name: 'Patung Monolit Moai Rapa Nui (Pulau Paskah)', type: 'moai', height: 0.065, description: 'Patung monolit kepala batu vulkanik raksasa berwajah misterius' },
  'CO': { name: 'Benteng San Felipe de Barajas & Las Lajas', type: 'castle', height: 0.055, description: 'Benteng militer terkuat Spanyol di Cartagena dan gereja ngarai' },
  'VE': { name: 'Puncak Air Terjun Tertinggi Salto Ángel (Tepui)', type: 'nature_peak', height: 0.070, description: 'Gunung meja Auyán-tepui dengan air terjun tertinggi di dunia (979 m)' },
  'EC': { name: 'Monumen Garis Khatulistiwa (Mitad del Mundo)', type: 'monas', height: 0.065, description: 'Monumen batu trapesium penanda belahan bumi utara dan selatan di Quito' },
  'BO': { name: 'Gerbang Matahari Kuno Tiwanaku', type: 'inca_citadel', height: 0.050, description: 'Gerbang megalitik batu andesit berukir dewa peradaban pra-Inka' },
  'UY': { name: 'Menara Bersejarah Palacio Salvo Montevideo', type: 'bigben', height: 0.070, description: 'Gedung art deco neogotik bersejarah di Plaza Independencia' },
  'PY': { name: 'Panteón Nacional de los Héroes', type: 'brandenburg', height: 0.055, description: 'Mausoleum berkubah putih peringatan pahlawan bangsa di Asunción' },
  'GY': { name: 'Katedral Kayu Santo George Georgetown', type: 'bigben', height: 0.065, description: 'Salah satu gereja kayu bebas berdiri tertinggi di dunia' },
  'SR': { name: 'Katedral Kayu Basilika Santo Petrus dan Paulus', type: 'bigben', height: 0.060, description: 'Struktur kayu terbesar di Amerika Selatan di Paramaribo' },

  // ===================== AFRIKA (54 Negara) =====================
  'EG': { name: 'Piramida Agung Giza & Patung Sphinx', type: 'pyramid', height: 0.055, description: 'Piramida batu kapur raksasa peninggalan Firaun Khufu di padang pasir Kairo' },
  'MA': { name: 'Menara Masjid Hassan II Casablanca', type: 'bigben', height: 0.075, description: 'Minaret tertinggi di dunia dengan laser penunjuk Makkah tepi Samudra Atlantik' },
  'ZA': { name: 'Puncak Meja Table Mountain Cape Town', type: 'nature_peak', height: 0.065, description: 'Punggung gunung tebing datar yang menghadap Samudra Atlantik dan Hindia' },
  'DZ': { name: 'Monumen Martir Maqam Echahid Aljir', type: 'monas', height: 0.070, description: 'Monumen tiga daun palem beton raksasa kemerdekaan Aljazair' },
  'TN': { name: 'Amfiteater Romawi Megah El Jem', type: 'colosseum', height: 0.055, description: 'Amfiteater batu Romawi terbesar ketiga di dunia di tepi padang zaitun' },
  'LY': { name: 'Teater Romawi Leptis Magna', type: 'colosseum', height: 0.050, description: 'Reruntuhan kota marmer Romawi paling megah di Mediterania' },
  'SD': { name: 'Piramida Nubia Meroë Kerajaan Kush', type: 'pyramid', height: 0.055, description: 'Piramida bersudut curam pemakaman raja-raja nubia di padang pasir Sudan' },
  'ET': { name: 'Gereja Batu Salib Monolit Lalibela', type: 'rock_church', height: 0.055, description: 'Bete Giyorgis - gereja salib yang dipahat utuh ke dalam tanah batu vulkanik' },
  'KE': { name: 'Menara KICC & Benteng Fort Jesus Mombasa', type: 'burj', height: 0.070, description: 'Menara helipad ikonik di Nairobi dan benteng Portugis abad ke-16' },
  'TZ': { name: 'Puncak Salju Gunung Kilimanjaro', type: 'nature_peak', height: 0.075, description: 'Atap Afrika - gunung berdiri bebas tertinggi di muka bumi (5.895 m)' },
  'UG': { name: 'Makam Kubah Jerami Kasubi', type: 'adobe_mosque', height: 0.050, description: 'Makam kerajaan Buganda beratap jerami melengkung tradisional di Kampala' },
  'RW': { name: 'Istana Keraton Tradisional Raja Nyanza', type: 'adobe_mosque', height: 0.050, description: 'Pondok istana kubah jerami raksasa tempat bertengger raja Tutsi' },
  'BI': { name: 'Batu Monumen Pertemuan Livingstone-Stanley', type: 'monument', height: 0.045, description: 'Batu memorial pertemuan bersejarah penjelajah di Mugere Danau Tanganyika' },
  'NA': { name: 'Bukit Pasir Raksasa Sossusvlei & Deadvlei', type: 'nature_peak', height: 0.065, description: 'Gundukan pasir merah tertinggi di dunia di Gurun Namib' },
  'BW': { name: 'Bukit Suci Lukisan Batu Tsodilo', type: 'inca_citadel', height: 0.050, description: '"Louvre dari Padang Pasir" - ribuan lukisan batu purba suku San Kalahari' },
  'BF': { name: 'Monumen Pahlawan & Masjid Bobo-Dioulasso', type: 'adobe_mosque', height: 0.060, description: 'Monumen pahlawan kebangsaan Ouagadougou dan masjid arsitektur tanah liat peninggalan abad ke-19 di Bobo-Dioulasso' },
  'ZW': { name: 'Reruntuhan Batu Zimbabwe Raya (Great Zimbabwe)', type: 'castle', height: 0.055, description: 'Tembok batu melingkar tanpa semen peradaban Shona abad pertengahan' },
  'ZM': { name: 'Monumen Air Terjun Victoria (Mosi-oa-Tunya)', type: 'nature_peak', height: 0.065, description: '"Asap yang Bergemuruh" - tirai air terjun terbesar di muka bumi' },
  'MZ': { name: 'Benteng Fortaleza de São Sebastião', type: 'castle', height: 0.050, description: 'Benteng tertua yang masih berdiri kokoh di Pulau Mozambik' },
  'MG': { name: 'Lorong Pohon Purba Baobab (Avenue of the Baobabs)', type: 'nature_peak', height: 0.060, description: 'Deretan pohon baobab raksasa berusia ratusan tahun di Menabe' },
  'AO': { name: 'Benteng Kolonial Fortaleza de São Miguel', type: 'castle', height: 0.050, description: 'Benteng pertahanan bukit menghadap teluk Luanda' },
  'CD': { name: 'Menara Monumen Pahlawan Nasional Kinshasa', type: 'monas', height: 0.065, description: 'Monumen obelisk beton memorial Patrice Lumumba di Limete' },
  'CG': { name: 'Basilika Sainte-Anne du Congo', type: 'brandenburg', height: 0.055, description: 'Gereja unik dengan atap genteng keramik hijau zamrud di Brazzaville' },
  'CM': { name: 'Monumen Reuniifikasi Yaoundé', type: 'monas', height: 0.060, description: 'Dua silinder spiral berlilitan melambangkan persatuan Kamerun' },
  'GA': { name: 'Gereja Kolom Kayu Santo Mikael Nkembo', type: 'rock_church', height: 0.050, description: 'Gereja dengan tiang kayu berukir cerita Alkitab oleh pemahat buta di Libreville' },
  'GQ': { name: 'Katedral Neogotik Santa Isabel Malabo', type: 'bigben', height: 0.055, description: 'Katedral batu neogotik Spanyol di Pulau Bioko' },
  'CF': { name: 'Katedral Bata Merah Notre-Dame Bangui', type: 'bigben', height: 0.050, description: 'Katedral bata merah bergaya Prancis di tepi Sungai Oubangui' },
  'TD': { name: 'Formasi Tebing Jurang Guelta d\'Archei', type: 'nature_peak', height: 0.060, description: 'Ngarai batu pasir dramatis habitat buaya Sahara di Dataran Tinggi Ennedi' },
  'NE': { name: 'Menara Tanah Liat Masjid Agung Agadez', type: 'adobe_mosque', height: 0.065, description: 'Menara tanah liat tertinggi di dunia (27 meter) di gerbang Gurun Sahara' },
  'NG': { name: 'Monolit Raksasa Zuma Rock Abuja', type: 'nature_peak', height: 0.065, description: 'Monolit granit raksasa setinggi 725 meter berwajah manusia alami' },
  'BJ': { name: 'Pintu Gerbang Tanpa Kembali (Porte du Non-Retour)', type: 'triumphal_arch', height: 0.050, description: 'Monumen lengkungan memorial di pantai Ouidah' },
  'TG': { name: 'Benteng Tanah Liat Bertingkat Tata Somba', type: 'adobe_mosque', height: 0.050, description: 'Rumah kastel benteng tradisional dua lantai suku Batammariba di Koutammakou' },
  'GH': { name: 'Kastel Cape Coast & Benteng Elmina', type: 'castle', height: 0.055, description: 'Benteng kastel batu putih bersejarah di tepi Pantai Emas' },
  'CI': { name: 'Basilika Bunda Perdamaian Yamoussoukro', type: 'tajmahal', height: 0.075, description: 'Gereja kubah terbesar di dunia melampaui Basilika Santo Petrus' },
  'LR': { name: 'Paviliun Memorial Centennial Monrovia', type: 'brandenburg', height: 0.050, description: 'Paviliun neoklasik peringatan seabad kemerdekaan Liberia' },
  'SL': { name: 'Pohon Kapuk Bersejarah Cotton Tree Freetown', type: 'monument', height: 0.050, description: 'Pohon raksasa lambang kebebasan para budak di pusat ibu kota' },
  'GN': { name: 'Masjid Agung Conakry', type: 'tajmahal', height: 0.060, description: 'Salah satu masjid terbesar di Afrika Sub-Sahara berkubah hijau' },
  'GW': { name: 'Benteng Bersejarah Fortaleza de São José d\'Amura', type: 'castle', height: 0.045, description: 'Benteng pertahanan abad ke-17 di Bissau Velho' },
  'GM': { name: 'Lengkungan Kemenangan Arch 22 Banjul', type: 'triumphal_arch', height: 0.060, description: 'Gerbang lengkung monumental setinggi 35 meter di pintu masuk Banjul' },
  'SN': { name: 'Patung Perunggu Monumen Renaisans Afrika', type: 'christ', height: 0.075, description: 'Patung perunggu tertinggi di Afrika (49 meter) di atas bukit Dakar' },
  'ML': { name: 'Masjid Agung Djenné Tanah Liat', type: 'adobe_mosque', height: 0.065, description: 'Bangunan lumpur tanah liat terbesar di dunia dengan balok kayu toron' },
  'MR': { name: 'Menara Masjid Batu Kuno Chinguetti', type: 'bigben', height: 0.055, description: 'Kota perpustakaan pasir Jalur Karavan Trans-Sahara' },
  'SO': { name: 'Mercusuar Batu Kuno Mogadishu', type: 'bigben', height: 0.050, description: 'Menara suar bersejarah menghadap Samudra Hindia di Tanduk Afrika' },
  'DJ': { name: 'Istana Kepresidenan Teluk Tadjoura', type: 'brandenburg', height: 0.050, description: 'Arsitektur neoklasik tepi pantai di pertemuan Laut Merah' },
  'ER': { name: 'Katedral Asmara Bergaya Art Deco Italia', type: 'bigben', height: 0.055, description: 'Kota arsitektur modernis futuris dunia di dataran tinggi Tanduk Afrika' },
  'SS': { name: 'Mausoleum Pahlawan John Garang Juba', type: 'monument', height: 0.050, description: 'Monumen memorial pahlawan kemerdekaan Sudan Selatan' },
  'KM': { name: 'Masjid Jumat Bersejarah Moroni', type: 'tajmahal', height: 0.050, description: 'Masjid batu putih berlatar belakang Gunung Berapi Karthala di Kepulauan Komoro' },
  'SC': { name: 'Menara Jam Little Ben Victoria', type: 'bigben', height: 0.050, description: 'Replika perak menara jam London di ibu kota terkecil di dunia di Mahé' },
  'MU': { name: 'Benteng Fort Adelaide (La Citadelle)', type: 'castle', height: 0.050, description: 'Benteng batu basal bukit menghadap pelabuhan Port Louis' },
  'CV': { name: 'Benteng Forte Real de São Filipe', type: 'castle', height: 0.050, description: 'Benteng batu di atas kota kolonial pertama Eropa di daerah tropis' },
  'ST': { name: 'Benteng Fortaleza de São Sebastião', type: 'castle', height: 0.050, description: 'Museum maritim dan benteng peninggalan Portugis di Ponta de São Sebastião' },
  'SZ': { name: 'Cagar Lembah Ezulwini (Lembah Surga)', type: 'nature_peak', height: 0.055, description: 'Lembah permata budaya Eswatini di bawah Puncak Sheba\'s Breasts' },
  'LS': { name: 'Gunung Dataran Tinggi Kerajaan Thaba Bosiu', type: 'nature_peak', height: 0.060, description: 'Dataran tinggi benteng alami Raja Moshoeshoe I di Kerajaan Langit' },
  'MW': { name: 'Misi Livingstonia Tebing Danau Malawi', type: 'castle', height: 0.050, description: 'Permukiman batu bersejarah di dataran tinggi Khondowe' },

  // ===================== OSEANIA (14 Negara) =====================
  'AU': { name: 'Sydney Opera House', type: 'operahouse', height: 0.055, description: 'Mahakarya arsitektur atap layar cangkang di pelabuhan Sydney' },
  'NZ': { name: 'Menara Sky Tower Auckland', type: 'burj', height: 0.080, description: 'Menara observasi menjulang setinggi 328 meter di Selandia Baru' },
  'PG': { name: 'Gedung Parlemen Tradisional Haus Tambaran', type: 'pagoda', height: 0.065, description: 'Arsitektur rumah roh Maprik beratap segitiga raksasa di Port Moresby' },
  'FJ': { name: 'Kuil Hindu Sri Siva Subramaniya Nadi', type: 'pagoda', height: 0.055, description: 'Kuil dravida bertingkat warna-warni terbesar di Belahan Bumi Selatan' },
  'SB': { name: 'Monumen Perdamaian Perang Guadalcanal', type: 'monas', height: 0.050, description: 'Monumen obelisk memorial pendaratan Pasifik di Skyline Ridge Honiara' },
  'VU': { name: 'Menara Kayu Naghol (Land Diving)', type: 'bigben', height: 0.055, description: 'Menara kayu tradisi lompat gantung suku Sa di Pulau Pentakosta' },
  'WS': { name: 'Fale Tradisional Raksasa Faleata', type: 'adobe_mosque', height: 0.050, description: 'Rumah pertemuan adat Polinesia kubah kayu tanpa dinding di Apia' },
  'TO': { name: 'Triliton Megalit Ha\'amonga \'a Maui', type: 'parthenon', height: 0.045, description: '"Stonehenge Pasifik" - pintu gerbang batu karang seberat 40 ton di Heketā' },
  'KI': { name: 'Maneaba Tradisional Terbesar Tarawa', type: 'adobe_mosque', height: 0.045, description: 'Pusat musyawarah beratap daun kelapa pilar batu karang di Kiribati' },
  'TV': { name: 'Paviliun Fale Kaupule Funafuti', type: 'monument', height: 0.040, description: 'Balai rakyat pertemuan adat tradisional di atol terpencil Tuvalu' },
  'NR': { name: 'Tebing Puncak Karang Anibare', type: 'nature_peak', height: 0.050, description: 'Formasi batu kapur karang puncak dramatis di Pulau Nauru' },
  'PW': { name: 'Rumah Musyawarah Adat Bai Airai', type: 'pagoda', height: 0.050, description: 'Balai kayu berukir motif mitologi Palau berusia dua abad' },
  'FM': { name: 'Kota Batu Megalitik Nan Madol Pohnpei', type: 'inca_citadel', height: 0.050, description: '"Venesia dari Pasifik" - reruntuhan kota kanal pulau batu basal kuno' },
  'MH': { name: 'Monumen Perdamaian Majuro Atoll', type: 'monument', height: 0.045, description: 'Monumen memorial perdamaian di atol cincin karang Samudra Pasifik' },
};

/**
 * Mengambil informasi landmark untuk suatu negara berdasarkan kode 2 huruf.
 * Jika tidak ditemukan (misal kode baru), mengembalikan Monumen Pahlawan Nasional berdesain perunggu.
 */
export function getCountryLandmark(countryCode: string, countryName?: string): LandmarkInfo {
  const code = countryCode.toUpperCase();
  if (COUNTRY_LANDMARKS[code]) {
    return COUNTRY_LANDMARKS[code];
  }

  return {
    name: `Monumen Kebangsaan ${countryName || code}`,
    type: 'monument',
    height: 0.048,
    description: `Monumen peringatan kehormatan dan warisan budaya untuk ${countryName || code}`,
  };
}
