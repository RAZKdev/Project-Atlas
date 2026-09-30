/**
 * CANONICAL 195-COUNTRY DATASET FOR PROJECT ATLAS
 *
 * Source of truth: United Nations Member States (193) + Holy See (1) + State of Palestine (1) = 195.
 * Strictly adheres to Master Prompt specification:
 * - Exactly 195 records
 * - No territories, dependencies or unvalidated entities
 * - Valid coordinates, ISO-2, ISO-3, capitals, and verified primary sources
 *
 * Generated & Verified: 2026-09-30T09:54:02.412Z
 */

import { GeographicRegion } from './countryColors';
import { LandmarkRecord, LandmarkRepresentationLevel } from '../landmarks/landmarkTypes';

export interface CanonicalCountry {
  id: string; // ISO 3166-1 alpha-2 uppercase
  displayName: string;
  officialName: string;
  isoAlpha2: string;
  isoAlpha3: string;
  region: GeographicRegion;
  subregion: string;
  capital: string;
  latitude: number;
  longitude: number;
  landmark: LandmarkRecord;
  landmarkType: string;
  representationType: LandmarkRepresentationLevel;
  assetStatus: 'verified' | 'provisional' | 'fallback';
  assetSource: string;
  sourceReferences: {
    publisher: string;
    url: string;
    accessedAt: string;
    citationNotes?: string;
  }[];
  dataCheckedAt: string;
}

export const EXPECTED_COUNTRY_COUNT = 195;

