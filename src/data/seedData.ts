import { Memory, Souvenir, Country } from '../core/contracts';

export const SEED_MEMORIES: Memory[] = [
  {
    id: 'mem-bromo-2023',
    title: 'Dawn Above the Caldera Sea of Sand',
    countryCode: 'ID',
    placeName: 'Mount Bromo, East Java',
    dateStart: '2023-08-14',
    summary: 'Standing on the crater rim before first light as the volcanic fog rolled through the Tengger massif.',
    notes: 'The cold was piercing at 4 AM, but as the sun broke through Mount Batok, the entire caldera transformed into an ancient, quiet moonscape. We listened to the distant rumble of the earth.',
    tags: ['volcano', 'sunrise', 'landscape', 'caldera'],
    favorite: true,
    coverImage: {
      id: 'img-bromo-hero',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=80',
      caption: 'Mount Bromo shrouded in morning mist, East Java',
      isPersonal: false,
      attribution: {
        photographer: 'Ayu Lestari',
        source: 'Unsplash',
        license: 'Unsplash Free License',
        sourceUrl: 'https://unsplash.com'
      }
    },
    mediaReferences: [
      {
        id: 'img-bromo-hero',
        type: 'image',
        uri: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=80',
        caption: 'Mount Bromo caldera morning light',
        isPersonal: false,
        attribution: {
          photographer: 'Ayu Lestari',
          source: 'Unsplash',
          license: 'Unsplash Free License'
        }
      },
      {
        id: 'img-bromo-sand',
        type: 'image',
        uri: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Crossing the Whispering Sand plain on horseback',
        isPersonal: false,
        attribution: {
          photographer: 'Rizal Fauzi',
          source: 'Unsplash',
          license: 'Unsplash Free License'
        }
      }
    ],
    souvenirs: [
      {
        id: 'souv-bromo-1',
        countryCode: 'ID',
        memoryId: 'mem-bromo-2023',
        name: 'Woven Tengger Wool Scarf',
        description: 'Coarse dark wool scarf purchased from a local elder at Cemoro Lawang village.',
        category: 'textile',
        acquiredDate: '2023-08-14'
      }
    ],
    createdAt: '2023-08-16T10:00:00Z',
    updatedAt: '2023-08-16T10:00:00Z'
  },
  {
    id: 'mem-kyoto-2024',
    title: 'Rain over the Moss Gardens of Sagano',
    countryCode: 'JP',
    placeName: 'Kyoto, Kansai Region',
    dateStart: '2024-04-20',
    dateEnd: '2024-04-25',
    summary: 'Walking the narrow wooden corridors of Giouji Temple while gentle spring rain soaked the cedar trees.',
    notes: 'The sound of raindrops dripping from thatched eaves onto centuries-old emerald moss. Few travelers ventured this deep into Arashiyama in the late afternoon.',
    tags: ['temple', 'gardens', 'spring', 'rain'],
    favorite: true,
    coverImage: {
      id: 'img-kyoto-hero',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
      caption: 'Historic stone path and maple foliage in Kyoto',
      isPersonal: false,
      attribution: {
        photographer: 'Soragrit Wongsa',
        source: 'Unsplash',
        license: 'Unsplash Free License'
      }
    },
    mediaReferences: [
      {
        id: 'img-kyoto-hero',
        type: 'image',
        uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
        caption: 'Historic stone path and maple foliage in Kyoto',
        isPersonal: false,
        attribution: {
          photographer: 'Soragrit Wongsa',
          source: 'Unsplash',
          license: 'Unsplash Free License'
        }
      }
    ],
    souvenirs: [
      {
        id: 'souv-kyoto-1',
        countryCode: 'JP',
        memoryId: 'mem-kyoto-2024',
        name: 'Cedar Temple Charm (Omamori)',
        description: 'Handcrafted wooden talisman inscribed for safe journey and quiet mind.',
        category: 'artifact',
        acquiredDate: '2024-04-22'
      }
    ],
    createdAt: '2024-04-28T08:30:00Z',
    updatedAt: '2024-04-28T08:30:00Z'
  },
  {
    id: 'mem-iceland-2022',
    title: 'The Black Sands of Reynisfjara',
    countryCode: 'IS',
    placeName: 'Vík í Mýrdal, South Coast',
    dateStart: '2022-10-05',
    summary: 'Immense basalt columns facing the relentless North Atlantic waves under heavy gray skies.',
    notes: 'Wind strong enough to lean against. The contrast between white froth and basalt sand felt like another planet.',
    tags: ['coast', 'geology', 'arctic', 'solitude'],
    favorite: false,
    coverImage: {
      id: 'img-iceland-hero',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
      caption: 'Reynisfjara basalt columns and roaring ocean waves',
      isPersonal: false,
      attribution: {
        photographer: 'Jonatan Pie',
        source: 'Unsplash',
        license: 'Unsplash Free License'
      }
    },
    mediaReferences: [
      {
        id: 'img-iceland-hero',
        type: 'image',
        uri: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
        caption: 'Reynisfjara basalt columns and roaring ocean waves',
        isPersonal: false,
        attribution: {
          photographer: 'Jonatan Pie',
          source: 'Unsplash',
          license: 'Unsplash Free License'
        }
      }
    ],
    souvenirs: [],
    createdAt: '2022-10-10T12:00:00Z',
    updatedAt: '2022-10-10T12:00:00Z'
  }
];

export const INITIAL_UPDATED_COUNTRIES: Partial<Record<string, Partial<Country>>> = {
  'ID': {
    status: 'documented',
    summary: 'Archipelago of ancient volcanic calderas, dense rainforests, and rich maritime heritage.',
    coverImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
    visitedYear: 2023,
    documentedPlacesCount: 1
  },
  'JP': {
    status: 'documented',
    summary: 'Quiet mountain temples, moss gardens, and historic cedar forests.',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    visitedYear: 2024,
    documentedPlacesCount: 1
  },
  'IS': {
    status: 'documented',
    summary: 'Glacial rivers, volcanic sands, and quiet northern shores.',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    visitedYear: 2022,
    documentedPlacesCount: 1
  },
  'CH': {
    status: 'planned',
    summary: 'High alpine passes, Lauterbrunnen valley, and lake paths.',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'
  },
  'NO': {
    status: 'interested',
    summary: 'Lofoten archipelago and dramatic western fjords.',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'
  },
  'NZ': {
    status: 'interested',
    summary: 'Southern Alps and quiet fiords of Te Wahipounamu.',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
  }
};