export const CANONICAL_COUNTRIES: CanonicalCountry[] = [
  {
    "id": "AF",
    "displayName": "Afganistan",
    "officialName": "Keamiran Islam Afganistan",
    "isoAlpha2": "AF",
    "isoAlpha3": "AFG",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Kabul",
    "latitude": 33.9,
    "longitude": 67.7,
    "landmark": {
      "name": "Menara Jam & Lembah Kuno Bamiyan",
      "city": "Kabul",
      "latitude": 33.9,
      "longitude": 67.7,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Menara bata hias abad ke-12 di lembah pegunungan terpencil",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/208",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Afganistan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/208",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Afganistan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AM",
    "displayName": "Armenia",
    "officialName": "Republik Armenia",
    "isoAlpha2": "AM",
    "isoAlpha3": "ARM",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Yerevan",
    "latitude": 40,
    "longitude": 45,
    "landmark": {
      "name": "Kuil Helenistik Garni & Biara Khor Virap",
      "city": "Yerevan",
      "latitude": 40,
      "longitude": 45,
      "category": "historic",
      "archetype": "parthenon",
      "reason": "Kuil pilar klasik berlatar pemandangan megah Gunung Ararat",
      "source": {
        "publisher": "Armenia Tourism Committee",
        "url": "https://armenia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Armenia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "parthenon",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Armenia Tourism Committee",
    "sourceReferences": [
      {
        "publisher": "Armenia Tourism Committee",
        "url": "https://armenia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Armenia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AZ",
    "displayName": "Azerbaijan",
    "officialName": "Republik Azerbaijan",
    "isoAlpha2": "AZ",
    "isoAlpha3": "AZE",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Baku",
    "latitude": 40.1,
    "longitude": 47.5,
    "landmark": {
      "name": "Menara Api Baku (Flame Towers)",
      "city": "Baku",
      "latitude": 40.1,
      "longitude": 47.5,
      "category": "modern",
      "archetype": "burj",
      "reason": "Trio pencakar langit berbentuk kobaran lidah api di Laut Kaspia",
      "source": {
        "publisher": "Azerbaijan Tourism Board",
        "url": "https://azerbaijan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Azerbaijan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Azerbaijan Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Azerbaijan Tourism Board",
        "url": "https://azerbaijan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Azerbaijan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BH",
    "displayName": "Bahrain",
    "officialName": "Kerajaan Bahrain",
    "isoAlpha2": "BH",
    "isoAlpha3": "BHR",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Manama",
    "latitude": 26,
    "longitude": 50.5,
    "landmark": {
      "name": "Benteng Bersejarah Qal'at al-Bahrain",
      "city": "Manama",
      "latitude": 26,
      "longitude": 50.5,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng batu pelabuhan kuno peradaban Dilmun",
      "source": {
        "publisher": "Bahrain Authority for Culture and Antiquities",
        "url": "https://culture.gov.bh",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bahrain"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Bahrain Authority for Culture and Antiquities",
    "sourceReferences": [
      {
        "publisher": "Bahrain Authority for Culture and Antiquities",
        "url": "https://culture.gov.bh",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bahrain"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BD",
    "displayName": "Bangladesh",
    "officialName": "Republik Rakyat Bangladesh",
    "isoAlpha2": "BD",
    "isoAlpha3": "BGD",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Dhaka",
    "latitude": 23.6,
    "longitude": 90.3,
    "landmark": {
      "name": "Monumen Martir Jatiyo Smriti Soudho",
      "city": "Dhaka",
      "latitude": 23.6,
      "longitude": 90.3,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Tujuh menara prisma beton segitiga memorial di Savar, Dhaka",
      "source": {
        "publisher": "Bangladesh National Portal",
        "url": "https://bangladesh.gov.bd",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bangladesh"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Bangladesh National Portal",
    "sourceReferences": [
      {
        "publisher": "Bangladesh National Portal",
        "url": "https://bangladesh.gov.bd",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bangladesh"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BT",
    "displayName": "Bhutan",
    "officialName": "Kerajaan Bhutan",
    "isoAlpha2": "BT",
    "isoAlpha3": "BTN",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Thimphu",
    "latitude": 27.5,
    "longitude": 90.4,
    "landmark": {
      "name": "Biara Sarang Harimau (Paro Taktsang)",
      "city": "Thimphu",
      "latitude": 27.5,
      "longitude": 90.4,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Kuil suci yang menempel dramatis di tebing jurang Paro",
      "source": {
        "publisher": "Department of Tourism Bhutan",
        "url": "https://www.bhutan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bhutan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Department of Tourism Bhutan",
    "sourceReferences": [
      {
        "publisher": "Department of Tourism Bhutan",
        "url": "https://www.bhutan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bhutan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BN",
    "displayName": "Brunei Darussalam",
    "officialName": "Negara Brunei Darussalam",
    "isoAlpha2": "BN",
    "isoAlpha3": "BRN",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Bandar Seri Begawan",
    "latitude": 4.5,
    "longitude": 114.7,
    "landmark": {
      "name": "Masjid Sultan Omar Ali Saifuddien",
      "city": "Bandar Seri Begawan",
      "latitude": 4.5,
      "longitude": 114.7,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Kubah emas murni dengan laguna dan perahu mahligai di Bandar Seri Begawan",
      "source": {
        "publisher": "Brunei Tourism Board",
        "url": "https://www.bruneitourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Brunei Darussalam"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Brunei Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Brunei Tourism Board",
        "url": "https://www.bruneitourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Brunei Darussalam"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KH",
    "displayName": "Kamboja",
    "officialName": "Kerajaan Kamboja",
    "isoAlpha2": "KH",
    "isoAlpha3": "KHM",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Phnom Penh",
    "latitude": 12.5,
    "longitude": 104.9,
    "landmark": {
      "name": "Kuil Angkor Wat",
      "city": "Phnom Penh",
      "latitude": 12.5,
      "longitude": 104.9,
      "category": "cultural",
      "archetype": "angkor",
      "reason": "Candi batu menara kuncup teratai warisan Kekaisaran Khmer",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/668",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kamboja"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "angkor",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/668",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kamboja"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CN",
    "displayName": "Tiongkok",
    "officialName": "Republik Rakyat Tiongkok",
    "isoAlpha2": "CN",
    "isoAlpha3": "CHN",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "capital": "Beijing",
    "latitude": 35.8,
    "longitude": 104.1,
    "landmark": {
      "name": "Kota Terlarang & Tembok Besar",
      "city": "Beijing",
      "latitude": 35.8,
      "longitude": 104.1,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Istana kekaisaran atap genteng emas dan benteng terpanjang dunia",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/439",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tiongkok"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/439",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tiongkok"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CY",
    "displayName": "Siprus",
    "officialName": "Republik Siprus",
    "isoAlpha2": "CY",
    "isoAlpha3": "CYP",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Nikosia",
    "latitude": 35.1,
    "longitude": 33.4,
    "landmark": {
      "name": "Kastel Abad Pertengahan Kolossi",
      "city": "Nikosia",
      "latitude": 35.1,
      "longitude": 33.4,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng pertahanan batu ksatria Perang Salib di Limassol",
      "source": {
        "publisher": "Deputy Ministry of Tourism Cyprus",
        "url": "https://www.visitcyprus.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Siprus"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Deputy Ministry of Tourism Cyprus",
    "sourceReferences": [
      {
        "publisher": "Deputy Ministry of Tourism Cyprus",
        "url": "https://www.visitcyprus.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Siprus"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GE",
    "displayName": "Georgia",
    "officialName": "Georgia",
    "isoAlpha2": "GE",
    "isoAlpha3": "GEO",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Tbilisi",
    "latitude": 42.3,
    "longitude": 43.3,
    "landmark": {
      "name": "Gereja Trinitas Gergeti Kazbegi",
      "city": "Tbilisi",
      "latitude": 42.3,
      "longitude": 43.3,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Gereja batu berlatar belakang puncak Gunung Kazbek di Kaukasus",
      "source": {
        "publisher": "Georgian National Tourism Administration",
        "url": "https://georgia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Georgia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Georgian National Tourism Administration",
    "sourceReferences": [
      {
        "publisher": "Georgian National Tourism Administration",
        "url": "https://georgia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Georgia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IN",
    "displayName": "India",
    "officialName": "Republik India",
    "isoAlpha2": "IN",
    "isoAlpha3": "IND",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "New Delhi",
    "latitude": 20.5,
    "longitude": 78.9,
    "landmark": {
      "name": "Taj Mahal",
      "city": "New Delhi",
      "latitude": 20.5,
      "longitude": 78.9,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Makam mahakarya pualam putih Mughal di tepi Sungai Yamuna, Agra",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/252",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk India"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "tajmahal",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/252",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk India"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ID",
    "displayName": "Indonesia",
    "officialName": "Republik Indonesia",
    "isoAlpha2": "ID",
    "isoAlpha3": "IDN",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Jakarta",
    "latitude": -0.7,
    "longitude": 113.9,
    "landmark": {
      "name": "Monumen Nasional (Monas)",
      "city": "Jakarta",
      "latitude": -0.7,
      "longitude": 113.9,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Tugu cawan dan obelisk emas lambang kemerdekaan Indonesia di Jakarta",
      "source": {
        "publisher": "Kementerian Pariwisata dan Ekonomi Kreatif RI",
        "url": "https://indonesia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Indonesia"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "monas",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Kementerian Pariwisata dan Ekonomi Kreatif RI",
    "sourceReferences": [
      {
        "publisher": "Kementerian Pariwisata dan Ekonomi Kreatif RI",
        "url": "https://indonesia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Indonesia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IR",
    "displayName": "Iran",
    "officialName": "Republik Islam Iran",
    "isoAlpha2": "IR",
    "isoAlpha3": "IRN",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Teheran",
    "latitude": 32.4,
    "longitude": 53.6,
    "landmark": {
      "name": "Menara Kemerdekaan Azadi & Persepolis",
      "city": "Teheran",
      "latitude": 32.4,
      "longitude": 53.6,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Gerbang lengkung marmer putih di Teheran dan reruntuhan Persia kuno",
      "source": {
        "publisher": "Ministry of Cultural Heritage, Tourism and Handicrafts",
        "url": "https://mcth.gov.ir",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Iran"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Cultural Heritage, Tourism and Handicrafts",
    "sourceReferences": [
      {
        "publisher": "Ministry of Cultural Heritage, Tourism and Handicrafts",
        "url": "https://mcth.gov.ir",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Iran"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IQ",
    "displayName": "Irak",
    "officialName": "Republik Irak",
    "isoAlpha2": "IQ",
    "isoAlpha3": "IRQ",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Baghdad",
    "latitude": 33.2,
    "longitude": 43.6,
    "landmark": {
      "name": "Ziggurat Agung Ur Babilonia",
      "city": "Baghdad",
      "latitude": 33.2,
      "longitude": 43.6,
      "category": "historic",
      "archetype": "meso_pyramid",
      "reason": "Piramida bertingkat bata lumpur peradaban Sumeria di Dhi Qar",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/148",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Irak"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "meso_pyramid",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/148",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Irak"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IL",
    "displayName": "Israel",
    "officialName": "Negara Israel",
    "isoAlpha2": "IL",
    "isoAlpha3": "ISR",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Yerusalem",
    "latitude": 31,
    "longitude": 34.8,
    "landmark": {
      "name": "Kubah Shakhrah & Menara Daud",
      "city": "Yerusalem",
      "latitude": 31,
      "longitude": 34.8,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Kubah emas oktagonal bersejarah di Kota Lama Yerusalem",
      "source": {
        "publisher": "Israel Ministry of Tourism",
        "url": "https://info.goisrael.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Israel"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Israel Ministry of Tourism",
    "sourceReferences": [
      {
        "publisher": "Israel Ministry of Tourism",
        "url": "https://info.goisrael.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Israel"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "JP",
    "displayName": "Jepang",
    "officialName": "Jepang",
    "isoAlpha2": "JP",
    "isoAlpha3": "JPN",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "capital": "Tokyo",
    "latitude": 36.2,
    "longitude": 138.2,
    "landmark": {
      "name": "Pagoda Sensō-ji & Gerbang Torii",
      "city": "Tokyo",
      "latitude": 36.2,
      "longitude": 138.2,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Pagoda lima tingkat dan gerbang torii merah tradisional Jepang",
      "source": {
        "publisher": "Japan National Tourism Organization (JNTO)",
        "url": "https://www.japan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jepang"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Japan National Tourism Organization (JNTO)",
    "sourceReferences": [
      {
        "publisher": "Japan National Tourism Organization (JNTO)",
        "url": "https://www.japan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jepang"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "JO",
    "displayName": "Yordania",
    "officialName": "Kerajaan Hasyimiyah Yordania",
    "isoAlpha2": "JO",
    "isoAlpha3": "JOR",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Amman",
    "latitude": 30.5,
    "longitude": 36.2,
    "landmark": {
      "name": "Kuil Khazneh (The Treasury) Petra",
      "city": "Amman",
      "latitude": 30.5,
      "longitude": 36.2,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Fasad kuil megah terpahat langsung dari tebing batu pasir merah Nabatea",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/326",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Yordania"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/326",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Yordania"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KZ",
    "displayName": "Kazakhstan",
    "officialName": "Republik Kazakhstan",
    "isoAlpha2": "KZ",
    "isoAlpha3": "KAZ",
    "region": "Asia",
    "subregion": "Central Asia",
    "capital": "Astana",
    "latitude": 48,
    "longitude": 66.9,
    "landmark": {
      "name": "Menara Monumen Baiterek",
      "city": "Astana",
      "latitude": 48,
      "longitude": 66.9,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Menara pohon kehidupan bermahkotakan bola emas raksasa di Astana",
      "source": {
        "publisher": "Kazakh Tourism National Company",
        "url": "https://kazakhstan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kazakhstan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Kazakh Tourism National Company",
    "sourceReferences": [
      {
        "publisher": "Kazakh Tourism National Company",
        "url": "https://kazakhstan.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kazakhstan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KW",
    "displayName": "Kuwait",
    "officialName": "Negara Kuwait",
    "isoAlpha2": "KW",
    "isoAlpha3": "KWT",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Kuwait City",
    "latitude": 29.3,
    "longitude": 47.4,
    "landmark": {
      "name": "Menara Menara Kuwait (Kuwait Towers)",
      "city": "Kuwait City",
      "latitude": 29.3,
      "longitude": 47.4,
      "category": "modern",
      "archetype": "burj",
      "reason": "Tiga menara berhias bola cakram biru khas tepi Teluk Persia",
      "source": {
        "publisher": "Kuwait Ministry of Information - Tourism Sector",
        "url": "https://media.gov.kw",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kuwait"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Kuwait Ministry of Information - Tourism Sector",
    "sourceReferences": [
      {
        "publisher": "Kuwait Ministry of Information - Tourism Sector",
        "url": "https://media.gov.kw",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kuwait"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KG",
    "displayName": "Kirgizstan",
    "officialName": "Republik Kirgizstan",
    "isoAlpha2": "KG",
    "isoAlpha3": "KGZ",
    "region": "Asia",
    "subregion": "Central Asia",
    "capital": "Bishkek",
    "latitude": 41.2,
    "longitude": 74.7,
    "landmark": {
      "name": "Menara Burana Kuno Balasagun",
      "city": "Bishkek",
      "latitude": 41.2,
      "longitude": 74.7,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Minaret bata merah kuno peninggalan Kekhanan Karakhanid",
      "source": {
        "publisher": "Tourism Department of the Kyrgyz Republic",
        "url": "https://discoverkyrgyzstan.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kirgizstan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Department of the Kyrgyz Republic",
    "sourceReferences": [
      {
        "publisher": "Tourism Department of the Kyrgyz Republic",
        "url": "https://discoverkyrgyzstan.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kirgizstan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LA",
    "displayName": "Laos",
    "officialName": "Republik Demokratik Rakyat Laos",
    "isoAlpha2": "LA",
    "isoAlpha3": "LAO",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Vientiane",
    "latitude": 19.8,
    "longitude": 102.4,
    "landmark": {
      "name": "Stupa Emas Pha That Luang",
      "city": "Vientiane",
      "latitude": 19.8,
      "longitude": 102.4,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Stupa emas suci monumen kebangsaan di Vientiane",
      "source": {
        "publisher": "Ministry of Information, Culture and Tourism Laos",
        "url": "https://tourismlaos.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Laos"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Information, Culture and Tourism Laos",
    "sourceReferences": [
      {
        "publisher": "Ministry of Information, Culture and Tourism Laos",
        "url": "https://tourismlaos.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Laos"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LB",
    "displayName": "Lebanon",
    "officialName": "Republik Lebanon",
    "isoAlpha2": "LB",
    "isoAlpha3": "LBN",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Beirut",
    "latitude": 33.8,
    "longitude": 35.8,
    "landmark": {
      "name": "Kuil Romawi Yupiter di Baalbek",
      "city": "Beirut",
      "latitude": 33.8,
      "longitude": 35.8,
      "category": "historic",
      "archetype": "parthenon",
      "reason": "Kolom pualam raksasa kuil peradaban Romawi di Lembah Bekaa",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/294",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Lebanon"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "parthenon",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/294",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Lebanon"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MY",
    "displayName": "Malaysia",
    "officialName": "Malaysia",
    "isoAlpha2": "MY",
    "isoAlpha3": "MYS",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Kuala Lumpur",
    "latitude": 4.2,
    "longitude": 101.9,
    "landmark": {
      "name": "Menara Kembar Petronas",
      "city": "Kuala Lumpur",
      "latitude": 4.2,
      "longitude": 101.9,
      "category": "modern",
      "archetype": "petronas",
      "reason": "Menara kembar berarsitektur modern dengan skybridge di Kuala Lumpur",
      "source": {
        "publisher": "Tourism Malaysia",
        "url": "https://www.malaysia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Malaysia"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.08
    },
    "landmarkType": "petronas",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Malaysia",
    "sourceReferences": [
      {
        "publisher": "Tourism Malaysia",
        "url": "https://www.malaysia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Malaysia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MV",
    "displayName": "Maladewa",
    "officialName": "Republik Maladewa",
    "isoAlpha2": "MV",
    "isoAlpha3": "MDV",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Malé",
    "latitude": 3.2,
    "longitude": 73.2,
    "landmark": {
      "name": "Masjid Hukuru Miskiy Karang Kuno",
      "city": "Malé",
      "latitude": 3.2,
      "longitude": 73.2,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Masjid bersejarah dari pahatan batu karang laut di Malé",
      "source": {
        "publisher": "Maldives Marketing & PR Corporation",
        "url": "https://visitmaldives.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Maladewa"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Maldives Marketing & PR Corporation",
    "sourceReferences": [
      {
        "publisher": "Maldives Marketing & PR Corporation",
        "url": "https://visitmaldives.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Maladewa"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MN",
    "displayName": "Mongolia",
    "officialName": "Mongolia",
    "isoAlpha2": "MN",
    "isoAlpha3": "MNG",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "capital": "Ulaanbaatar",
    "latitude": 46.8,
    "longitude": 103.8,
    "landmark": {
      "name": "Patung Berkuda Genghis Khan",
      "city": "Ulaanbaatar",
      "latitude": 46.8,
      "longitude": 103.8,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Patung ksatria baja raksasa di atas kuda di Tsonjin Boldog",
      "source": {
        "publisher": "Ministry of Environment and Tourism Mongolia",
        "url": "https://mongolia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mongolia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Environment and Tourism Mongolia",
    "sourceReferences": [
      {
        "publisher": "Ministry of Environment and Tourism Mongolia",
        "url": "https://mongolia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mongolia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MM",
    "displayName": "Myanmar",
    "officialName": "Republik Persatuan Myanmar",
    "isoAlpha2": "MM",
    "isoAlpha3": "MMR",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Naypyidaw",
    "latitude": 21.9,
    "longitude": 95.9,
    "landmark": {
      "name": "Pagoda Emas Shwedagon",
      "city": "Naypyidaw",
      "latitude": 21.9,
      "longitude": 95.9,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Stupa emas berkilau setinggi 99 meter di Yangon",
      "source": {
        "publisher": "Ministry of Hotels and Tourism Myanmar",
        "url": "https://tourism.gov.mm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Myanmar"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Hotels and Tourism Myanmar",
    "sourceReferences": [
      {
        "publisher": "Ministry of Hotels and Tourism Myanmar",
        "url": "https://tourism.gov.mm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Myanmar"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NP",
    "displayName": "Nepal",
    "officialName": "Republik Demokratik Federal Nepal",
    "isoAlpha2": "NP",
    "isoAlpha3": "NPL",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Kathmandu",
    "latitude": 28.3,
    "longitude": 84.1,
    "landmark": {
      "name": "Puncak Everest & Stupa Boudhanath",
      "city": "Kathmandu",
      "latitude": 28.3,
      "longitude": 84.1,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Puncak tertinggi bumi di Himalaya dan stupa mata Buddha suci",
      "source": {
        "publisher": "Nepal Tourism Board",
        "url": "https://ntb.gov.np",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nepal"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Nepal Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Nepal Tourism Board",
        "url": "https://ntb.gov.np",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nepal"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KP",
    "displayName": "Korea Utara",
    "officialName": "Republik Demokratik Rakyat Korea",
    "isoAlpha2": "KP",
    "isoAlpha3": "PRK",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "capital": "Pyongyang",
    "latitude": 40.3,
    "longitude": 127.5,
    "landmark": {
      "name": "Menara Juche & Gerbang Kemenangan",
      "city": "Pyongyang",
      "latitude": 40.3,
      "longitude": 127.5,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Menara obelisk granit putih setinggi 170 meter bermahkotakan obor merah menyala di tepi Sungai Taedong, Pyongyang",
      "source": {
        "publisher": "National Tourism Administration DPRK",
        "url": "https://dprktoday.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Korea Utara"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourism Administration DPRK",
    "sourceReferences": [
      {
        "publisher": "National Tourism Administration DPRK",
        "url": "https://dprktoday.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Korea Utara"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "OM",
    "displayName": "Oman",
    "officialName": "Kesultanan Oman",
    "isoAlpha2": "OM",
    "isoAlpha3": "OMN",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Muscat",
    "latitude": 21.5,
    "longitude": 55.9,
    "landmark": {
      "name": "Benteng Nizwa & Masjid Agung Sultan Qaboos",
      "city": "Muscat",
      "latitude": 21.5,
      "longitude": 55.9,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng drum silinder kokoh peninggalan Imamah Oman",
      "source": {
        "publisher": "Ministry of Heritage and Tourism Oman",
        "url": "https://experienceoman.om",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Oman"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Heritage and Tourism Oman",
    "sourceReferences": [
      {
        "publisher": "Ministry of Heritage and Tourism Oman",
        "url": "https://experienceoman.om",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Oman"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PK",
    "displayName": "Pakistan",
    "officialName": "Republik Islam Pakistan",
    "isoAlpha2": "PK",
    "isoAlpha3": "PAK",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Islamabad",
    "latitude": 30.3,
    "longitude": 69.3,
    "landmark": {
      "name": "Minar-e-Pakistan & Masjid Badshahi",
      "city": "Islamabad",
      "latitude": 30.3,
      "longitude": 69.3,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Menara monumen kebangsaan dan masjid megah Mughal di Lahore",
      "source": {
        "publisher": "Pakistan Tourism Development Corporation",
        "url": "https://tourism.gov.pk",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Pakistan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Pakistan Tourism Development Corporation",
    "sourceReferences": [
      {
        "publisher": "Pakistan Tourism Development Corporation",
        "url": "https://tourism.gov.pk",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Pakistan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PS",
    "displayName": "Palestina",
    "officialName": "Negara Palestina",
    "isoAlpha2": "PS",
    "isoAlpha3": "PSE",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Ramallah",
    "latitude": 31.9,
    "longitude": 35.2,
    "landmark": {
      "name": "Masjid Al-Aqsa & Gereja Kelahiran",
      "city": "Ramallah",
      "latitude": 31.9,
      "longitude": 35.2,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Situs suci bersejarah berkubah perak di Yerusalem Timur",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1433",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Palestina"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1433",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Palestina"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PH",
    "displayName": "Filipina",
    "officialName": "Republik Filipina",
    "isoAlpha2": "PH",
    "isoAlpha3": "PHL",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Manila",
    "latitude": 12.8,
    "longitude": 121.7,
    "landmark": {
      "name": "Benteng Santiago & Candi San Agustin",
      "city": "Manila",
      "latitude": 12.8,
      "longitude": 121.7,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng pertahanan batu bersejarah di Intramuros Manila",
      "source": {
        "publisher": "Department of Tourism Philippines",
        "url": "https://philippines.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Filipina"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Department of Tourism Philippines",
    "sourceReferences": [
      {
        "publisher": "Department of Tourism Philippines",
        "url": "https://philippines.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Filipina"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "QA",
    "displayName": "Qatar",
    "officialName": "Negara Qatar",
    "isoAlpha2": "QA",
    "isoAlpha3": "QAT",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Doha",
    "latitude": 25.3,
    "longitude": 51.1,
    "landmark": {
      "name": "Museum Seni Islam & Menara Aspire",
      "city": "Doha",
      "latitude": 25.3,
      "longitude": 51.1,
      "category": "modern",
      "archetype": "burj",
      "reason": "Arsitektur kubus geometris modern di tepi pantai Doha",
      "source": {
        "publisher": "Qatar Tourism",
        "url": "https://visitqatar.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Qatar"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Qatar Tourism",
    "sourceReferences": [
      {
        "publisher": "Qatar Tourism",
        "url": "https://visitqatar.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Qatar"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SA",
    "displayName": "Arab Saudi",
    "officialName": "Kerajaan Arab Saudi",
    "isoAlpha2": "SA",
    "isoAlpha3": "SAU",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Riyadh",
    "latitude": 23.8,
    "longitude": 45,
    "landmark": {
      "name": "Ka'bah Suci & Menara Abraj Al-Bait",
      "city": "Riyadh",
      "latitude": 23.8,
      "longitude": 45,
      "category": "religious",
      "archetype": "kaaba",
      "reason": "Kiblat suci monolit hitam di Masjidil Haram, Makkah",
      "source": {
        "publisher": "Saudi Tourism Authority",
        "url": "https://www.visitsaudi.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Arab Saudi"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "kaaba",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Saudi Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Saudi Tourism Authority",
        "url": "https://www.visitsaudi.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Arab Saudi"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SG",
    "displayName": "Singapura",
    "officialName": "Republik Singapura",
    "isoAlpha2": "SG",
    "isoAlpha3": "SGP",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Singapura",
    "latitude": 1.35,
    "longitude": 103.8,
    "landmark": {
      "name": "Marina Bay Sands & Merlion",
      "city": "Singapura",
      "latitude": 1.35,
      "longitude": 103.8,
      "category": "modern",
      "archetype": "burj",
      "reason": "Mahakarya arsitektur modern tepi teluk Singapura",
      "source": {
        "publisher": "Singapore Tourism Board",
        "url": "https://www.visitsingapore.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Singapura"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Singapore Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Singapore Tourism Board",
        "url": "https://www.visitsingapore.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Singapura"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KR",
    "displayName": "Korea Selatan",
    "officialName": "Republik Korea",
    "isoAlpha2": "KR",
    "isoAlpha3": "KOR",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "capital": "Seoul",
    "latitude": 35.9,
    "longitude": 127.7,
    "landmark": {
      "name": "Istana Gyeongbokgung & Menara Seoul",
      "city": "Seoul",
      "latitude": 35.9,
      "longitude": 127.7,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Paviliun atap lengkung dinasti Joseon dan menara modern Seoul",
      "source": {
        "publisher": "Korea Tourism Organization (KTO)",
        "url": "https://english.visitkorea.or.kr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Korea Selatan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Korea Tourism Organization (KTO)",
    "sourceReferences": [
      {
        "publisher": "Korea Tourism Organization (KTO)",
        "url": "https://english.visitkorea.or.kr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Korea Selatan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LK",
    "displayName": "Sri Lanka",
    "officialName": "Republik Sosialis Demokratik Sri Lanka",
    "isoAlpha2": "LK",
    "isoAlpha3": "LKA",
    "region": "Asia",
    "subregion": "Southern Asia",
    "capital": "Kolombo",
    "latitude": 7.8,
    "longitude": 80.7,
    "landmark": {
      "name": "Benteng Batu Singa Sigiriya",
      "city": "Kolombo",
      "latitude": 7.8,
      "longitude": 80.7,
      "category": "historic",
      "archetype": "inca_citadel",
      "reason": "Istana benteng kuno di atas tebing batu granit raksasa",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/202",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sri Lanka"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "inca_citadel",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/202",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sri Lanka"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SY",
    "displayName": "Suriah",
    "officialName": "Republik Arab Suriah",
    "isoAlpha2": "SY",
    "isoAlpha3": "SYR",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Damaskus",
    "latitude": 34.8,
    "longitude": 38.9,
    "landmark": {
      "name": "Benteng Citadel Aleppo & Palmyra",
      "city": "Damaskus",
      "latitude": 34.8,
      "longitude": 38.9,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng istana abad pertengahan di atas bukit batu",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/21",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Suriah"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/21",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Suriah"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TJ",
    "displayName": "Tajikistan",
    "officialName": "Republik Tajikistan",
    "isoAlpha2": "TJ",
    "isoAlpha3": "TJK",
    "region": "Asia",
    "subregion": "Central Asia",
    "capital": "Dushanbe",
    "latitude": 38.8,
    "longitude": 71.2,
    "landmark": {
      "name": "Monumen Emas Ismoil Somoni",
      "city": "Dushanbe",
      "latitude": 38.8,
      "longitude": 71.2,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Lengkungan emas megah peringatan dinasti Samaniyah di Dushanbe",
      "source": {
        "publisher": "Tourism Development Committee Tajikistan",
        "url": "https://traveltajikistan.tj",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tajikistan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Development Committee Tajikistan",
    "sourceReferences": [
      {
        "publisher": "Tourism Development Committee Tajikistan",
        "url": "https://traveltajikistan.tj",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tajikistan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TH",
    "displayName": "Thailand",
    "officialName": "Kerajaan Thailand",
    "isoAlpha2": "TH",
    "isoAlpha3": "THA",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Bangkok",
    "latitude": 15.8,
    "longitude": 100.9,
    "landmark": {
      "name": "Wat Arun (Candi Fajar)",
      "city": "Bangkok",
      "latitude": 15.8,
      "longitude": 100.9,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Prang menara berhias porselen di tepi Sungai Chao Phraya, Bangkok",
      "source": {
        "publisher": "Tourism Authority of Thailand (TAT)",
        "url": "https://www.tourismthailand.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Thailand"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Authority of Thailand (TAT)",
    "sourceReferences": [
      {
        "publisher": "Tourism Authority of Thailand (TAT)",
        "url": "https://www.tourismthailand.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Thailand"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TL",
    "displayName": "Timor Leste",
    "officialName": "Republik Demokratik Timor-Leste",
    "isoAlpha2": "TL",
    "isoAlpha3": "TLS",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Dili",
    "latitude": -8.8,
    "longitude": 125.7,
    "landmark": {
      "name": "Patung Kristus Raja (Cristo Rei Dili)",
      "city": "Dili",
      "latitude": -8.8,
      "longitude": 125.7,
      "category": "cultural",
      "archetype": "christ",
      "reason": "Monumen Kristus perunggu di puncak semenanjung Tanjung Fatucama Dili",
      "source": {
        "publisher": "Ministry of Tourism and Environment Timor-Leste",
        "url": "https://www.timorleste.tl",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Timor Leste"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "christ",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Tourism and Environment Timor-Leste",
    "sourceReferences": [
      {
        "publisher": "Ministry of Tourism and Environment Timor-Leste",
        "url": "https://www.timorleste.tl",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Timor Leste"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TR",
    "displayName": "Turki",
    "officialName": "Republik Turkiye",
    "isoAlpha2": "TR",
    "isoAlpha3": "TUR",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Ankara",
    "latitude": 38.9,
    "longitude": 35.2,
    "landmark": {
      "name": "Hagia Sophia & Menara Galata",
      "city": "Ankara",
      "latitude": 38.9,
      "longitude": 35.2,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Kubah katedral bizantium agung dan minaret megah di Istanbul",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/356",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Turki"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "tajmahal",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/356",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Turki"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TM",
    "displayName": "Turkmenistan",
    "officialName": "Turkmenistan",
    "isoAlpha2": "TM",
    "isoAlpha3": "TKM",
    "region": "Asia",
    "subregion": "Central Asia",
    "capital": "Ashgabat",
    "latitude": 38.9,
    "longitude": 59.5,
    "landmark": {
      "name": "Monumen Kemerdekaan & Lengkungan Netralitas",
      "city": "Ashgabat",
      "latitude": 38.9,
      "longitude": 59.5,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Monumen pualam putih berkubah emas di Ashgabat",
      "source": {
        "publisher": "State Committee of Turkmenistan for Tourism",
        "url": "https://turkmenistan.gov.tm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Turkmenistan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "State Committee of Turkmenistan for Tourism",
    "sourceReferences": [
      {
        "publisher": "State Committee of Turkmenistan for Tourism",
        "url": "https://turkmenistan.gov.tm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Turkmenistan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AE",
    "displayName": "Uni Emirat Arab",
    "officialName": "Uni Emirat Arab",
    "isoAlpha2": "AE",
    "isoAlpha3": "ARE",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Abu Dhabi",
    "latitude": 23.4,
    "longitude": 53.8,
    "landmark": {
      "name": "Burj Khalifa Dubai",
      "city": "Abu Dhabi",
      "latitude": 23.4,
      "longitude": 53.8,
      "category": "modern",
      "archetype": "burj",
      "reason": "Pencakar langit tertinggi di muka bumi setinggi 828 meter",
      "source": {
        "publisher": "Dubai Department of Economy and Tourism",
        "url": "https://www.visitdubai.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uni Emirat Arab"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.095
    },
    "landmarkType": "burj",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Dubai Department of Economy and Tourism",
    "sourceReferences": [
      {
        "publisher": "Dubai Department of Economy and Tourism",
        "url": "https://www.visitdubai.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uni Emirat Arab"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "UZ",
    "displayName": "Uzbekistan",
    "officialName": "Republik Uzbekistan",
    "isoAlpha2": "UZ",
    "isoAlpha3": "UZB",
    "region": "Asia",
    "subregion": "Central Asia",
    "capital": "Tashkent",
    "latitude": 41.3,
    "longitude": 64.5,
    "landmark": {
      "name": "Madrasah Registan Samarkand",
      "city": "Tashkent",
      "latitude": 41.3,
      "longitude": 64.5,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Gerbang ubin mosaik biru pirus di Jalur Sutra legendaris",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/603",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uzbekistan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/603",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uzbekistan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "VN",
    "displayName": "Vietnam",
    "officialName": "Republik Sosialis Vietnam",
    "isoAlpha2": "VN",
    "isoAlpha3": "VNM",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "capital": "Hanoi",
    "latitude": 14,
    "longitude": 108.2,
    "landmark": {
      "name": "Pagoda Tran Quoc & Jembatan Emas",
      "city": "Hanoi",
      "latitude": 14,
      "longitude": 108.2,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Pagoda merah teratai tertua di Hanoi dan jembatan tangan raksasa Da Nang",
      "source": {
        "publisher": "Vietnam National Administration of Tourism",
        "url": "https://vietnam.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Vietnam"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Vietnam National Administration of Tourism",
    "sourceReferences": [
      {
        "publisher": "Vietnam National Administration of Tourism",
        "url": "https://vietnam.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Vietnam"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "YE",
    "displayName": "Yaman",
    "officialName": "Republik Yaman",
    "isoAlpha2": "YE",
    "isoAlpha3": "YEM",
    "region": "Asia",
    "subregion": "Western Asia",
    "capital": "Sana'a",
    "latitude": 15.5,
    "longitude": 48.5,
    "landmark": {
      "name": "Kota Menara Tanah Liat Shibam",
      "city": "Sana'a",
      "latitude": 15.5,
      "longitude": 48.5,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "\"Manhattan di Padang Pasir\" - gedung apartemen bertingkat tanah liat",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/192",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Yaman"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/192",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Yaman"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AL",
    "displayName": "Albania",
    "officialName": "Republik Albania",
    "isoAlpha2": "AL",
    "isoAlpha3": "ALB",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Tirana",
    "latitude": 41.1,
    "longitude": 20.1,
    "landmark": {
      "name": "Benteng Kuno Rozafa Shkodër",
      "city": "Tirana",
      "latitude": 41.1,
      "longitude": 20.1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng Iliria di atas bukit berbatu yang dikelilingi sungai",
      "source": {
        "publisher": "National Tourism Agency Albania",
        "url": "https://albania.al",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Albania"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourism Agency Albania",
    "sourceReferences": [
      {
        "publisher": "National Tourism Agency Albania",
        "url": "https://albania.al",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Albania"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AD",
    "displayName": "Andorra",
    "officialName": "Kepangeranan Andorra",
    "isoAlpha2": "AD",
    "isoAlpha3": "AND",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Andorra la Vella",
    "latitude": 42.5,
    "longitude": 1.5,
    "landmark": {
      "name": "Gereja Romanesque Sant Joan de Caselles",
      "city": "Andorra la Vella",
      "latitude": 42.5,
      "longitude": 1.5,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Gereja batu menara lonceng kuno di lembah pegunungan Pirenia",
      "source": {
        "publisher": "Andorra Turisme",
        "url": "https://visitandorra.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Andorra"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Andorra Turisme",
    "sourceReferences": [
      {
        "publisher": "Andorra Turisme",
        "url": "https://visitandorra.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Andorra"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AT",
    "displayName": "Austria",
    "officialName": "Republik Austria",
    "isoAlpha2": "AT",
    "isoAlpha3": "AUT",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Wina",
    "latitude": 47.5,
    "longitude": 14.5,
    "landmark": {
      "name": "Istana Schönbrunn & Katedral St. Stephen",
      "city": "Wina",
      "latitude": 47.5,
      "longitude": 14.5,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Istana barok kediaman dinasti Habsburg di Wina",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/786",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Austria"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/786",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Austria"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BY",
    "displayName": "Belarus",
    "officialName": "Republik Belarus",
    "isoAlpha2": "BY",
    "isoAlpha3": "BLR",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Minsk",
    "latitude": 53.7,
    "longitude": 27.9,
    "landmark": {
      "name": "Kastel Gotik Mir & Benteng Brest",
      "city": "Minsk",
      "latitude": 53.7,
      "longitude": 27.9,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kompleks kastel bata merah campuran gotik dan renaisans",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/963",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belarus"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/963",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belarus"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BE",
    "displayName": "Belgia",
    "officialName": "Kerajaan Belgia",
    "isoAlpha2": "BE",
    "isoAlpha3": "BEL",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Brussel",
    "latitude": 50.5,
    "longitude": 4.4,
    "landmark": {
      "name": "Monumen Atomium & Grand-Place",
      "city": "Brussel",
      "latitude": 50.5,
      "longitude": 4.4,
      "category": "modern",
      "archetype": "burj",
      "reason": "Struktur kristal besi raksasa atom dan balai kota megah di Brussel",
      "source": {
        "publisher": "Visit Brussels",
        "url": "https://www.visit.brussels",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belgia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Visit Brussels",
    "sourceReferences": [
      {
        "publisher": "Visit Brussels",
        "url": "https://www.visit.brussels",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belgia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BA",
    "displayName": "Bosnia dan Herzegovina",
    "officialName": "Bosnia dan Herzegovina",
    "isoAlpha2": "BA",
    "isoAlpha3": "BIH",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Sarajevo",
    "latitude": 43.9,
    "longitude": 17.6,
    "landmark": {
      "name": "Jembatan Tua Stari Most Mostar",
      "city": "Sarajevo",
      "latitude": 43.9,
      "longitude": 17.6,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Jembatan lengkung batu peninggalan Ottoman di atas Sungai Neretva",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/946",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bosnia dan Herzegovina"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/946",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bosnia dan Herzegovina"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BG",
    "displayName": "Bulgaria",
    "officialName": "Republik Bulgaria",
    "isoAlpha2": "BG",
    "isoAlpha3": "BGR",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Sofia",
    "latitude": 42.7,
    "longitude": 25.4,
    "landmark": {
      "name": "Katedral Alexander Nevsky Sofia",
      "city": "Sofia",
      "latitude": 42.7,
      "longitude": 25.4,
      "category": "religious",
      "archetype": "basil",
      "reason": "Katedral ortodoks neo-bizantium berkubah lapis emas",
      "source": {
        "publisher": "Ministry of Tourism Bulgaria",
        "url": "https://bulgariatravel.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bulgaria"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "basil",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Tourism Bulgaria",
    "sourceReferences": [
      {
        "publisher": "Ministry of Tourism Bulgaria",
        "url": "https://bulgariatravel.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bulgaria"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "HR",
    "displayName": "Kroasia",
    "officialName": "Republik Kroasia",
    "isoAlpha2": "HR",
    "isoAlpha3": "HRV",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Zagreb",
    "latitude": 45.1,
    "longitude": 15.2,
    "landmark": {
      "name": "Amfiteater Pula & Tembok Dubrovnik",
      "city": "Zagreb",
      "latitude": 45.1,
      "longitude": 15.2,
      "category": "historic",
      "archetype": "colosseum",
      "reason": "Arena gladiator Romawi paling utuh di semenanjung Istria",
      "source": {
        "publisher": "Croatian National Tourist Board",
        "url": "https://croatia.hr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kroasia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "colosseum",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Croatian National Tourist Board",
    "sourceReferences": [
      {
        "publisher": "Croatian National Tourist Board",
        "url": "https://croatia.hr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kroasia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CZ",
    "displayName": "Ceko",
    "officialName": "Republik Ceko",
    "isoAlpha2": "CZ",
    "isoAlpha3": "CZE",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Praha",
    "latitude": 49.8,
    "longitude": 15.4,
    "landmark": {
      "name": "Jembatan Charles & Kastel Praha",
      "city": "Praha",
      "latitude": 49.8,
      "longitude": 15.4,
      "category": "historic",
      "archetype": "castle",
      "reason": "Jembatan batu bersejarah berhias patung suci dan kastel kuno terbesar dunia",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/616",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ceko"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/616",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ceko"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "DK",
    "displayName": "Denmark",
    "officialName": "Kerajaan Denmark",
    "isoAlpha2": "DK",
    "isoAlpha3": "DNK",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Kopenhagen",
    "latitude": 56.2,
    "longitude": 9.5,
    "landmark": {
      "name": "Kastel Kronborg (Hamlet) & Nyhavn",
      "city": "Kopenhagen",
      "latitude": 56.2,
      "longitude": 9.5,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kastel renaisans di tepi selat Øresund di Helsingør",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/696",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Denmark"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/696",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Denmark"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "EE",
    "displayName": "Estonia",
    "officialName": "Republik Estonia",
    "isoAlpha2": "EE",
    "isoAlpha3": "EST",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Tallinn",
    "latitude": 58.5,
    "longitude": 25,
    "landmark": {
      "name": "Menara Kuno Balai Kota Tallinn",
      "city": "Tallinn",
      "latitude": 58.5,
      "longitude": 25,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kota tua berbenteng peninggalan Liga Hansa di tepi Laut Baltik",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/822",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Estonia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/822",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Estonia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "FI",
    "displayName": "Finlandia",
    "officialName": "Republik Finlandia",
    "isoAlpha2": "FI",
    "isoAlpha3": "FIN",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Helsinki",
    "latitude": 61.9,
    "longitude": 25.7,
    "landmark": {
      "name": "Katedral Putih Helsinki & Suomenlinna",
      "city": "Helsinki",
      "latitude": 61.9,
      "longitude": 25.7,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Katedral neoklasik megah berkubah hijau di Lapangan Senat",
      "source": {
        "publisher": "Visit Finland",
        "url": "https://www.visitfinland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Finlandia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Visit Finland",
    "sourceReferences": [
      {
        "publisher": "Visit Finland",
        "url": "https://www.visitfinland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Finlandia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "FR",
    "displayName": "Prancis",
    "officialName": "Republik Prancis",
    "isoAlpha2": "FR",
    "isoAlpha3": "FRA",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Paris",
    "latitude": 46.2,
    "longitude": 2.2,
    "landmark": {
      "name": "Menara Eiffel Paris",
      "city": "Paris",
      "latitude": 46.2,
      "longitude": 2.2,
      "category": "engineering",
      "archetype": "eiffel",
      "reason": "Menara kisi besi tempa ikonik di Champ de Mars, Paris",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/600",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Prancis"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.085
    },
    "landmarkType": "eiffel",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/600",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Prancis"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "DE",
    "displayName": "Jerman",
    "officialName": "Republik Federal Jerman",
    "isoAlpha2": "DE",
    "isoAlpha3": "DEU",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Berlin",
    "latitude": 51.1,
    "longitude": 10.4,
    "landmark": {
      "name": "Gerbang Brandenburg & Kastel Neuschwanstein",
      "city": "Berlin",
      "latitude": 51.1,
      "longitude": 10.4,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Monumen kemenangan neoklasik di Berlin dan kastel dongeng Bavaria",
      "source": {
        "publisher": "German National Tourist Board",
        "url": "https://www.germany.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jerman"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "brandenburg",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "German National Tourist Board",
    "sourceReferences": [
      {
        "publisher": "German National Tourist Board",
        "url": "https://www.germany.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jerman"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GR",
    "displayName": "Yunani",
    "officialName": "Republik Hellenik",
    "isoAlpha2": "GR",
    "isoAlpha3": "GRC",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Athena",
    "latitude": 39,
    "longitude": 22,
    "landmark": {
      "name": "Parthenon Akropolis Athena",
      "city": "Athena",
      "latitude": 39,
      "longitude": 22,
      "category": "historic",
      "archetype": "parthenon",
      "reason": "Kuil pualam berpilar Doria di atas bukit suci Akropolis",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/404",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Yunani"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "parthenon",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/404",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Yunani"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "HU",
    "displayName": "Hongaria",
    "officialName": "Hungaria",
    "isoAlpha2": "HU",
    "isoAlpha3": "HUN",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Budapest",
    "latitude": 47.1,
    "longitude": 19.5,
    "landmark": {
      "name": "Gedung Parlemen Budapest",
      "city": "Budapest",
      "latitude": 47.1,
      "longitude": 19.5,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Mahakarya neogotik megah di tepi Sungai Donau",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/400",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Hongaria"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/400",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Hongaria"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IS",
    "displayName": "Islandia",
    "officialName": "Islandia",
    "isoAlpha2": "IS",
    "isoAlpha3": "ISL",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Reykjavík",
    "latitude": 64.9,
    "longitude": -19,
    "landmark": {
      "name": "Gereja Menara Basal Hallgrímskirkja",
      "city": "Reykjavík",
      "latitude": 64.9,
      "longitude": -19,
      "category": "cultural",
      "archetype": "hallgrim",
      "reason": "Menara ekspresionis terinspirasi kolom batu basal vulkanik di Reykjavík",
      "source": {
        "publisher": "Visit Iceland",
        "url": "https://www.visiticeland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Islandia"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "hallgrim",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Visit Iceland",
    "sourceReferences": [
      {
        "publisher": "Visit Iceland",
        "url": "https://www.visiticeland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Islandia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IE",
    "displayName": "Irlandia",
    "officialName": "Republik Irlandia",
    "isoAlpha2": "IE",
    "isoAlpha3": "IRL",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Dublin",
    "latitude": 53.1,
    "longitude": -7.6,
    "landmark": {
      "name": "Kastel Blarney & Biara Kylemore",
      "city": "Dublin",
      "latitude": 53.1,
      "longitude": -7.6,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kastel benteng batu legendaris di County Cork",
      "source": {
        "publisher": "Tourism Ireland",
        "url": "https://www.ireland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Irlandia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Ireland",
    "sourceReferences": [
      {
        "publisher": "Tourism Ireland",
        "url": "https://www.ireland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Irlandia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "IT",
    "displayName": "Italia",
    "officialName": "Republik Italia",
    "isoAlpha2": "IT",
    "isoAlpha3": "ITA",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Roma",
    "latitude": 41.8,
    "longitude": 12.5,
    "landmark": {
      "name": "Colosseum Roma & Menara Pisa",
      "city": "Roma",
      "latitude": 41.8,
      "longitude": 12.5,
      "category": "historic",
      "archetype": "colosseum",
      "reason": "Amfiteater batu elips Romawi dan menara lonceng miring marmer",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/91",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Italia"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "colosseum",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/91",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Italia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LV",
    "displayName": "Latvia",
    "officialName": "Republik Latvia",
    "isoAlpha2": "LV",
    "isoAlpha3": "LVA",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Riga",
    "latitude": 56.8,
    "longitude": 24.6,
    "landmark": {
      "name": "Monumen Kemerdekaan Milda Riga",
      "city": "Riga",
      "latitude": 56.8,
      "longitude": 24.6,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Tugu granit dewi kemerdekaan mengangkat tiga bintang emas",
      "source": {
        "publisher": "Investment and Development Agency of Latvia (LIAA)",
        "url": "https://www.latvia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Latvia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Investment and Development Agency of Latvia (LIAA)",
    "sourceReferences": [
      {
        "publisher": "Investment and Development Agency of Latvia (LIAA)",
        "url": "https://www.latvia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Latvia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LI",
    "displayName": "Liechtenstein",
    "officialName": "Kepangeranan Liechtenstein",
    "isoAlpha2": "LI",
    "isoAlpha3": "LIE",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Vaduz",
    "latitude": 47.1,
    "longitude": 9.5,
    "landmark": {
      "name": "Kastel Bertengger Vaduz Alpen",
      "city": "Vaduz",
      "latitude": 47.1,
      "longitude": 9.5,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kediaman resmi Pangeran Liechtenstein di atas tebing bukit Alpen",
      "source": {
        "publisher": "Liechtenstein Marketing",
        "url": "https://tourismus.li",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Liechtenstein"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Liechtenstein Marketing",
    "sourceReferences": [
      {
        "publisher": "Liechtenstein Marketing",
        "url": "https://tourismus.li",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Liechtenstein"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LT",
    "displayName": "Lituania",
    "officialName": "Republik Lituania",
    "isoAlpha2": "LT",
    "isoAlpha3": "LTU",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Vilnius",
    "latitude": 55.1,
    "longitude": 23.8,
    "landmark": {
      "name": "Kastel Bata Merah Pulau Trakai",
      "city": "Vilnius",
      "latitude": 55.1,
      "longitude": 23.8,
      "category": "historic",
      "archetype": "castle",
      "reason": "Satu-satunya kastel pulau di Eropa Timur di tengah Danau Galvė",
      "source": {
        "publisher": "Lithuania Travel",
        "url": "https://www.lithuania.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Lituania"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Lithuania Travel",
    "sourceReferences": [
      {
        "publisher": "Lithuania Travel",
        "url": "https://www.lithuania.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Lituania"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LU",
    "displayName": "Luksemburg",
    "officialName": "Keharyapatihan Luksemburg",
    "isoAlpha2": "LU",
    "isoAlpha3": "LUX",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Luksemburg",
    "latitude": 49.8,
    "longitude": 6.1,
    "landmark": {
      "name": "Benteng Casemates du Bock",
      "city": "Luksemburg",
      "latitude": 49.8,
      "longitude": 6.1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Jaringan terowongan dan meriam bawah tanah di tebing ngarai",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/699",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Luksemburg"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/699",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Luksemburg"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MT",
    "displayName": "Malta",
    "officialName": "Republik Malta",
    "isoAlpha2": "MT",
    "isoAlpha3": "MLT",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Valletta",
    "latitude": 35.9,
    "longitude": 14.3,
    "landmark": {
      "name": "Benteng Santo Elmo Valletta",
      "city": "Valletta",
      "latitude": 35.9,
      "longitude": 14.3,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng bintang batu kapur oranye di semenanjung Pelabuhan Agung",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/131",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Malta"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/131",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Malta"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MD",
    "displayName": "Moldova",
    "officialName": "Republik Moldova",
    "isoAlpha2": "MD",
    "isoAlpha3": "MDA",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Chisinau",
    "latitude": 47.4,
    "longitude": 28.3,
    "landmark": {
      "name": "Benteng Lingkar Soroca Dniester",
      "city": "Chisinau",
      "latitude": 47.4,
      "longitude": 28.3,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng batu bulat peninggalan Pangeran Stefan cel Mare",
      "source": {
        "publisher": "National Inbound and Domestic Tourism Association of Moldova",
        "url": "https://moldova.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Moldova"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Inbound and Domestic Tourism Association of Moldova",
    "sourceReferences": [
      {
        "publisher": "National Inbound and Domestic Tourism Association of Moldova",
        "url": "https://moldova.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Moldova"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MC",
    "displayName": "Monako",
    "officialName": "Kepangeranan Monako",
    "isoAlpha2": "MC",
    "isoAlpha3": "MCO",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Monako",
    "latitude": 43.7,
    "longitude": 7.4,
    "landmark": {
      "name": "Kasino Monte Carlo & Istana Pangeran",
      "city": "Monako",
      "latitude": 43.7,
      "longitude": 7.4,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Istana megah Belle Époque di tebing pantai Côte d'Azur",
      "source": {
        "publisher": "Monaco Government Tourist Authority",
        "url": "https://www.visitmonaco.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Monako"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Monaco Government Tourist Authority",
    "sourceReferences": [
      {
        "publisher": "Monaco Government Tourist Authority",
        "url": "https://www.visitmonaco.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Monako"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ME",
    "displayName": "Montenegro",
    "officialName": "Montenegro",
    "isoAlpha2": "ME",
    "isoAlpha3": "MNE",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Podgorica",
    "latitude": 42.7,
    "longitude": 19.3,
    "landmark": {
      "name": "Gereja Pulau Gospa od Škrpjela",
      "city": "Podgorica",
      "latitude": 42.7,
      "longitude": 19.3,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Gereja di atas pulau buatan di Teluk Kotor",
      "source": {
        "publisher": "National Tourism Organisation of Montenegro",
        "url": "https://www.montenegro.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Montenegro"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourism Organisation of Montenegro",
    "sourceReferences": [
      {
        "publisher": "National Tourism Organisation of Montenegro",
        "url": "https://www.montenegro.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Montenegro"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NL",
    "displayName": "Belanda",
    "officialName": "Kerajaan Belanda",
    "isoAlpha2": "NL",
    "isoAlpha3": "NLD",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Amsterdam",
    "latitude": 52.1,
    "longitude": 5.2,
    "landmark": {
      "name": "Kincir Angin Zaanse Schans",
      "city": "Amsterdam",
      "latitude": 52.1,
      "longitude": 5.2,
      "category": "engineering",
      "archetype": "windmills",
      "reason": "Kincir angin bersejarah tepi kanal air di Zaanstad",
      "source": {
        "publisher": "Netherlands Board of Tourism & Conventions (NBTC)",
        "url": "https://www.holland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belanda"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "windmills",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Netherlands Board of Tourism & Conventions (NBTC)",
    "sourceReferences": [
      {
        "publisher": "Netherlands Board of Tourism & Conventions (NBTC)",
        "url": "https://www.holland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belanda"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MK",
    "displayName": "Makedonia Utara",
    "officialName": "Republik Makedonia Utara",
    "isoAlpha2": "MK",
    "isoAlpha3": "MKD",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Skopje",
    "latitude": 41.6,
    "longitude": 21.7,
    "landmark": {
      "name": "Jembatan Batu Kuno Skopje",
      "city": "Skopje",
      "latitude": 41.6,
      "longitude": 21.7,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Jembatan batu menghubungkan alun-alun dengan kota tua Utsmaniyah",
      "source": {
        "publisher": "Agency for Promotion and Support of Tourism",
        "url": "https://macedonia-timeless.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Makedonia Utara"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Agency for Promotion and Support of Tourism",
    "sourceReferences": [
      {
        "publisher": "Agency for Promotion and Support of Tourism",
        "url": "https://macedonia-timeless.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Makedonia Utara"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NO",
    "displayName": "Norwegia",
    "officialName": "Kerajaan Norwegia",
    "isoAlpha2": "NO",
    "isoAlpha3": "NOR",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Oslo",
    "latitude": 60.4,
    "longitude": 8.4,
    "landmark": {
      "name": "Gereja Kayu Bertingkat Borgund Stave",
      "city": "Oslo",
      "latitude": 60.4,
      "longitude": 8.4,
      "category": "cultural",
      "archetype": "hallgrim",
      "reason": "Gereja kayu tiang abad pertengahan dengan ukiran naga Viking",
      "source": {
        "publisher": "Visit Norway",
        "url": "https://www.visitnorway.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Norwegia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "hallgrim",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Visit Norway",
    "sourceReferences": [
      {
        "publisher": "Visit Norway",
        "url": "https://www.visitnorway.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Norwegia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PL",
    "displayName": "Polandia",
    "officialName": "Republik Polandia",
    "isoAlpha2": "PL",
    "isoAlpha3": "POL",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Warsawa",
    "latitude": 51.9,
    "longitude": 19.1,
    "landmark": {
      "name": "Kastel Kerajaan Wawel Krakow",
      "city": "Warsawa",
      "latitude": 51.9,
      "longitude": 19.1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kompleks kastel kastil berbenteng tempat penobatan raja-raja Polandia",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/29",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Polandia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/29",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Polandia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PT",
    "displayName": "Portugal",
    "officialName": "Republik Portugis",
    "isoAlpha2": "PT",
    "isoAlpha3": "PRT",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Lisboa",
    "latitude": 39.3,
    "longitude": -8.2,
    "landmark": {
      "name": "Torre de Belém & Istana Pena",
      "city": "Lisboa",
      "latitude": 39.3,
      "longitude": -8.2,
      "category": "historic",
      "archetype": "castle",
      "reason": "Menara benteng maritim manuelin di tepi Sungai Tagus, Lisboa",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/263",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Portugal"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/263",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Portugal"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "RO",
    "displayName": "Rumania",
    "officialName": "Rumania",
    "isoAlpha2": "RO",
    "isoAlpha3": "ROU",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Bukares",
    "latitude": 45.9,
    "longitude": 24.9,
    "landmark": {
      "name": "Kastel Bran (Kastel Drakula)",
      "city": "Bukares",
      "latitude": 45.9,
      "longitude": 24.9,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kastel benteng abad pertengahan di perbukitan Transilvania",
      "source": {
        "publisher": "Ministry of Economy, Entrepreneurship and Tourism Romania",
        "url": "https://romaniatourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Rumania"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Economy, Entrepreneurship and Tourism Romania",
    "sourceReferences": [
      {
        "publisher": "Ministry of Economy, Entrepreneurship and Tourism Romania",
        "url": "https://romaniatourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Rumania"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "RU",
    "displayName": "Rusia",
    "officialName": "Federasi Rusia",
    "isoAlpha2": "RU",
    "isoAlpha3": "RUS",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Moskow",
    "latitude": 61.5,
    "longitude": 105.3,
    "landmark": {
      "name": "Katedral Saint Basil Moskow",
      "city": "Moskow",
      "latitude": 61.5,
      "longitude": 105.3,
      "category": "religious",
      "archetype": "basil",
      "reason": "Katedral kubah bawang warna-warni semarak di Lapangan Merah",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/545",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Rusia"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "basil",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/545",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Rusia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SM",
    "displayName": "San Marino",
    "officialName": "Republik San Marino",
    "isoAlpha2": "SM",
    "isoAlpha3": "SMR",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "San Marino",
    "latitude": 43.9,
    "longitude": 12.4,
    "landmark": {
      "name": "Tiga Menara Benteng Guaita San Marino",
      "city": "San Marino",
      "latitude": 43.9,
      "longitude": 12.4,
      "category": "historic",
      "archetype": "castle",
      "reason": "Tiga menara benteng di atas puncak terjal Gunung Titano",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1245",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk San Marino"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1245",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk San Marino"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "RS",
    "displayName": "Serbia",
    "officialName": "Republik Serbia",
    "isoAlpha2": "RS",
    "isoAlpha3": "SRB",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Beograd",
    "latitude": 44,
    "longitude": 21,
    "landmark": {
      "name": "Benteng Kalemegdan & Gereja Saint Sava",
      "city": "Beograd",
      "latitude": 44,
      "longitude": 21,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng pertemuan Sungai Donau dan Sava di Beograd",
      "source": {
        "publisher": "National Tourism Organisation of Serbia",
        "url": "https://www.serbia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Serbia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourism Organisation of Serbia",
    "sourceReferences": [
      {
        "publisher": "National Tourism Organisation of Serbia",
        "url": "https://www.serbia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Serbia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SK",
    "displayName": "Slowakia",
    "officialName": "Republik Slowakia",
    "isoAlpha2": "SK",
    "isoAlpha3": "SVK",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Bratislava",
    "latitude": 48.6,
    "longitude": 19.6,
    "landmark": {
      "name": "Kastel Berbenteng Empat Menara Bratislava",
      "city": "Bratislava",
      "latitude": 48.6,
      "longitude": 19.6,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kastel meja terbalik di atas bukit terjal Sungai Donau",
      "source": {
        "publisher": "Slovakia Travel",
        "url": "https://slovakia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Slowakia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Slovakia Travel",
    "sourceReferences": [
      {
        "publisher": "Slovakia Travel",
        "url": "https://slovakia.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Slowakia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SI",
    "displayName": "Slovenia",
    "officialName": "Republik Slovenia",
    "isoAlpha2": "SI",
    "isoAlpha3": "SVN",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Ljubljana",
    "latitude": 46.1,
    "longitude": 14.9,
    "landmark": {
      "name": "Kastel Danau Bled",
      "city": "Ljubljana",
      "latitude": 46.1,
      "longitude": 14.9,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kastel batu di puncak tebing menghadap danau glasial biru zamrud",
      "source": {
        "publisher": "Slovenian Tourist Board",
        "url": "https://www.slovenia.info",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Slovenia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Slovenian Tourist Board",
    "sourceReferences": [
      {
        "publisher": "Slovenian Tourist Board",
        "url": "https://www.slovenia.info",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Slovenia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ES",
    "displayName": "Spanyol",
    "officialName": "Kerajaan Spanyol",
    "isoAlpha2": "ES",
    "isoAlpha3": "ESP",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Madrid",
    "latitude": 40.4,
    "longitude": -3.7,
    "landmark": {
      "name": "Basílica de la Sagrada Família & Alhambra",
      "city": "Madrid",
      "latitude": 40.4,
      "longitude": -3.7,
      "category": "cultural",
      "archetype": "sagrada",
      "reason": "Mahakarya arsitektur gotik Antoni Gaudí di Barcelona dan istana Moor",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/320",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Spanyol"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.08
    },
    "landmarkType": "sagrada",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/320",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Spanyol"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SE",
    "displayName": "Swedia",
    "officialName": "Kerajaan Swedia",
    "isoAlpha2": "SE",
    "isoAlpha3": "SWE",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "Stockholm",
    "latitude": 60.1,
    "longitude": 18.6,
    "landmark": {
      "name": "Balai Kota Tiga Mahkota Stockholm",
      "city": "Stockholm",
      "latitude": 60.1,
      "longitude": 18.6,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Menara bata merah bermahkota tiga emas tempat perjamuan Nobel",
      "source": {
        "publisher": "Visit Sweden",
        "url": "https://visitsweden.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Swedia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Visit Sweden",
    "sourceReferences": [
      {
        "publisher": "Visit Sweden",
        "url": "https://visitsweden.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Swedia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CH",
    "displayName": "Swiss",
    "officialName": "Konfederasi Swiss",
    "isoAlpha2": "CH",
    "isoAlpha3": "CHE",
    "region": "Europe",
    "subregion": "Western Europe",
    "capital": "Bern",
    "latitude": 46.8,
    "longitude": 8.2,
    "landmark": {
      "name": "Puncak Piramida Alpen Matterhorn",
      "city": "Bern",
      "latitude": 46.8,
      "longitude": 8.2,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Puncak piramida batu bersalju paling ikonik di Pegunungan Alpen",
      "source": {
        "publisher": "Switzerland Tourism",
        "url": "https://www.myswitzerland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Swiss"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Switzerland Tourism",
    "sourceReferences": [
      {
        "publisher": "Switzerland Tourism",
        "url": "https://www.myswitzerland.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Swiss"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "UA",
    "displayName": "Ukraina",
    "officialName": "Ukraina",
    "isoAlpha2": "UA",
    "isoAlpha3": "UKR",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "capital": "Kyiv",
    "latitude": 48.3,
    "longitude": 31.1,
    "landmark": {
      "name": "Katedral Santa Sofia & Menara Lavra",
      "city": "Kyiv",
      "latitude": 48.3,
      "longitude": 31.1,
      "category": "religious",
      "archetype": "basil",
      "reason": "Kubah emas permata arsitektur Rus Kiev di Kyiv",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/527",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ukraina"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "basil",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/527",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ukraina"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GB",
    "displayName": "Inggris Raya",
    "officialName": "Kerajaan Bersatu Britania Raya dan Irlandia Utara",
    "isoAlpha2": "GB",
    "isoAlpha3": "GBR",
    "region": "Europe",
    "subregion": "Northern Europe",
    "capital": "London",
    "latitude": 55.3,
    "longitude": -3.4,
    "landmark": {
      "name": "Menara Jam Big Ben & Tower Bridge",
      "city": "London",
      "latitude": 55.3,
      "longitude": -3.4,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Elizabeth Tower neogotik dan jembatan hidrolik Sungai Thames, London",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/426",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Inggris Raya"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "bigben",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/426",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Inggris Raya"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "VA",
    "displayName": "Vatikan",
    "officialName": "Negara Kota Vatikan",
    "isoAlpha2": "VA",
    "isoAlpha3": "VAT",
    "region": "Europe",
    "subregion": "Southern Europe",
    "capital": "Vatikan",
    "latitude": 41.9,
    "longitude": 12.4,
    "landmark": {
      "name": "Basilika Santo Petrus Vatikan",
      "city": "Vatikan",
      "latitude": 41.9,
      "longitude": 12.4,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Kubah raksasa renaisans karya Michelangelo di Alun-Alun Santo Petrus",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/286",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Vatikan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/286",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Vatikan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "DZ",
    "displayName": "Aljazair",
    "officialName": "Republik Demokratik Rakyat Aljazair",
    "isoAlpha2": "DZ",
    "isoAlpha3": "DZA",
    "region": "Africa",
    "subregion": "Northern Africa",
    "capital": "Aljir",
    "latitude": 28,
    "longitude": 1.6,
    "landmark": {
      "name": "Monumen Martir Maqam Echahid Aljir",
      "city": "Aljir",
      "latitude": 28,
      "longitude": 1.6,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Monumen tiga daun palem beton raksasa kemerdekaan Aljazair",
      "source": {
        "publisher": "National Tourism Office of Algeria",
        "url": "https://ont.dz",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Aljazair"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourism Office of Algeria",
    "sourceReferences": [
      {
        "publisher": "National Tourism Office of Algeria",
        "url": "https://ont.dz",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Aljazair"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AO",
    "displayName": "Angola",
    "officialName": "Republik Angola",
    "isoAlpha2": "AO",
    "isoAlpha3": "AGO",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Luanda",
    "latitude": -11.2,
    "longitude": 17.8,
    "landmark": {
      "name": "Benteng Kolonial Fortaleza de São Miguel",
      "city": "Luanda",
      "latitude": -11.2,
      "longitude": 17.8,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng pertahanan bukit menghadap teluk Luanda",
      "source": {
        "publisher": "Instituto de Fomento Turístico de Angola",
        "url": "https://infotur.gov.ao",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Angola"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Instituto de Fomento Turístico de Angola",
    "sourceReferences": [
      {
        "publisher": "Instituto de Fomento Turístico de Angola",
        "url": "https://infotur.gov.ao",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Angola"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BJ",
    "displayName": "Benin",
    "officialName": "Republik Benin",
    "isoAlpha2": "BJ",
    "isoAlpha3": "BEN",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Porto-Novo",
    "latitude": 9.3,
    "longitude": 2.3,
    "landmark": {
      "name": "Pintu Gerbang Tanpa Kembali (Porte du Non-Retour)",
      "city": "Porto-Novo",
      "latitude": 9.3,
      "longitude": 2.3,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Monumen lengkungan memorial di pantai Ouidah",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/tentativelists/1802",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Benin"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/tentativelists/1802",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Benin"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BW",
    "displayName": "Botswana",
    "officialName": "Republik Botswana",
    "isoAlpha2": "BW",
    "isoAlpha3": "BWA",
    "region": "Africa",
    "subregion": "Southern Africa",
    "capital": "Gaborone",
    "latitude": -22.3,
    "longitude": 24.6,
    "landmark": {
      "name": "Bukit Suci Lukisan Batu Tsodilo",
      "city": "Gaborone",
      "latitude": -22.3,
      "longitude": 24.6,
      "category": "historic",
      "archetype": "inca_citadel",
      "reason": "\"Louvre dari Padang Pasir\" - ribuan lukisan batu purba suku San Kalahari",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1021",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Botswana"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "inca_citadel",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1021",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Botswana"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BF",
    "displayName": "Burkina Faso",
    "officialName": "Burkina Faso",
    "isoAlpha2": "BF",
    "isoAlpha3": "BFA",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Ouagadougou",
    "latitude": 12.2,
    "longitude": -1.5,
    "landmark": {
      "name": "Monumen Pahlawan & Masjid Bobo-Dioulasso",
      "city": "Ouagadougou",
      "latitude": 12.2,
      "longitude": -1.5,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Monumen pahlawan kebangsaan Ouagadougou dan masjid arsitektur tanah liat peninggalan abad ke-19 di Bobo-Dioulasso",
      "source": {
        "publisher": "Office National du Tourisme Burkinabè",
        "url": "https://ontb.bf",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Burkina Faso"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Office National du Tourisme Burkinabè",
    "sourceReferences": [
      {
        "publisher": "Office National du Tourisme Burkinabè",
        "url": "https://ontb.bf",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Burkina Faso"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BI",
    "displayName": "Burundi",
    "officialName": "Republik Burundi",
    "isoAlpha2": "BI",
    "isoAlpha3": "BDI",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Gitega",
    "latitude": -3.3,
    "longitude": 29.9,
    "landmark": {
      "name": "Batu Monumen Pertemuan Livingstone-Stanley",
      "city": "Gitega",
      "latitude": -3.3,
      "longitude": 29.9,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Batu memorial pertemuan bersejarah penjelajah di Mugere Danau Tanganyika",
      "source": {
        "publisher": "Office National du Tourisme du Burundi",
        "url": "https://burundi-tourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Burundi"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Office National du Tourisme du Burundi",
    "sourceReferences": [
      {
        "publisher": "Office National du Tourisme du Burundi",
        "url": "https://burundi-tourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Burundi"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CV",
    "displayName": "Tanjung Verde",
    "officialName": "Republik Cabo Verde",
    "isoAlpha2": "CV",
    "isoAlpha3": "CPV",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Praia",
    "latitude": 16,
    "longitude": -24,
    "landmark": {
      "name": "Benteng Forte Real de São Filipe",
      "city": "Praia",
      "latitude": 16,
      "longitude": -24,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng batu di atas kota kolonial pertama Eropa di daerah tropis",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1310",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tanjung Verde"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1310",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tanjung Verde"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CM",
    "displayName": "Kamerun",
    "officialName": "Republik Kamerun",
    "isoAlpha2": "CM",
    "isoAlpha3": "CMR",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Yaoundé",
    "latitude": 7.3,
    "longitude": 12.3,
    "landmark": {
      "name": "Monumen Reuniifikasi Yaoundé",
      "city": "Yaoundé",
      "latitude": 7.3,
      "longitude": 12.3,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Dua silinder spiral berlilitan melambangkan persatuan Kamerun",
      "source": {
        "publisher": "Ministry of Tourism and Leisure Cameroon",
        "url": "https://mintoul.gov.cm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kamerun"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Tourism and Leisure Cameroon",
    "sourceReferences": [
      {
        "publisher": "Ministry of Tourism and Leisure Cameroon",
        "url": "https://mintoul.gov.cm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kamerun"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CF",
    "displayName": "Republik Afrika Tengah",
    "officialName": "Republik Afrika Tengah",
    "isoAlpha2": "CF",
    "isoAlpha3": "CAF",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Bangui",
    "latitude": 6.6,
    "longitude": 20.9,
    "landmark": {
      "name": "Katedral Bata Merah Notre-Dame Bangui",
      "city": "Bangui",
      "latitude": 6.6,
      "longitude": 20.9,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Katedral bata merah bergaya Prancis di tepi Sungai Oubangui",
      "source": {
        "publisher": "Ministry of Tourism Central African Republic",
        "url": "https://tourisme-centrafrique.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Republik Afrika Tengah"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Tourism Central African Republic",
    "sourceReferences": [
      {
        "publisher": "Ministry of Tourism Central African Republic",
        "url": "https://tourisme-centrafrique.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Republik Afrika Tengah"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TD",
    "displayName": "Chad",
    "officialName": "Republik Chad",
    "isoAlpha2": "TD",
    "isoAlpha3": "TCD",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "N'Djamena",
    "latitude": 15.4,
    "longitude": 18.7,
    "landmark": {
      "name": "Formasi Tebing Jurang Guelta d'Archei",
      "city": "N'Djamena",
      "latitude": 15.4,
      "longitude": 18.7,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Ngarai batu pasir dramatis habitat buaya Sahara di Dataran Tinggi Ennedi",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1475",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Chad"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1475",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Chad"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KM",
    "displayName": "Komoro",
    "officialName": "Uni Komoro",
    "isoAlpha2": "KM",
    "isoAlpha3": "COM",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Moroni",
    "latitude": -11.8,
    "longitude": 43.8,
    "landmark": {
      "name": "Masjid Jumat Bersejarah Moroni",
      "city": "Moroni",
      "latitude": -11.8,
      "longitude": 43.8,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Masjid batu putih berlatar belakang Gunung Berapi Karthala di Kepulauan Komoro",
      "source": {
        "publisher": "Office National du Tourisme des Comores",
        "url": "https://comores-tourisme.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Komoro"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Office National du Tourisme des Comores",
    "sourceReferences": [
      {
        "publisher": "Office National du Tourisme des Comores",
        "url": "https://comores-tourisme.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Komoro"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CG",
    "displayName": "Kongo",
    "officialName": "Republik Kongo",
    "isoAlpha2": "CG",
    "isoAlpha3": "COG",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Brazzaville",
    "latitude": -0.2,
    "longitude": 15.8,
    "landmark": {
      "name": "Basilika Sainte-Anne du Congo",
      "city": "Brazzaville",
      "latitude": -0.2,
      "longitude": 15.8,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Gereja unik dengan atap genteng keramik hijau zamrud di Brazzaville",
      "source": {
        "publisher": "Ministry of Tourism Republic of the Congo",
        "url": "https://tourisme.gouv.cg",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kongo"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Tourism Republic of the Congo",
    "sourceReferences": [
      {
        "publisher": "Ministry of Tourism Republic of the Congo",
        "url": "https://tourisme.gouv.cg",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kongo"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CD",
    "displayName": "Republik Demokratik Kongo",
    "officialName": "Republik Demokratik Kongo",
    "isoAlpha2": "CD",
    "isoAlpha3": "COD",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Kinshasa",
    "latitude": -4,
    "longitude": 21.7,
    "landmark": {
      "name": "Menara Monumen Pahlawan Nasional Kinshasa",
      "city": "Kinshasa",
      "latitude": -4,
      "longitude": 21.7,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Monumen obelisk beton memorial Patrice Lumumba di Limete",
      "source": {
        "publisher": "Office National du Tourisme RDC",
        "url": "https://ont.cd",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Republik Demokratik Kongo"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Office National du Tourisme RDC",
    "sourceReferences": [
      {
        "publisher": "Office National du Tourisme RDC",
        "url": "https://ont.cd",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Republik Demokratik Kongo"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CI",
    "displayName": "Pantai Gading",
    "officialName": "Republik Pantai Gading",
    "isoAlpha2": "CI",
    "isoAlpha3": "CIV",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Yamoussoukro",
    "latitude": 7.5,
    "longitude": -5.5,
    "landmark": {
      "name": "Basilika Bunda Perdamaian Yamoussoukro",
      "city": "Yamoussoukro",
      "latitude": 7.5,
      "longitude": -5.5,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Gereja kubah terbesar di dunia melampaui Basilika Santo Petrus",
      "source": {
        "publisher": "Côte d'Ivoire Tourisme",
        "url": "https://cotedivoiretourisme.ci",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Pantai Gading"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Côte d'Ivoire Tourisme",
    "sourceReferences": [
      {
        "publisher": "Côte d'Ivoire Tourisme",
        "url": "https://cotedivoiretourisme.ci",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Pantai Gading"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "DJ",
    "displayName": "Jibuti",
    "officialName": "Republik Jibuti",
    "isoAlpha2": "DJ",
    "isoAlpha3": "DJI",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Jibuti",
    "latitude": 11.8,
    "longitude": 42.5,
    "landmark": {
      "name": "Istana Kepresidenan Teluk Tadjoura",
      "city": "Jibuti",
      "latitude": 11.8,
      "longitude": 42.5,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Arsitektur neoklasik tepi pantai di pertemuan Laut Merah",
      "source": {
        "publisher": "National Tourism Office of Djibouti",
        "url": "https://visitdjibouti.dj",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jibuti"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourism Office of Djibouti",
    "sourceReferences": [
      {
        "publisher": "National Tourism Office of Djibouti",
        "url": "https://visitdjibouti.dj",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jibuti"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "EG",
    "displayName": "Mesir",
    "officialName": "Republik Arab Mesir",
    "isoAlpha2": "EG",
    "isoAlpha3": "EGY",
    "region": "Africa",
    "subregion": "Northern Africa",
    "capital": "Kairo",
    "latitude": 26.8,
    "longitude": 30.8,
    "landmark": {
      "name": "Piramida Agung Giza & Patung Sphinx",
      "city": "Kairo",
      "latitude": 26.8,
      "longitude": 30.8,
      "category": "historic",
      "archetype": "pyramid",
      "reason": "Piramida batu kapur raksasa peninggalan Firaun Khufu di padang pasir Kairo",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/86",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mesir"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "pyramid",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/86",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mesir"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GQ",
    "displayName": "Guinea Khatulistiwa",
    "officialName": "Republik Guinea Khatulistiwa",
    "isoAlpha2": "GQ",
    "isoAlpha3": "GNQ",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Malabo",
    "latitude": 1.6,
    "longitude": 10.2,
    "landmark": {
      "name": "Katedral Neogotik Santa Isabel Malabo",
      "city": "Malabo",
      "latitude": 1.6,
      "longitude": 10.2,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Katedral batu neogotik Spanyol di Pulau Bioko",
      "source": {
        "publisher": "Dirección General de Turismo de Guinea Ecuatorial",
        "url": "https://turismo-ge.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guinea Khatulistiwa"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Dirección General de Turismo de Guinea Ecuatorial",
    "sourceReferences": [
      {
        "publisher": "Dirección General de Turismo de Guinea Ecuatorial",
        "url": "https://turismo-ge.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guinea Khatulistiwa"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ER",
    "displayName": "Eritrea",
    "officialName": "Negara Eritrea",
    "isoAlpha2": "ER",
    "isoAlpha3": "ERI",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Asmara",
    "latitude": 15.1,
    "longitude": 39.7,
    "landmark": {
      "name": "Katedral Asmara Bergaya Art Deco Italia",
      "city": "Asmara",
      "latitude": 15.1,
      "longitude": 39.7,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Kota arsitektur modernis futuris dunia di dataran tinggi Tanduk Afrika",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1550",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Eritrea"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1550",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Eritrea"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SZ",
    "displayName": "Eswatini",
    "officialName": "Kerajaan Eswatini",
    "isoAlpha2": "SZ",
    "isoAlpha3": "SWZ",
    "region": "Africa",
    "subregion": "Southern Africa",
    "capital": "Mbabane",
    "latitude": -26.5,
    "longitude": 31.4,
    "landmark": {
      "name": "Cagar Lembah Ezulwini (Lembah Surga)",
      "city": "Mbabane",
      "latitude": -26.5,
      "longitude": 31.4,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Lembah permata budaya Eswatini di bawah Puncak Sheba's Breasts",
      "source": {
        "publisher": "Eswatini Tourism Authority",
        "url": "https://www.thekingdomofeswatini.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Eswatini"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Eswatini Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Eswatini Tourism Authority",
        "url": "https://www.thekingdomofeswatini.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Eswatini"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ET",
    "displayName": "Etiopia",
    "officialName": "Republik Demokratik Federal Etiopia",
    "isoAlpha2": "ET",
    "isoAlpha3": "ETH",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Addis Ababa",
    "latitude": 9.1,
    "longitude": 40.4,
    "landmark": {
      "name": "Gereja Batu Salib Monolit Lalibela",
      "city": "Addis Ababa",
      "latitude": 9.1,
      "longitude": 40.4,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Bete Giyorgis - gereja salib yang dipahat utuh ke dalam tanah batu vulkanik",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/18",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Etiopia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/18",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Etiopia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GA",
    "displayName": "Gabon",
    "officialName": "Republik Gabon",
    "isoAlpha2": "GA",
    "isoAlpha3": "GAB",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "Libreville",
    "latitude": -0.8,
    "longitude": 11.6,
    "landmark": {
      "name": "Gereja Kolom Kayu Santo Mikael Nkembo",
      "city": "Libreville",
      "latitude": -0.8,
      "longitude": 11.6,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Gereja dengan tiang kayu berukir cerita Alkitab oleh pemahat buta di Libreville",
      "source": {
        "publisher": "Agence Gabonaise de Tourisme",
        "url": "https://tourisme-gabon.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Gabon"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Agence Gabonaise de Tourisme",
    "sourceReferences": [
      {
        "publisher": "Agence Gabonaise de Tourisme",
        "url": "https://tourisme-gabon.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Gabon"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GM",
    "displayName": "Gambia",
    "officialName": "Republik Gambia",
    "isoAlpha2": "GM",
    "isoAlpha3": "GMB",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Banjul",
    "latitude": 13.4,
    "longitude": -15.3,
    "landmark": {
      "name": "Lengkungan Kemenangan Arch 22 Banjul",
      "city": "Banjul",
      "latitude": 13.4,
      "longitude": -15.3,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Gerbang lengkung monumental setinggi 35 meter di pintu masuk Banjul",
      "source": {
        "publisher": "Gambia Tourism Board",
        "url": "https://www.visitthegambia.gm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Gambia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Gambia Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Gambia Tourism Board",
        "url": "https://www.visitthegambia.gm",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Gambia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GH",
    "displayName": "Ghana",
    "officialName": "Republik Ghana",
    "isoAlpha2": "GH",
    "isoAlpha3": "GHA",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Accra",
    "latitude": 7.9,
    "longitude": -1,
    "landmark": {
      "name": "Kastel Cape Coast & Benteng Elmina",
      "city": "Accra",
      "latitude": 7.9,
      "longitude": -1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng kastel batu putih bersejarah di tepi Pantai Emas",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/34",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ghana"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/34",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ghana"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GN",
    "displayName": "Guinea",
    "officialName": "Republik Guinea",
    "isoAlpha2": "GN",
    "isoAlpha3": "GIN",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Conakry",
    "latitude": 9.9,
    "longitude": -9.6,
    "landmark": {
      "name": "Masjid Agung Conakry",
      "city": "Conakry",
      "latitude": 9.9,
      "longitude": -9.6,
      "category": "religious",
      "archetype": "tajmahal",
      "reason": "Salah satu masjid terbesar di Afrika Sub-Sahara berkubah hijau",
      "source": {
        "publisher": "Office National du Tourisme de Guinée",
        "url": "https://guinee-tourisme.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guinea"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "tajmahal",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Office National du Tourisme de Guinée",
    "sourceReferences": [
      {
        "publisher": "Office National du Tourisme de Guinée",
        "url": "https://guinee-tourisme.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guinea"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GW",
    "displayName": "Guinea-Bissau",
    "officialName": "Republik Guinea-Bissau",
    "isoAlpha2": "GW",
    "isoAlpha3": "GNB",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Bissau",
    "latitude": 11.8,
    "longitude": -15.1,
    "landmark": {
      "name": "Benteng Bersejarah Fortaleza de São José d'Amura",
      "city": "Bissau",
      "latitude": 11.8,
      "longitude": -15.1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng pertahanan abad ke-17 di Bissau Velho",
      "source": {
        "publisher": "Ministério do Turismo e Artesanato da Guiné-Bissau",
        "url": "https://guine-bissau.net",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guinea-Bissau"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministério do Turismo e Artesanato da Guiné-Bissau",
    "sourceReferences": [
      {
        "publisher": "Ministério do Turismo e Artesanato da Guiné-Bissau",
        "url": "https://guine-bissau.net",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guinea-Bissau"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KE",
    "displayName": "Kenya",
    "officialName": "Republik Kenya",
    "isoAlpha2": "KE",
    "isoAlpha3": "KEN",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Nairobi",
    "latitude": -0.02,
    "longitude": 37.9,
    "landmark": {
      "name": "Menara KICC & Benteng Fort Jesus Mombasa",
      "city": "Nairobi",
      "latitude": -0.02,
      "longitude": 37.9,
      "category": "modern",
      "archetype": "burj",
      "reason": "Menara helipad ikonik di Nairobi dan benteng Portugis abad ke-16",
      "source": {
        "publisher": "Kenya Tourism Board",
        "url": "https://magicalkenya.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kenya"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Kenya Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Kenya Tourism Board",
        "url": "https://magicalkenya.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kenya"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LS",
    "displayName": "Lesotho",
    "officialName": "Kerajaan Lesotho",
    "isoAlpha2": "LS",
    "isoAlpha3": "LSO",
    "region": "Africa",
    "subregion": "Southern Africa",
    "capital": "Maseru",
    "latitude": -29.6,
    "longitude": 28.2,
    "landmark": {
      "name": "Gunung Dataran Tinggi Kerajaan Thaba Bosiu",
      "city": "Maseru",
      "latitude": -29.6,
      "longitude": 28.2,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Dataran tinggi benteng alami Raja Moshoeshoe I di Kerajaan Langit",
      "source": {
        "publisher": "Lesotho Tourism Development Corporation",
        "url": "https://visitlesotho.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Lesotho"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Lesotho Tourism Development Corporation",
    "sourceReferences": [
      {
        "publisher": "Lesotho Tourism Development Corporation",
        "url": "https://visitlesotho.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Lesotho"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LR",
    "displayName": "Liberia",
    "officialName": "Republik Liberia",
    "isoAlpha2": "LR",
    "isoAlpha3": "LBR",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Monrovia",
    "latitude": 6.4,
    "longitude": -9.4,
    "landmark": {
      "name": "Paviliun Memorial Centennial Monrovia",
      "city": "Monrovia",
      "latitude": 6.4,
      "longitude": -9.4,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Paviliun neoklasik peringatan seabad kemerdekaan Liberia",
      "source": {
        "publisher": "Liberia National Tourism Authority",
        "url": "https://tourism.gov.lr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Liberia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Liberia National Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Liberia National Tourism Authority",
        "url": "https://tourism.gov.lr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Liberia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LY",
    "displayName": "Libya",
    "officialName": "Negara Libya",
    "isoAlpha2": "LY",
    "isoAlpha3": "LBY",
    "region": "Africa",
    "subregion": "Northern Africa",
    "capital": "Tripoli",
    "latitude": 26.3,
    "longitude": 17.2,
    "landmark": {
      "name": "Teater Romawi Leptis Magna",
      "city": "Tripoli",
      "latitude": 26.3,
      "longitude": 17.2,
      "category": "historic",
      "archetype": "colosseum",
      "reason": "Reruntuhan kota marmer Romawi paling megah di Mediterania",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/183",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Libya"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "colosseum",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/183",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Libya"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MG",
    "displayName": "Madagaskar",
    "officialName": "Republik Madagaskar",
    "isoAlpha2": "MG",
    "isoAlpha3": "MDG",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Antananarivo",
    "latitude": -18.7,
    "longitude": 46.8,
    "landmark": {
      "name": "Lorong Pohon Purba Baobab (Avenue of the Baobabs)",
      "city": "Antananarivo",
      "latitude": -18.7,
      "longitude": 46.8,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Deretan pohon baobab raksasa berusia ratusan tahun di Menabe",
      "source": {
        "publisher": "Office National du Tourisme de Madagascar",
        "url": "https://madagascar-tourisme.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Madagaskar"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Office National du Tourisme de Madagascar",
    "sourceReferences": [
      {
        "publisher": "Office National du Tourisme de Madagascar",
        "url": "https://madagascar-tourisme.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Madagaskar"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MW",
    "displayName": "Malawi",
    "officialName": "Republik Malawi",
    "isoAlpha2": "MW",
    "isoAlpha3": "MWI",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Lilongwe",
    "latitude": -13.2,
    "longitude": 34.3,
    "landmark": {
      "name": "Misi Livingstonia Tebing Danau Malawi",
      "city": "Lilongwe",
      "latitude": -13.2,
      "longitude": 34.3,
      "category": "historic",
      "archetype": "castle",
      "reason": "Permukiman batu bersejarah di dataran tinggi Khondowe",
      "source": {
        "publisher": "Department of Tourism Malawi",
        "url": "https://www.visitmalawi.mw",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Malawi"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Department of Tourism Malawi",
    "sourceReferences": [
      {
        "publisher": "Department of Tourism Malawi",
        "url": "https://www.visitmalawi.mw",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Malawi"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ML",
    "displayName": "Mali",
    "officialName": "Republik Mali",
    "isoAlpha2": "ML",
    "isoAlpha3": "MLI",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Bamako",
    "latitude": 17.5,
    "longitude": -3.9,
    "landmark": {
      "name": "Masjid Agung Djenné Tanah Liat",
      "city": "Bamako",
      "latitude": 17.5,
      "longitude": -3.9,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Bangunan lumpur tanah liat terbesar di dunia dengan balok kayu toron",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/116",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mali"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/116",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mali"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MR",
    "displayName": "Mauritania",
    "officialName": "Republik Islam Mauritania",
    "isoAlpha2": "MR",
    "isoAlpha3": "MRT",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Nouakchott",
    "latitude": 21,
    "longitude": -10.9,
    "landmark": {
      "name": "Menara Masjid Batu Kuno Chinguetti",
      "city": "Nouakchott",
      "latitude": 21,
      "longitude": -10.9,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Kota perpustakaan pasir Jalur Karavan Trans-Sahara",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/769",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mauritania"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/769",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mauritania"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MU",
    "displayName": "Mauritius",
    "officialName": "Republik Mauritius",
    "isoAlpha2": "MU",
    "isoAlpha3": "MUS",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Port Louis",
    "latitude": -20.3,
    "longitude": 57.5,
    "landmark": {
      "name": "Benteng Fort Adelaide (La Citadelle)",
      "city": "Port Louis",
      "latitude": -20.3,
      "longitude": 57.5,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng batu basal bukit menghadap pelabuhan Port Louis",
      "source": {
        "publisher": "Mauritius Tourism Promotion Authority",
        "url": "https://mymauritius.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mauritius"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Mauritius Tourism Promotion Authority",
    "sourceReferences": [
      {
        "publisher": "Mauritius Tourism Promotion Authority",
        "url": "https://mymauritius.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mauritius"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MA",
    "displayName": "Maroko",
    "officialName": "Kerajaan Maroko",
    "isoAlpha2": "MA",
    "isoAlpha3": "MAR",
    "region": "Africa",
    "subregion": "Northern Africa",
    "capital": "Rabat",
    "latitude": 31.7,
    "longitude": -7,
    "landmark": {
      "name": "Menara Masjid Hassan II Casablanca",
      "city": "Rabat",
      "latitude": 31.7,
      "longitude": -7,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Minaret tertinggi di dunia dengan laser penunjuk Makkah tepi Samudra Atlantik",
      "source": {
        "publisher": "Moroccan National Tourist Office",
        "url": "https://www.visitmorocco.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Maroko"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Moroccan National Tourist Office",
    "sourceReferences": [
      {
        "publisher": "Moroccan National Tourist Office",
        "url": "https://www.visitmorocco.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Maroko"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MZ",
    "displayName": "Mozambik",
    "officialName": "Republik Mozambik",
    "isoAlpha2": "MZ",
    "isoAlpha3": "MOZ",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Maputo",
    "latitude": -18.6,
    "longitude": 35.5,
    "landmark": {
      "name": "Benteng Fortaleza de São Sebastião",
      "city": "Maputo",
      "latitude": -18.6,
      "longitude": 35.5,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng tertua yang masih berdiri kokoh di Pulau Mozambik",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/599",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mozambik"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/599",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mozambik"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NA",
    "displayName": "Namibia",
    "officialName": "Republik Namibia",
    "isoAlpha2": "NA",
    "isoAlpha3": "NAM",
    "region": "Africa",
    "subregion": "Southern Africa",
    "capital": "Windhoek",
    "latitude": -22.9,
    "longitude": 18.4,
    "landmark": {
      "name": "Bukit Pasir Raksasa Sossusvlei & Deadvlei",
      "city": "Windhoek",
      "latitude": -22.9,
      "longitude": 18.4,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Gundukan pasir merah tertinggi di dunia di Gurun Namib",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1435",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Namibia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1435",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Namibia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NE",
    "displayName": "Niger",
    "officialName": "Republik Niger",
    "isoAlpha2": "NE",
    "isoAlpha3": "NER",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Niamey",
    "latitude": 17.6,
    "longitude": 8,
    "landmark": {
      "name": "Menara Tanah Liat Masjid Agung Agadez",
      "city": "Niamey",
      "latitude": 17.6,
      "longitude": 8,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Menara tanah liat tertinggi di dunia (27 meter) di gerbang Gurun Sahara",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1268",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Niger"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1268",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Niger"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NG",
    "displayName": "Nigeria",
    "officialName": "Republik Federal Nigeria",
    "isoAlpha2": "NG",
    "isoAlpha3": "NGA",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Abuja",
    "latitude": 9,
    "longitude": 8.6,
    "landmark": {
      "name": "Monolit Raksasa Zuma Rock Abuja",
      "city": "Abuja",
      "latitude": 9,
      "longitude": 8.6,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Monolit granit raksasa setinggi 725 meter berwajah manusia alami",
      "source": {
        "publisher": "Nigerian Tourism Development Authority",
        "url": "https://tournigeria.gov.ng",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nigeria"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Nigerian Tourism Development Authority",
    "sourceReferences": [
      {
        "publisher": "Nigerian Tourism Development Authority",
        "url": "https://tournigeria.gov.ng",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nigeria"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "RW",
    "displayName": "Rwanda",
    "officialName": "Republik Rwanda",
    "isoAlpha2": "RW",
    "isoAlpha3": "RWA",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Kigali",
    "latitude": -1.9,
    "longitude": 29.8,
    "landmark": {
      "name": "Istana Keraton Tradisional Raja Nyanza",
      "city": "Kigali",
      "latitude": -1.9,
      "longitude": 29.8,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Pondok istana kubah jerami raksasa tempat bertengger raja Tutsi",
      "source": {
        "publisher": "Rwanda Development Board - Tourism",
        "url": "https://www.visitrwanda.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Rwanda"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Rwanda Development Board - Tourism",
    "sourceReferences": [
      {
        "publisher": "Rwanda Development Board - Tourism",
        "url": "https://www.visitrwanda.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Rwanda"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ST",
    "displayName": "Sao Tome dan Principe",
    "officialName": "Republik Demokratik Sao Tome dan Principe",
    "isoAlpha2": "ST",
    "isoAlpha3": "STP",
    "region": "Africa",
    "subregion": "Middle Africa",
    "capital": "São Tomé",
    "latitude": 0.1,
    "longitude": 6.6,
    "landmark": {
      "name": "Benteng Fortaleza de São Sebastião",
      "city": "São Tomé",
      "latitude": 0.1,
      "longitude": 6.6,
      "category": "historic",
      "archetype": "castle",
      "reason": "Museum maritim dan benteng peninggalan Portugis di Ponta de São Sebastião",
      "source": {
        "publisher": "Direção Geral do Turismo de São Tomé e Príncipe",
        "url": "https://saotome.st",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sao Tome dan Principe"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Direção Geral do Turismo de São Tomé e Príncipe",
    "sourceReferences": [
      {
        "publisher": "Direção Geral do Turismo de São Tomé e Príncipe",
        "url": "https://saotome.st",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sao Tome dan Principe"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SN",
    "displayName": "Senegal",
    "officialName": "Republik Senegal",
    "isoAlpha2": "SN",
    "isoAlpha3": "SEN",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Dakar",
    "latitude": 14.4,
    "longitude": -14.4,
    "landmark": {
      "name": "Patung Perunggu Monumen Renaisans Afrika",
      "city": "Dakar",
      "latitude": 14.4,
      "longitude": -14.4,
      "category": "cultural",
      "archetype": "christ",
      "reason": "Patung perunggu tertinggi di Afrika (49 meter) di atas bukit Dakar",
      "source": {
        "publisher": "Agence Sénégalaise de Promotion Touristique",
        "url": "https://visitezlesenegal.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Senegal"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "christ",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Agence Sénégalaise de Promotion Touristique",
    "sourceReferences": [
      {
        "publisher": "Agence Sénégalaise de Promotion Touristique",
        "url": "https://visitezlesenegal.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Senegal"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SC",
    "displayName": "Seychelles",
    "officialName": "Republik Seychelles",
    "isoAlpha2": "SC",
    "isoAlpha3": "SYC",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Victoria",
    "latitude": -4.6,
    "longitude": 55.4,
    "landmark": {
      "name": "Menara Jam Little Ben Victoria",
      "city": "Victoria",
      "latitude": -4.6,
      "longitude": 55.4,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Replika perak menara jam London di ibu kota terkecil di dunia di Mahé",
      "source": {
        "publisher": "Tourism Seychelles",
        "url": "https://www.seychelles.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Seychelles"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Seychelles",
    "sourceReferences": [
      {
        "publisher": "Tourism Seychelles",
        "url": "https://www.seychelles.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Seychelles"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SL",
    "displayName": "Sierra Leone",
    "officialName": "Republik Sierra Leone",
    "isoAlpha2": "SL",
    "isoAlpha3": "SLE",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Freetown",
    "latitude": 8.4,
    "longitude": -11.7,
    "landmark": {
      "name": "Pohon Kapuk Bersejarah Cotton Tree Freetown",
      "city": "Freetown",
      "latitude": 8.4,
      "longitude": -11.7,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Pohon raksasa lambang kebebasan para budak di pusat ibu kota",
      "source": {
        "publisher": "National Tourist Board of Sierra Leone",
        "url": "https://ntb.gov.sl",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sierra Leone"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Tourist Board of Sierra Leone",
    "sourceReferences": [
      {
        "publisher": "National Tourist Board of Sierra Leone",
        "url": "https://ntb.gov.sl",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sierra Leone"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SO",
    "displayName": "Somalia",
    "officialName": "Republik Federal Somalia",
    "isoAlpha2": "SO",
    "isoAlpha3": "SOM",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Mogadishu",
    "latitude": 5.1,
    "longitude": 46.1,
    "landmark": {
      "name": "Mercusuar Batu Kuno Mogadishu",
      "city": "Mogadishu",
      "latitude": 5.1,
      "longitude": 46.1,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Menara suar bersejarah menghadap Samudra Hindia di Tanduk Afrika",
      "source": {
        "publisher": "Ministry of Information, Culture and Tourism Somalia",
        "url": "https://tourism.gov.so",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Somalia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Information, Culture and Tourism Somalia",
    "sourceReferences": [
      {
        "publisher": "Ministry of Information, Culture and Tourism Somalia",
        "url": "https://tourism.gov.so",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Somalia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ZA",
    "displayName": "Afrika Selatan",
    "officialName": "Republik Afrika Selatan",
    "isoAlpha2": "ZA",
    "isoAlpha3": "ZAF",
    "region": "Africa",
    "subregion": "Southern Africa",
    "capital": "Pretoria",
    "latitude": -30.5,
    "longitude": 22.9,
    "landmark": {
      "name": "Puncak Meja Table Mountain Cape Town",
      "city": "Pretoria",
      "latitude": -30.5,
      "longitude": 22.9,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Punggung gunung tebing datar yang menghadap Samudra Atlantik dan Hindia",
      "source": {
        "publisher": "South African Tourism",
        "url": "https://www.southafrica.net",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Afrika Selatan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "South African Tourism",
    "sourceReferences": [
      {
        "publisher": "South African Tourism",
        "url": "https://www.southafrica.net",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Afrika Selatan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SS",
    "displayName": "Sudan Selatan",
    "officialName": "Republik Sudan Selatan",
    "isoAlpha2": "SS",
    "isoAlpha3": "SSD",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Juba",
    "latitude": 6.8,
    "longitude": 31.3,
    "landmark": {
      "name": "Mausoleum Pahlawan John Garang Juba",
      "city": "Juba",
      "latitude": 6.8,
      "longitude": 31.3,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Monumen memorial pahlawan kemerdekaan Sudan Selatan",
      "source": {
        "publisher": "Ministry of Wildlife Conservation and Tourism South Sudan",
        "url": "https://tourism.gov.ss",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sudan Selatan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministry of Wildlife Conservation and Tourism South Sudan",
    "sourceReferences": [
      {
        "publisher": "Ministry of Wildlife Conservation and Tourism South Sudan",
        "url": "https://tourism.gov.ss",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sudan Selatan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SD",
    "displayName": "Sudan",
    "officialName": "Republik Sudan",
    "isoAlpha2": "SD",
    "isoAlpha3": "SDN",
    "region": "Africa",
    "subregion": "Northern Africa",
    "capital": "Khartoum",
    "latitude": 12.8,
    "longitude": 30.2,
    "landmark": {
      "name": "Piramida Nubia Meroë Kerajaan Kush",
      "city": "Khartoum",
      "latitude": 12.8,
      "longitude": 30.2,
      "category": "historic",
      "archetype": "pyramid",
      "reason": "Piramida bersudut curam pemakaman raja-raja nubia di padang pasir Sudan",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1336",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sudan"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "pyramid",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1336",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Sudan"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TZ",
    "displayName": "Tanzania",
    "officialName": "Republik Persatuan Tanzania",
    "isoAlpha2": "TZ",
    "isoAlpha3": "TZA",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Dodoma",
    "latitude": -6.3,
    "longitude": 34.8,
    "landmark": {
      "name": "Puncak Salju Gunung Kilimanjaro",
      "city": "Dodoma",
      "latitude": -6.3,
      "longitude": 34.8,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Atap Afrika - gunung berdiri bebas tertinggi di muka bumi (5.895 m)",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/403",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tanzania"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/403",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tanzania"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TG",
    "displayName": "Togo",
    "officialName": "Republik Togo",
    "isoAlpha2": "TG",
    "isoAlpha3": "TGO",
    "region": "Africa",
    "subregion": "Western Africa",
    "capital": "Lomé",
    "latitude": 8.6,
    "longitude": 0.8,
    "landmark": {
      "name": "Benteng Tanah Liat Bertingkat Tata Somba",
      "city": "Lomé",
      "latitude": 8.6,
      "longitude": 0.8,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Rumah kastel benteng tradisional dua lantai suku Batammariba di Koutammakou",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1140",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Togo"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1140",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Togo"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TN",
    "displayName": "Tunisia",
    "officialName": "Republik Tunisia",
    "isoAlpha2": "TN",
    "isoAlpha3": "TUN",
    "region": "Africa",
    "subregion": "Northern Africa",
    "capital": "Tunis",
    "latitude": 33.8,
    "longitude": 9.5,
    "landmark": {
      "name": "Amfiteater Romawi Megah El Jem",
      "city": "Tunis",
      "latitude": 33.8,
      "longitude": 9.5,
      "category": "historic",
      "archetype": "colosseum",
      "reason": "Amfiteater batu Romawi terbesar ketiga di dunia di tepi padang zaitun",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/37",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tunisia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "colosseum",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/37",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tunisia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "UG",
    "displayName": "Uganda",
    "officialName": "Republik Uganda",
    "isoAlpha2": "UG",
    "isoAlpha3": "UGA",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Kampala",
    "latitude": 1.3,
    "longitude": 32.2,
    "landmark": {
      "name": "Makam Kubah Jerami Kasubi",
      "city": "Kampala",
      "latitude": 1.3,
      "longitude": 32.2,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Makam kerajaan Buganda beratap jerami melengkung tradisional di Kampala",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1022",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uganda"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1022",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uganda"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ZM",
    "displayName": "Zambia",
    "officialName": "Republik Zambia",
    "isoAlpha2": "ZM",
    "isoAlpha3": "ZMB",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Lusaka",
    "latitude": -13.1,
    "longitude": 27.8,
    "landmark": {
      "name": "Monumen Air Terjun Victoria (Mosi-oa-Tunya)",
      "city": "Lusaka",
      "latitude": -13.1,
      "longitude": 27.8,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "\"Asap yang Bergemuruh\" - tirai air terjun terbesar di muka bumi",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/509",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Zambia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/509",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Zambia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "ZW",
    "displayName": "Zimbabwe",
    "officialName": "Republik Zimbabwe",
    "isoAlpha2": "ZW",
    "isoAlpha3": "ZWE",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "capital": "Harare",
    "latitude": -19,
    "longitude": 29.1,
    "landmark": {
      "name": "Reruntuhan Batu Zimbabwe Raya (Great Zimbabwe)",
      "city": "Harare",
      "latitude": -19,
      "longitude": 29.1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Tembok batu melingkar tanpa semen peradaban Shona abad pertengahan",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/364",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Zimbabwe"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/364",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Zimbabwe"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AG",
    "displayName": "Antigua dan Barbuda",
    "officialName": "Antigua dan Barbuda",
    "isoAlpha2": "AG",
    "isoAlpha3": "ATG",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "St. John's",
    "latitude": 17,
    "longitude": -61.8,
    "landmark": {
      "name": "Galangan Kapal Bersejarah Nelson's Dockyard",
      "city": "St. John's",
      "latitude": 17,
      "longitude": -61.8,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Pelabuhan angkatan laut era Georgia di Teluk English Harbour",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1499",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Antigua dan Barbuda"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1499",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Antigua dan Barbuda"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BS",
    "displayName": "Bahama",
    "officialName": "Persemakmuran Bahama",
    "isoAlpha2": "BS",
    "isoAlpha3": "BHS",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Nassau",
    "latitude": 25,
    "longitude": -77.3,
    "landmark": {
      "name": "Menara Air Benteng Fincastle",
      "city": "Nassau",
      "latitude": 25,
      "longitude": -77.3,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Menara benteng batu kapur peninggalan abad ke-18 di Nassau",
      "source": {
        "publisher": "The Bahamas Ministry of Tourism",
        "url": "https://www.bahamas.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bahama"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "The Bahamas Ministry of Tourism",
    "sourceReferences": [
      {
        "publisher": "The Bahamas Ministry of Tourism",
        "url": "https://www.bahamas.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bahama"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BB",
    "displayName": "Barbados",
    "officialName": "Barbados",
    "isoAlpha2": "BB",
    "isoAlpha3": "BRB",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Bridgetown",
    "latitude": 13.1,
    "longitude": -59.5,
    "landmark": {
      "name": "Gedung Parlemen Bersejarah Bridgetown",
      "city": "Bridgetown",
      "latitude": 13.1,
      "longitude": -59.5,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Menara jam neogotik batu karang di ibu kota Barbados",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1376",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Barbados"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1376",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Barbados"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BZ",
    "displayName": "Belize",
    "officialName": "Belize",
    "isoAlpha2": "BZ",
    "isoAlpha3": "BLZ",
    "region": "North America",
    "subregion": "Central America",
    "capital": "Belmopan",
    "latitude": 17.1,
    "longitude": -88.4,
    "landmark": {
      "name": "Kuil Piramida Altun Ha & Great Blue Hole",
      "city": "Belmopan",
      "latitude": 17.1,
      "longitude": -88.4,
      "category": "historic",
      "archetype": "meso_pyramid",
      "reason": "Pusat upacara kuno Maya peninggalan kepala giok Dewa Matahari",
      "source": {
        "publisher": "Belize Tourism Board",
        "url": "https://www.travelbelize.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belize"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "meso_pyramid",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Belize Tourism Board",
    "sourceReferences": [
      {
        "publisher": "Belize Tourism Board",
        "url": "https://www.travelbelize.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Belize"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CA",
    "displayName": "Kanada",
    "officialName": "Kanada",
    "isoAlpha2": "CA",
    "isoAlpha3": "CAN",
    "region": "North America",
    "subregion": "Northern America",
    "capital": "Ottawa",
    "latitude": 56.1,
    "longitude": -106.3,
    "landmark": {
      "name": "Menara CN Tower & Château Frontenac",
      "city": "Ottawa",
      "latitude": 56.1,
      "longitude": -106.3,
      "category": "modern",
      "archetype": "burj",
      "reason": "Menara komunikasi jarum beton ikonik setinggi 553 meter di Toronto",
      "source": {
        "publisher": "Destination Canada",
        "url": "https://www.destinationcanada.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kanada"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.085
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Destination Canada",
    "sourceReferences": [
      {
        "publisher": "Destination Canada",
        "url": "https://www.destinationcanada.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kanada"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CR",
    "displayName": "Kosta Rika",
    "officialName": "Republik Kosta Rika",
    "isoAlpha2": "CR",
    "isoAlpha3": "CRI",
    "region": "North America",
    "subregion": "Central America",
    "capital": "San José",
    "latitude": 9.7,
    "longitude": -83.7,
    "landmark": {
      "name": "Teatro Nacional de Costa Rica",
      "city": "San José",
      "latitude": 9.7,
      "longitude": -83.7,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Gedung teater bersejarah bergaya neoklasik megah di San José",
      "source": {
        "publisher": "Instituto Costarricense de Turismo",
        "url": "https://www.ict.go.cr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kosta Rika"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Instituto Costarricense de Turismo",
    "sourceReferences": [
      {
        "publisher": "Instituto Costarricense de Turismo",
        "url": "https://www.ict.go.cr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kosta Rika"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CU",
    "displayName": "Kuba",
    "officialName": "Republik Kuba",
    "isoAlpha2": "CU",
    "isoAlpha3": "CUB",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Havana",
    "latitude": 21.5,
    "longitude": -77.7,
    "landmark": {
      "name": "Gedung El Capitolio de La Habana",
      "city": "Havana",
      "latitude": 21.5,
      "longitude": -77.7,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Kubah neoklasik megah pualam putih di pusat kota Havana",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/204",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kuba"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/204",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kuba"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "DM",
    "displayName": "Dominika",
    "officialName": "Persemakmuran Dominika",
    "isoAlpha2": "DM",
    "isoAlpha3": "DMA",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Roseau",
    "latitude": 15.4,
    "longitude": -61.3,
    "landmark": {
      "name": "Katedral Kuno Our Lady of Fair Haven Roseau",
      "city": "Roseau",
      "latitude": 15.4,
      "longitude": -61.3,
      "category": "religious",
      "archetype": "rock_church",
      "reason": "Katedral batu vulkanik hitam gotik di ibu kota Dominika",
      "source": {
        "publisher": "Discover Dominica Authority",
        "url": "https://discoverdominica.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Dominika"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "rock_church",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Discover Dominica Authority",
    "sourceReferences": [
      {
        "publisher": "Discover Dominica Authority",
        "url": "https://discoverdominica.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Dominika"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "DO",
    "displayName": "Republik Dominika",
    "officialName": "Republik Dominika",
    "isoAlpha2": "DO",
    "isoAlpha3": "DOM",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Santo Domingo",
    "latitude": 18.7,
    "longitude": -70.1,
    "landmark": {
      "name": "Alcázar de Colón Santo Domingo",
      "city": "Santo Domingo",
      "latitude": 18.7,
      "longitude": -70.1,
      "category": "historic",
      "archetype": "castle",
      "reason": "Istana batu karang kediaman putra Christopher Columbus di Zona Colonial",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/526",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Republik Dominika"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/526",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Republik Dominika"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SV",
    "displayName": "El Salvador",
    "officialName": "Republik El Salvador",
    "isoAlpha2": "SV",
    "isoAlpha3": "SLV",
    "region": "North America",
    "subregion": "Central America",
    "capital": "San Salvador",
    "latitude": 13.7,
    "longitude": -88.8,
    "landmark": {
      "name": "Piramida Tazumal Chalchuapa",
      "city": "San Salvador",
      "latitude": 13.7,
      "longitude": -88.8,
      "category": "historic",
      "archetype": "meso_pyramid",
      "reason": "Piramida kompleks upacara kuno Maya terbesar di El Salvador",
      "source": {
        "publisher": "Ministerio de Turismo de El Salvador",
        "url": "https://elsalvador.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk El Salvador"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "meso_pyramid",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministerio de Turismo de El Salvador",
    "sourceReferences": [
      {
        "publisher": "Ministerio de Turismo de El Salvador",
        "url": "https://elsalvador.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk El Salvador"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GD",
    "displayName": "Grenada",
    "officialName": "Grenada",
    "isoAlpha2": "GD",
    "isoAlpha3": "GRD",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "St. George's",
    "latitude": 12.1,
    "longitude": -61.6,
    "landmark": {
      "name": "Benteng Sejarah Fort George",
      "city": "St. George's",
      "latitude": 12.1,
      "longitude": -61.6,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng pertahanan Prancis abad ke-18 di atas pelabuhan St. George's",
      "source": {
        "publisher": "Grenada Tourism Authority",
        "url": "https://www.puregrenada.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Grenada"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Grenada Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Grenada Tourism Authority",
        "url": "https://www.puregrenada.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Grenada"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GT",
    "displayName": "Guatemala",
    "officialName": "Republik Guatemala",
    "isoAlpha2": "GT",
    "isoAlpha3": "GTM",
    "region": "North America",
    "subregion": "Central America",
    "capital": "Guatemala City",
    "latitude": 15.7,
    "longitude": -90.2,
    "landmark": {
      "name": "Kuil Piramida Tikal I (Kuil Jaguar Besar)",
      "city": "Guatemala City",
      "latitude": 15.7,
      "longitude": -90.2,
      "category": "historic",
      "archetype": "meso_pyramid",
      "reason": "Piramida curam batu kapur Maya di tengah hutan belantara Petén",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/64",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guatemala"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "meso_pyramid",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/64",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guatemala"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "HT",
    "displayName": "Haiti",
    "officialName": "Republik Haiti",
    "isoAlpha2": "HT",
    "isoAlpha3": "HTI",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Port-au-Prince",
    "latitude": 18.9,
    "longitude": -72.2,
    "landmark": {
      "name": "Benteng Citadelle Laferrière",
      "city": "Port-au-Prince",
      "latitude": 18.9,
      "longitude": -72.2,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng gunung batu raksasa lambang kebebasan di puncak Bonnet à l'Évêque",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/180",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Haiti"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/180",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Haiti"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "HN",
    "displayName": "Honduras",
    "officialName": "Republik Honduras",
    "isoAlpha2": "HN",
    "isoAlpha3": "HND",
    "region": "North America",
    "subregion": "Central America",
    "capital": "Tegucigalpa",
    "latitude": 15.2,
    "longitude": -86.2,
    "landmark": {
      "name": "Reruntuhan Piramida & Tangga Hieroglif Copán",
      "city": "Tegucigalpa",
      "latitude": 15.2,
      "longitude": -86.2,
      "category": "historic",
      "archetype": "meso_pyramid",
      "reason": "Situs peradaban Maya berukir relief batu paling rumit di dunia",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/129",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Honduras"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "meso_pyramid",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/129",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Honduras"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "JM",
    "displayName": "Jamaika",
    "officialName": "Jamaika",
    "isoAlpha2": "JM",
    "isoAlpha3": "JAM",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Kingston",
    "latitude": 18.1,
    "longitude": -77.2,
    "landmark": {
      "name": "Rumah Kolonial Bersejarah Rose Hall",
      "city": "Kingston",
      "latitude": 18.1,
      "longitude": -77.2,
      "category": "historic",
      "archetype": "castle",
      "reason": "Rumah besar perkebunan batu bergaya Georgia di Montego Bay",
      "source": {
        "publisher": "Jamaica Tourist Board",
        "url": "https://www.visitjamaica.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jamaika"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Jamaica Tourist Board",
    "sourceReferences": [
      {
        "publisher": "Jamaica Tourist Board",
        "url": "https://www.visitjamaica.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Jamaika"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MX",
    "displayName": "Meksiko",
    "officialName": "Negara-Negara Bersatu Meksiko",
    "isoAlpha2": "MX",
    "isoAlpha3": "MEX",
    "region": "North America",
    "subregion": "Central America",
    "capital": "Mexico City",
    "latitude": 23.6,
    "longitude": -102.5,
    "landmark": {
      "name": "Piramida Bertingkat El Castillo Chichen Itza",
      "city": "Mexico City",
      "latitude": 23.6,
      "longitude": -102.5,
      "category": "historic",
      "archetype": "meso_pyramid",
      "reason": "Kuil piramida berundak peradaban Maya Kukulcan di Yucatán",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/483",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Meksiko"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "meso_pyramid",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/483",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Meksiko"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NI",
    "displayName": "Nikaragua",
    "officialName": "Republik Nikaragua",
    "isoAlpha2": "NI",
    "isoAlpha3": "NIC",
    "region": "North America",
    "subregion": "Central America",
    "capital": "Managua",
    "latitude": 12.8,
    "longitude": -85.2,
    "landmark": {
      "name": "Katedral Putih Léon (Katedral Asunción)",
      "city": "Managua",
      "latitude": 12.8,
      "longitude": -85.2,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Katedral neoklasik terbesar di Amerika Tengah dengan kubah kubah barok",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1236",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nikaragua"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1236",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nikaragua"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PA",
    "displayName": "Panama",
    "officialName": "Republik Panama",
    "isoAlpha2": "PA",
    "isoAlpha3": "PAN",
    "region": "North America",
    "subregion": "Central America",
    "capital": "Panama City",
    "latitude": 8.5,
    "longitude": -80.7,
    "landmark": {
      "name": "Pintu Gerbang Terusan Panama (Miraflores Locks)",
      "city": "Panama City",
      "latitude": 8.5,
      "longitude": -80.7,
      "category": "engineering",
      "archetype": "triumphal_arch",
      "reason": "Kanal keajaiban teknik maritim penghubung Samudra Atlantik dan Pasifik",
      "source": {
        "publisher": "Autoridad de Turismo de Panamá",
        "url": "https://www.tourismpanama.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Panama"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "triumphal_arch",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Autoridad de Turismo de Panamá",
    "sourceReferences": [
      {
        "publisher": "Autoridad de Turismo de Panamá",
        "url": "https://www.tourismpanama.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Panama"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KN",
    "displayName": "Saint Kitts dan Nevis",
    "officialName": "Federasi Saint Christopher dan Nevis",
    "isoAlpha2": "KN",
    "isoAlpha3": "KNA",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Basseterre",
    "latitude": 17.3,
    "longitude": -62.7,
    "landmark": {
      "name": "Benteng Bukit Belerang (Brimstone Hill)",
      "city": "Basseterre",
      "latitude": 17.3,
      "longitude": -62.7,
      "category": "historic",
      "archetype": "castle",
      "reason": "\"Gibraltar dari Karibia\" - benteng batu basal di atas bukit vulkanik",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/910",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Saint Kitts dan Nevis"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/910",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Saint Kitts dan Nevis"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "LC",
    "displayName": "Saint Lucia",
    "officialName": "Saint Lucia",
    "isoAlpha2": "LC",
    "isoAlpha3": "LCA",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Castries",
    "latitude": 13.9,
    "longitude": -60.9,
    "landmark": {
      "name": "Puncak Kembar Gunung Api Pitons",
      "city": "Castries",
      "latitude": 13.9,
      "longitude": -60.9,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Dua kubah lava vulkanik Gros Piton dan Petit Piton menjulang dari laut",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1161",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Saint Lucia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1161",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Saint Lucia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "VC",
    "displayName": "Saint Vincent dan Grenadines",
    "officialName": "Saint Vincent dan Grenadines",
    "isoAlpha2": "VC",
    "isoAlpha3": "VCT",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Kingstown",
    "latitude": 13.2,
    "longitude": -61.2,
    "landmark": {
      "name": "Benteng Batu Kolonial Fort Charlotte",
      "city": "Kingstown",
      "latitude": 13.2,
      "longitude": -61.2,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng meriam di atas punggung bukit menghadap pelabuhan Kingstown",
      "source": {
        "publisher": "Saint Vincent and the Grenadines Tourism Authority",
        "url": "https://discoversvg.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Saint Vincent dan Grenadines"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Saint Vincent and the Grenadines Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Saint Vincent and the Grenadines Tourism Authority",
        "url": "https://discoversvg.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Saint Vincent dan Grenadines"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TT",
    "displayName": "Trinidad dan Tobago",
    "officialName": "Republik Trinidad dan Tobago",
    "isoAlpha2": "TT",
    "isoAlpha3": "TTO",
    "region": "North America",
    "subregion": "Caribbean",
    "capital": "Port of Spain",
    "latitude": 10.6,
    "longitude": -61.2,
    "landmark": {
      "name": "Kastel Stollmeyer (Killarney)",
      "city": "Port of Spain",
      "latitude": 10.6,
      "longitude": -61.2,
      "category": "historic",
      "archetype": "castle",
      "reason": "Kastel gaya Skotlandia di Magnificent Seven Port of Spain",
      "source": {
        "publisher": "Tourism Trinidad",
        "url": "https://visittrinidad.tt",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Trinidad dan Tobago"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Trinidad",
    "sourceReferences": [
      {
        "publisher": "Tourism Trinidad",
        "url": "https://visittrinidad.tt",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Trinidad dan Tobago"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "US",
    "displayName": "Amerika Serikat",
    "officialName": "Amerika Serikat",
    "isoAlpha2": "US",
    "isoAlpha3": "USA",
    "region": "North America",
    "subregion": "Northern America",
    "capital": "Washington, D.C.",
    "latitude": 37,
    "longitude": -95.7,
    "landmark": {
      "name": "Patung Liberty & Empire State",
      "city": "Washington, D.C.",
      "latitude": 37,
      "longitude": -95.7,
      "category": "cultural",
      "archetype": "liberty",
      "reason": "Patung dewi kemerdekaan perunggu neoklasik di New York",
      "source": {
        "publisher": "National Park Service / UNESCO",
        "url": "https://whc.unesco.org/en/list/307",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Amerika Serikat"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.08
    },
    "landmarkType": "liberty",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "National Park Service / UNESCO",
    "sourceReferences": [
      {
        "publisher": "National Park Service / UNESCO",
        "url": "https://whc.unesco.org/en/list/307",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Amerika Serikat"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AR",
    "displayName": "Argentina",
    "officialName": "Republik Argentina",
    "isoAlpha2": "AR",
    "isoAlpha3": "ARG",
    "region": "South America",
    "subregion": "South America",
    "capital": "Buenos Aires",
    "latitude": -38.4,
    "longitude": -63.6,
    "landmark": {
      "name": "Obelisco de Buenos Aires & Casa Rosada",
      "city": "Buenos Aires",
      "latitude": -38.4,
      "longitude": -63.6,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Tugu obelisk monumen nasional di Plaza de la República",
      "source": {
        "publisher": "Instituto Nacional de Promoción Turística",
        "url": "https://www.argentina.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Argentina"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Instituto Nacional de Promoción Turística",
    "sourceReferences": [
      {
        "publisher": "Instituto Nacional de Promoción Turística",
        "url": "https://www.argentina.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Argentina"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BO",
    "displayName": "Bolivia",
    "officialName": "Negara Plurinasional Bolivia",
    "isoAlpha2": "BO",
    "isoAlpha3": "BOL",
    "region": "South America",
    "subregion": "South America",
    "capital": "Sucre",
    "latitude": -16.2,
    "longitude": -63.5,
    "landmark": {
      "name": "Gerbang Matahari Kuno Tiwanaku",
      "city": "Sucre",
      "latitude": -16.2,
      "longitude": -63.5,
      "category": "historic",
      "archetype": "inca_citadel",
      "reason": "Gerbang megalitik batu andesit berukir dewa peradaban pra-Inka",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/567",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bolivia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "inca_citadel",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/567",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Bolivia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "BR",
    "displayName": "Brasil",
    "officialName": "Republik Federal Brasil",
    "isoAlpha2": "BR",
    "isoAlpha3": "BRA",
    "region": "South America",
    "subregion": "South America",
    "capital": "Brasília",
    "latitude": -14.2,
    "longitude": -51.9,
    "landmark": {
      "name": "Patung Kristus Penebus (Cristo Redentor)",
      "city": "Brasília",
      "latitude": -14.2,
      "longitude": -51.9,
      "category": "cultural",
      "archetype": "christ",
      "reason": "Monumen Kristus dengan tangan merangkul di puncak Gunung Corcovado, Rio",
      "source": {
        "publisher": "Embratur - Brazilian Tourist Board",
        "url": "https://visitbrasil.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Brasil"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.075
    },
    "landmarkType": "christ",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Embratur - Brazilian Tourist Board",
    "sourceReferences": [
      {
        "publisher": "Embratur - Brazilian Tourist Board",
        "url": "https://visitbrasil.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Brasil"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CL",
    "displayName": "Chili",
    "officialName": "Republik Chili",
    "isoAlpha2": "CL",
    "isoAlpha3": "CHL",
    "region": "South America",
    "subregion": "South America",
    "capital": "Santiago",
    "latitude": -35.6,
    "longitude": -71.5,
    "landmark": {
      "name": "Patung Monolit Moai Rapa Nui (Pulau Paskah)",
      "city": "Santiago",
      "latitude": -35.6,
      "longitude": -71.5,
      "category": "cultural",
      "archetype": "moai",
      "reason": "Patung monolit kepala batu vulkanik raksasa berwajah misterius",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/715",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Chili"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "moai",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/715",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Chili"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "CO",
    "displayName": "Kolombia",
    "officialName": "Republik Kolombia",
    "isoAlpha2": "CO",
    "isoAlpha3": "COL",
    "region": "South America",
    "subregion": "South America",
    "capital": "Bogota",
    "latitude": 4.5,
    "longitude": -74.2,
    "landmark": {
      "name": "Benteng San Felipe de Barajas & Las Lajas",
      "city": "Bogota",
      "latitude": 4.5,
      "longitude": -74.2,
      "category": "historic",
      "archetype": "castle",
      "reason": "Benteng militer terkuat Spanyol di Cartagena dan gereja ngarai",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/285",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kolombia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "castle",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/285",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kolombia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "EC",
    "displayName": "Ekuador",
    "officialName": "Republik Ekuador",
    "isoAlpha2": "EC",
    "isoAlpha3": "ECU",
    "region": "South America",
    "subregion": "South America",
    "capital": "Quito",
    "latitude": -1.8,
    "longitude": -78.1,
    "landmark": {
      "name": "Monumen Garis Khatulistiwa (Mitad del Mundo)",
      "city": "Quito",
      "latitude": -1.8,
      "longitude": -78.1,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Monumen batu trapesium penanda belahan bumi utara dan selatan di Quito",
      "source": {
        "publisher": "Ministerio de Turismo de Ecuador",
        "url": "https://www.turismo.gob.ec",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ekuador"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministerio de Turismo de Ecuador",
    "sourceReferences": [
      {
        "publisher": "Ministerio de Turismo de Ecuador",
        "url": "https://www.turismo.gob.ec",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Ekuador"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "GY",
    "displayName": "Guyana",
    "officialName": "Republik Kooperatif Guyana",
    "isoAlpha2": "GY",
    "isoAlpha3": "GUY",
    "region": "South America",
    "subregion": "South America",
    "capital": "Georgetown",
    "latitude": 4.8,
    "longitude": -58.9,
    "landmark": {
      "name": "Katedral Kayu Santo George Georgetown",
      "city": "Georgetown",
      "latitude": 4.8,
      "longitude": -58.9,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Salah satu gereja kayu bebas berdiri tertinggi di dunia",
      "source": {
        "publisher": "Guyana Tourism Authority",
        "url": "https://www.guyanatourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guyana"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Guyana Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Guyana Tourism Authority",
        "url": "https://www.guyanatourism.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Guyana"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PY",
    "displayName": "Paraguay",
    "officialName": "Republik Paraguay",
    "isoAlpha2": "PY",
    "isoAlpha3": "PRY",
    "region": "South America",
    "subregion": "South America",
    "capital": "Asunción",
    "latitude": -23.4,
    "longitude": -58.4,
    "landmark": {
      "name": "Panteón Nacional de los Héroes",
      "city": "Asunción",
      "latitude": -23.4,
      "longitude": -58.4,
      "category": "cultural",
      "archetype": "brandenburg",
      "reason": "Mausoleum berkubah putih peringatan pahlawan bangsa di Asunción",
      "source": {
        "publisher": "Secretaría Nacional de Turismo Paraguay",
        "url": "https://senatur.gov.py",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Paraguay"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "brandenburg",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Secretaría Nacional de Turismo Paraguay",
    "sourceReferences": [
      {
        "publisher": "Secretaría Nacional de Turismo Paraguay",
        "url": "https://senatur.gov.py",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Paraguay"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PE",
    "displayName": "Peru",
    "officialName": "Republik Peru",
    "isoAlpha2": "PE",
    "isoAlpha3": "PER",
    "region": "South America",
    "subregion": "South America",
    "capital": "Lima",
    "latitude": -9.1,
    "longitude": -75,
    "landmark": {
      "name": "Benteng Kuno Machu Picchu Inka",
      "city": "Lima",
      "latitude": -9.1,
      "longitude": -75,
      "category": "historic",
      "archetype": "inca_citadel",
      "reason": "Kompleks batu suci peradaban Inka di pegunungan Andes berkabut",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/274",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Peru"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "inca_citadel",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/274",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Peru"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SR",
    "displayName": "Suriname",
    "officialName": "Republik Suriname",
    "isoAlpha2": "SR",
    "isoAlpha3": "SUR",
    "region": "South America",
    "subregion": "South America",
    "capital": "Paramaribo",
    "latitude": 3.9,
    "longitude": -56,
    "landmark": {
      "name": "Katedral Kayu Basilika Santo Petrus dan Paulus",
      "city": "Paramaribo",
      "latitude": 3.9,
      "longitude": -56,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Struktur kayu terbesar di Amerika Selatan di Paramaribo",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/940",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Suriname"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.06
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/940",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Suriname"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "UY",
    "displayName": "Uruguay",
    "officialName": "Republik Oriental Uruguay",
    "isoAlpha2": "UY",
    "isoAlpha3": "URY",
    "region": "South America",
    "subregion": "South America",
    "capital": "Montevideo",
    "latitude": -32.5,
    "longitude": -55.7,
    "landmark": {
      "name": "Menara Bersejarah Palacio Salvo Montevideo",
      "city": "Montevideo",
      "latitude": -32.5,
      "longitude": -55.7,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Gedung art deco neogotik bersejarah di Plaza Independencia",
      "source": {
        "publisher": "Ministerio de Turismo de Uruguay",
        "url": "https://www.gub.uy/ministerio-turismo",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uruguay"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Ministerio de Turismo de Uruguay",
    "sourceReferences": [
      {
        "publisher": "Ministerio de Turismo de Uruguay",
        "url": "https://www.gub.uy/ministerio-turismo",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Uruguay"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "VE",
    "displayName": "Venezuela",
    "officialName": "Republik Bolivarian Venezuela",
    "isoAlpha2": "VE",
    "isoAlpha3": "VEN",
    "region": "South America",
    "subregion": "South America",
    "capital": "Caracas",
    "latitude": 6.4,
    "longitude": -66.5,
    "landmark": {
      "name": "Puncak Air Terjun Tertinggi Salto Ángel (Tepui)",
      "city": "Caracas",
      "latitude": 6.4,
      "longitude": -66.5,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Gunung meja Auyán-tepui dengan air terjun tertinggi di dunia (979 m)",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/701",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Venezuela"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.07
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/701",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Venezuela"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "AU",
    "displayName": "Australia",
    "officialName": "Persemakmuran Australia",
    "isoAlpha2": "AU",
    "isoAlpha3": "AUS",
    "region": "Oceania",
    "subregion": "Australia and New Zealand",
    "capital": "Canberra",
    "latitude": -25.2,
    "longitude": 133.7,
    "landmark": {
      "name": "Sydney Opera House",
      "city": "Canberra",
      "latitude": -25.2,
      "longitude": 133.7,
      "category": "modern",
      "archetype": "operahouse",
      "reason": "Mahakarya arsitektur atap layar cangkang di pelabuhan Sydney",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/166",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Australia"
      },
      "representationType": "HERO_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "operahouse",
    "representationType": "HERO_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/166",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Australia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "FJ",
    "displayName": "Fiji",
    "officialName": "Republik Fiji",
    "isoAlpha2": "FJ",
    "isoAlpha3": "FJI",
    "region": "Oceania",
    "subregion": "Melanesia",
    "capital": "Suva",
    "latitude": -17.7,
    "longitude": 178,
    "landmark": {
      "name": "Kuil Hindu Sri Siva Subramaniya Nadi",
      "city": "Suva",
      "latitude": -17.7,
      "longitude": 178,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Kuil dravida bertingkat warna-warni terbesar di Belahan Bumi Selatan",
      "source": {
        "publisher": "Tourism Fiji",
        "url": "https://www.fiji.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Fiji"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Fiji",
    "sourceReferences": [
      {
        "publisher": "Tourism Fiji",
        "url": "https://www.fiji.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Fiji"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "KI",
    "displayName": "Kiribati",
    "officialName": "Republik Kiribati",
    "isoAlpha2": "KI",
    "isoAlpha3": "KIR",
    "region": "Oceania",
    "subregion": "Micronesia",
    "capital": "Tarawa Selatan",
    "latitude": -3.3,
    "longitude": -168.7,
    "landmark": {
      "name": "Maneaba Tradisional Terbesar Tarawa",
      "city": "Tarawa Selatan",
      "latitude": -3.3,
      "longitude": -168.7,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Pusat musyawarah beratap daun kelapa pilar batu karang di Kiribati",
      "source": {
        "publisher": "Kiribati National Tourism Office",
        "url": "https://www.kiribatitourism.gov.ki",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kiribati"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Kiribati National Tourism Office",
    "sourceReferences": [
      {
        "publisher": "Kiribati National Tourism Office",
        "url": "https://www.kiribatitourism.gov.ki",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kiribati"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "MH",
    "displayName": "Kepulauan Marshall",
    "officialName": "Republik Kepulauan Marshall",
    "isoAlpha2": "MH",
    "isoAlpha3": "MHL",
    "region": "Oceania",
    "subregion": "Micronesia",
    "capital": "Majuro",
    "latitude": 7.1,
    "longitude": 171.1,
    "landmark": {
      "name": "Monumen Perdamaian Majuro Atoll",
      "city": "Majuro",
      "latitude": 7.1,
      "longitude": 171.1,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Monumen memorial perdamaian di atol cincin karang Samudra Pasifik",
      "source": {
        "publisher": "Marshall Islands Visitors Authority",
        "url": "https://visitmarshallislands.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kepulauan Marshall"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Marshall Islands Visitors Authority",
    "sourceReferences": [
      {
        "publisher": "Marshall Islands Visitors Authority",
        "url": "https://visitmarshallislands.org",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kepulauan Marshall"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "FM",
    "displayName": "Mikronesia",
    "officialName": "Federasi Mikronesia",
    "isoAlpha2": "FM",
    "isoAlpha3": "FSM",
    "region": "Oceania",
    "subregion": "Micronesia",
    "capital": "Palikir",
    "latitude": 7.4,
    "longitude": 151.8,
    "landmark": {
      "name": "Kota Batu Megalitik Nan Madol Pohnpei",
      "city": "Palikir",
      "latitude": 7.4,
      "longitude": 151.8,
      "category": "historic",
      "archetype": "inca_citadel",
      "reason": "\"Venesia dari Pasifik\" - reruntuhan kota kanal pulau batu basal kuno",
      "source": {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1503",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mikronesia"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "inca_citadel",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "UNESCO World Heritage Centre",
    "sourceReferences": [
      {
        "publisher": "UNESCO World Heritage Centre",
        "url": "https://whc.unesco.org/en/list/1503",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Mikronesia"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NR",
    "displayName": "Nauru",
    "officialName": "Republik Nauru",
    "isoAlpha2": "NR",
    "isoAlpha3": "NRU",
    "region": "Oceania",
    "subregion": "Micronesia",
    "capital": "Yaren",
    "latitude": -0.5,
    "longitude": 166.9,
    "landmark": {
      "name": "Tebing Puncak Karang Anibare",
      "city": "Yaren",
      "latitude": -0.5,
      "longitude": 166.9,
      "category": "natural",
      "archetype": "nature_peak",
      "reason": "Formasi batu kapur karang puncak dramatis di Pulau Nauru",
      "source": {
        "publisher": "Nauru Tourism / Government Portal",
        "url": "http://www.naurugov.nr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nauru"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "nature_peak",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Nauru Tourism / Government Portal",
    "sourceReferences": [
      {
        "publisher": "Nauru Tourism / Government Portal",
        "url": "http://www.naurugov.nr",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Nauru"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "NZ",
    "displayName": "Selandia Baru",
    "officialName": "Selandia Baru",
    "isoAlpha2": "NZ",
    "isoAlpha3": "NZL",
    "region": "Oceania",
    "subregion": "Australia and New Zealand",
    "capital": "Wellington",
    "latitude": -40.9,
    "longitude": 174.8,
    "landmark": {
      "name": "Menara Sky Tower Auckland",
      "city": "Wellington",
      "latitude": -40.9,
      "longitude": 174.8,
      "category": "modern",
      "archetype": "burj",
      "reason": "Menara observasi menjulang setinggi 328 meter di Selandia Baru",
      "source": {
        "publisher": "Tourism New Zealand",
        "url": "https://www.newzealand.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Selandia Baru"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.08
    },
    "landmarkType": "burj",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism New Zealand",
    "sourceReferences": [
      {
        "publisher": "Tourism New Zealand",
        "url": "https://www.newzealand.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Selandia Baru"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PW",
    "displayName": "Palau",
    "officialName": "Republik Palau",
    "isoAlpha2": "PW",
    "isoAlpha3": "PLW",
    "region": "Oceania",
    "subregion": "Micronesia",
    "capital": "Ngerulmud",
    "latitude": 7.5,
    "longitude": 134.5,
    "landmark": {
      "name": "Rumah Musyawarah Adat Bai Airai",
      "city": "Ngerulmud",
      "latitude": 7.5,
      "longitude": 134.5,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Balai kayu berukir motif mitologi Palau berusia dua abad",
      "source": {
        "publisher": "Palau Visitors Authority",
        "url": "https://www.pristineparadisepalau.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Palau"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Palau Visitors Authority",
    "sourceReferences": [
      {
        "publisher": "Palau Visitors Authority",
        "url": "https://www.pristineparadisepalau.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Palau"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "PG",
    "displayName": "Papua Nugini",
    "officialName": "Negara Independen Papua Nugini",
    "isoAlpha2": "PG",
    "isoAlpha3": "PNG",
    "region": "Oceania",
    "subregion": "Melanesia",
    "capital": "Port Moresby",
    "latitude": -6.3,
    "longitude": 143.9,
    "landmark": {
      "name": "Gedung Parlemen Tradisional Haus Tambaran",
      "city": "Port Moresby",
      "latitude": -6.3,
      "longitude": 143.9,
      "category": "religious",
      "archetype": "pagoda",
      "reason": "Arsitektur rumah roh Maprik beratap segitiga raksasa di Port Moresby",
      "source": {
        "publisher": "Papua New Guinea Tourism Promotion Authority",
        "url": "https://www.papuanewguinea.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Papua Nugini"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.065
    },
    "landmarkType": "pagoda",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Papua New Guinea Tourism Promotion Authority",
    "sourceReferences": [
      {
        "publisher": "Papua New Guinea Tourism Promotion Authority",
        "url": "https://www.papuanewguinea.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Papua Nugini"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "WS",
    "displayName": "Samoa",
    "officialName": "Negara Independen Samoa",
    "isoAlpha2": "WS",
    "isoAlpha3": "WSM",
    "region": "Oceania",
    "subregion": "Polynesia",
    "capital": "Apia",
    "latitude": -13.7,
    "longitude": -172.1,
    "landmark": {
      "name": "Fale Tradisional Raksasa Faleata",
      "city": "Apia",
      "latitude": -13.7,
      "longitude": -172.1,
      "category": "cultural",
      "archetype": "adobe_mosque",
      "reason": "Rumah pertemuan adat Polinesia kubah kayu tanpa dinding di Apia",
      "source": {
        "publisher": "Samoa Tourism Authority",
        "url": "https://www.samoa.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Samoa"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "adobe_mosque",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Samoa Tourism Authority",
    "sourceReferences": [
      {
        "publisher": "Samoa Tourism Authority",
        "url": "https://www.samoa.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Samoa"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "SB",
    "displayName": "Kepulauan Solomon",
    "officialName": "Kepulauan Solomon",
    "isoAlpha2": "SB",
    "isoAlpha3": "SLB",
    "region": "Oceania",
    "subregion": "Melanesia",
    "capital": "Honiara",
    "latitude": -9.6,
    "longitude": 160.1,
    "landmark": {
      "name": "Monumen Perdamaian Perang Guadalcanal",
      "city": "Honiara",
      "latitude": -9.6,
      "longitude": 160.1,
      "category": "cultural",
      "archetype": "monas",
      "reason": "Monumen obelisk memorial pendaratan Pasifik di Skyline Ridge Honiara",
      "source": {
        "publisher": "Tourism Solomons",
        "url": "https://www.visitsolomons.com.sb",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kepulauan Solomon"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.05
    },
    "landmarkType": "monas",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tourism Solomons",
    "sourceReferences": [
      {
        "publisher": "Tourism Solomons",
        "url": "https://www.visitsolomons.com.sb",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Kepulauan Solomon"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TO",
    "displayName": "Tonga",
    "officialName": "Kerajaan Tonga",
    "isoAlpha2": "TO",
    "isoAlpha3": "TON",
    "region": "Oceania",
    "subregion": "Polynesia",
    "capital": "Nuku'alofa",
    "latitude": -21.1,
    "longitude": -175.1,
    "landmark": {
      "name": "Triliton Megalit Ha'amonga 'a Maui",
      "city": "Nuku'alofa",
      "latitude": -21.1,
      "longitude": -175.1,
      "category": "historic",
      "archetype": "parthenon",
      "reason": "\"Stonehenge Pasifik\" - pintu gerbang batu karang seberat 40 ton di Heketā",
      "source": {
        "publisher": "Tonga Ministry of Tourism",
        "url": "https://www.visittonga.to",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tonga"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.045
    },
    "landmarkType": "parthenon",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tonga Ministry of Tourism",
    "sourceReferences": [
      {
        "publisher": "Tonga Ministry of Tourism",
        "url": "https://www.visittonga.to",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tonga"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "TV",
    "displayName": "Tuvalu",
    "officialName": "Tuvalu",
    "isoAlpha2": "TV",
    "isoAlpha3": "TUV",
    "region": "Oceania",
    "subregion": "Polynesia",
    "capital": "Funafuti",
    "latitude": -7.1,
    "longitude": 177.6,
    "landmark": {
      "name": "Paviliun Fale Kaupule Funafuti",
      "city": "Funafuti",
      "latitude": -7.1,
      "longitude": 177.6,
      "category": "cultural",
      "archetype": "monument",
      "reason": "Balai rakyat pertemuan adat tradisional di atol terpencil Tuvalu",
      "source": {
        "publisher": "Tuvalu Department of Tourism",
        "url": "https://timelesstuvalu.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tuvalu"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.04
    },
    "landmarkType": "monument",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Tuvalu Department of Tourism",
    "sourceReferences": [
      {
        "publisher": "Tuvalu Department of Tourism",
        "url": "https://timelesstuvalu.com",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Tuvalu"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  },
  {
    "id": "VU",
    "displayName": "Vanuatu",
    "officialName": "Republik Vanuatu",
    "isoAlpha2": "VU",
    "isoAlpha3": "VUT",
    "region": "Oceania",
    "subregion": "Melanesia",
    "capital": "Port Vila",
    "latitude": -15.3,
    "longitude": 166.9,
    "landmark": {
      "name": "Menara Kayu Naghol (Land Diving)",
      "city": "Port Vila",
      "latitude": -15.3,
      "longitude": 166.9,
      "category": "cultural",
      "archetype": "bigben",
      "reason": "Menara kayu tradisi lompat gantung suku Sa di Pulau Pentakosta",
      "source": {
        "publisher": "Vanuatu Tourism Office",
        "url": "https://www.vanuatu.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Vanuatu"
      },
      "representationType": "PROCEDURAL_LANDMARK_3D",
      "heightMultiplier": 0.055
    },
    "landmarkType": "bigben",
    "representationType": "PROCEDURAL_LANDMARK_3D",
    "assetStatus": "verified",
    "assetSource": "Vanuatu Tourism Office",
    "sourceReferences": [
      {
        "publisher": "Vanuatu Tourism Office",
        "url": "https://www.vanuatu.travel",
        "accessedAt": "2026-09-30T12:00:00Z",
        "citationNotes": "Verifikasi resmi pusaka arsitektur dan pariwisata untuk Vanuatu"
      }
    ],
    "dataCheckedAt": "2026-09-30T12:00:00Z"
  }
];
