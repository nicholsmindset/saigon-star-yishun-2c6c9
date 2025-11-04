export type SubArea = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
};

export type District = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  subareas: SubArea[];
};

export type Region = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  districts: District[];
};

export const singaporeAreas: Region[] = [
  {
    id: 'central',
    name: 'Central Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    description: 'Central Business District, Marina Bay, and downtown Singapore with diverse dining options',
    districts: [
      {
        id: 'cbd',
        name: 'Central Business District',
        latitude: 1.2788,
        longitude: 103.8493,
        subareas: [
          {
            id: 'raffles-place',
            name: 'Raffles Place',
            latitude: 1.2836,
            longitude: 103.8505,
            description: 'Financial district with halal food courts, restaurants, and business establishments'
          },
          {
            id: 'tanjong-pagar',
            name: 'Tanjong Pagar',
            latitude: 1.2759,
            longitude: 103.8443,
            description: 'Historic district with diverse halal food options and cultural establishments'
          },
          {
            id: 'marina-bay',
            name: 'Marina Bay',
            latitude: 1.2821,
            longitude: 103.8626,
            description: 'Waterfront area with halal restaurants and waterfront dining experiences'
          },
          {
            id: 'thong-teck',
            name: 'Thong Teck',
            latitude: 1.2743,
            longitude: 103.8446,
            description: 'Business area with convenient halal food options for professionals'
          },
          {
            id: 'outram',
            name: 'Outram',
            latitude: 1.2688,
            longitude: 103.8361,
            description: 'Central location with diverse halal dining establishments'
          },
        ]
      },
      {
        id: 'orchard',
        name: 'Orchard',
        latitude: 1.3045,
        longitude: 103.8326,
        subareas: [
          {
            id: 'orchard-road',
            name: 'Orchard Road',
            latitude: 1.3039,
            longitude: 103.8324,
            description: 'Premier shopping and dining destination with halal restaurants and food options'
          },
          {
            id: 'somerset',
            name: 'Somerset',
            latitude: 1.3012,
            longitude: 103.8299,
            description: 'Youth-oriented shopping area with casual halal dining options'
          },
          {
            id: 'newton',
            name: 'Newton',
            latitude: 1.3145,
            longitude: 103.8376,
            description: 'Food haven with famous halal food stalls and restaurants'
          },
        ]
      },
      {
        id: 'civic-district',
        name: 'Civic District',
        latitude: 1.2897,
        longitude: 103.8481,
        subareas: [
          {
            id: 'city-hall',
            name: 'City Hall',
            latitude: 1.2897,
            longitude: 103.8481,
            description: 'Historic civic center with government buildings and restaurants'
          },
          {
            id: 'fort-canning',
            name: 'Fort Canning',
            latitude: 1.2960,
            longitude: 103.8474,
            description: 'Historic area with parks and dining establishments'
          },
        ]
      },
    ]
  },
  {
    id: 'east',
    name: 'East Singapore',
    latitude: 1.3521,
    longitude: 103.9648,
    description: 'Eastern region including Bedok, Tampines, Geylang, and Pasir Ris with vibrant communities',
    districts: [
      {
        id: 'bedok',
        name: 'Bedok',
        latitude: 1.3244,
        longitude: 103.9284,
        subareas: [
          {
            id: 'bedok-central',
            name: 'Bedok Central',
            latitude: 1.3242,
            longitude: 103.9288,
            description: 'Residential new town with shopping centers and halal food options'
          },
          {
            id: 'bedok-north',
            name: 'Bedok North',
            latitude: 1.3359,
            longitude: 103.9274,
            description: 'Residential area with community amenities and halal establishments'
          },
          {
            id: 'bedok-reservoir',
            name: 'Bedok Reservoir',
            latitude: 1.3404,
            longitude: 103.9315,
            description: 'Scenic area with lakeside dining and halal restaurants'
          },
        ]
      },
      {
        id: 'tampines',
        name: 'Tampines',
        latitude: 1.3521,
        longitude: 103.9648,
        subareas: [
          {
            id: 'tampines-central',
            name: 'Tampines Central',
            latitude: 1.3521,
            longitude: 103.9648,
            description: 'Modern new town with shopping malls and diverse halal dining options'
          },
          {
            id: 'tampines-east',
            name: 'Tampines East',
            latitude: 1.3543,
            longitude: 103.9710,
            description: 'Residential area with community centers and halal food courts'
          },
          {
            id: 'tampines-west',
            name: 'Tampines West',
            latitude: 1.3486,
            longitude: 103.9534,
            description: 'Western part of Tampines with residential and commercial establishments'
          },
        ]
      },
      {
        id: 'geylang',
        name: 'Geylang',
        latitude: 1.3173,
        longitude: 103.8611,
        subareas: [
          {
            id: 'geylang-serai',
            name: 'Geylang Serai',
            latitude: 1.3192,
            longitude: 103.8637,
            description: 'Historic Malay-Muslim enclave with halal food culture and traditional establishments'
          },
          {
            id: 'geylang-east',
            name: 'Geylang East',
            latitude: 1.3150,
            longitude: 103.8700,
            description: 'Residential area with diverse halal food options and businesses'
          },
          {
            id: 'joo-chiat',
            name: 'Joo Chiat',
            latitude: 1.3126,
            longitude: 103.8732,
            description: 'Historic Peranakan area with multicultural dining including halal options'
          },
        ]
      },
      {
        id: 'pasir-ris',
        name: 'Pasir Ris',
        latitude: 1.3785,
        longitude: 103.9738,
        subareas: [
          {
            id: 'pasir-ris-central',
            name: 'Pasir Ris Central',
            latitude: 1.3785,
            longitude: 103.9738,
            description: 'Coastal new town with parks, shopping center and halal restaurants'
          },
          {
            id: 'pasir-ris-east',
            name: 'Pasir Ris East',
            latitude: 1.3820,
            longitude: 103.9850,
            description: 'Eastern residential area with waterfront attractions and dining'
          },
        ]
      },
    ]
  },
  {
    id: 'north',
    name: 'North Singapore',
    latitude: 1.4109,
    longitude: 103.8298,
    description: 'Northern region including Yishun, Bukit Timah, and Woodlands with green spaces',
    districts: [
      {
        id: 'yishun',
        name: 'Yishun',
        latitude: 1.4275,
        longitude: 103.8354,
        subareas: [
          {
            id: 'yishun-central',
            name: 'Yishun Central',
            latitude: 1.4275,
            longitude: 103.8354,
            description: 'Residential new town with shopping center and halal food options'
          },
          {
            id: 'yishun-east',
            name: 'Yishun East',
            latitude: 1.4318,
            longitude: 103.8452,
            description: 'Eastern residential area with community facilities'
          },
          {
            id: 'yishun-west',
            name: 'Yishun West',
            latitude: 1.4249,
            longitude: 103.8182,
            description: 'Western residential area with various amenities'
          },
        ]
      },
      {
        id: 'bukit-timah',
        name: 'Bukit Timah',
        latitude: 1.3521,
        longitude: 103.7797,
        subareas: [
          {
            id: 'bukit-timah-central',
            name: 'Bukit Timah Central',
            latitude: 1.3521,
            longitude: 103.7797,
            description: 'Residential area near nature reserve with dining options'
          },
          {
            id: 'newton',
            name: 'Newton',
            latitude: 1.3145,
            longitude: 103.8376,
            description: 'Central location with food culture and diverse cuisines'
          },
        ]
      },
      {
        id: 'woodlands',
        name: 'Woodlands',
        latitude: 1.4373,
        longitude: 103.8379,
        subareas: [
          {
            id: 'woodlands-central',
            name: 'Woodlands Central',
            latitude: 1.4373,
            longitude: 103.8379,
            description: 'Modern new town with shopping mall and halal restaurants'
          },
          {
            id: 'woodlands-checkpoint',
            name: 'Woodlands Checkpoint',
            latitude: 1.4467,
            longitude: 103.7466,
            description: 'Border area near Malaysia with cross-border dining options'
          },
        ]
      },
      {
        id: 'sembawang',
        name: 'Sembawang',
        latitude: 1.4460,
        longitude: 103.8194,
        subareas: [
          {
            id: 'sembawang-central',
            name: 'Sembawang Central',
            latitude: 1.4460,
            longitude: 103.8194,
            description: 'Naval area with residential communities and dining establishments'
          },
        ]
      },
    ]
  },
  {
    id: 'north-east',
    name: 'North-East Singapore',
    latitude: 1.3897,
    longitude: 103.9057,
    description: 'North-Eastern region including Punggol, Sengkang, and Ang Mo Kio with growing communities',
    districts: [
      {
        id: 'punggol',
        name: 'Punggol',
        latitude: 1.4048,
        longitude: 103.9017,
        subareas: [
          {
            id: 'punggol-central',
            name: 'Punggol Central',
            latitude: 1.4048,
            longitude: 103.9017,
            description: 'Modern waterfront new town with shopping and halal dining'
          },
          {
            id: 'punggol-east',
            name: 'Punggol East',
            latitude: 1.4102,
            longitude: 103.9137,
            description: 'Waterfront residential area with scenic dining locations'
          },
          {
            id: 'punggol-west',
            name: 'Punggol West',
            latitude: 1.4012,
            longitude: 103.8891,
            description: 'Residential area with community amenities'
          },
        ]
      },
      {
        id: 'sengkang',
        name: 'Sengkang',
        latitude: 1.3897,
        longitude: 103.8884,
        subareas: [
          {
            id: 'sengkang-central',
            name: 'Sengkang Central',
            latitude: 1.3897,
            longitude: 103.8884,
            description: 'Modern new town with shopping mall and diverse halal options'
          },
          {
            id: 'sengkang-east',
            name: 'Sengkang East',
            latitude: 1.3944,
            longitude: 103.8945,
            description: 'Eastern residential area with food courts'
          },
        ]
      },
      {
        id: 'ang-mo-kio',
        name: 'Ang Mo Kio',
        latitude: 1.3721,
        longitude: 103.8450,
        subareas: [
          {
            id: 'ang-mo-kio-central',
            name: 'Ang Mo Kio Central',
            latitude: 1.3721,
            longitude: 103.8450,
            description: 'Established new town with shopping center and halal restaurants'
          },
          {
            id: 'ang-mo-kio-east',
            name: 'Ang Mo Kio East',
            latitude: 1.3763,
            longitude: 103.8619,
            description: 'Residential area with community facilities and dining'
          },
        ]
      },
    ]
  },
  {
    id: 'west',
    name: 'West Singapore',
    latitude: 1.3345,
    longitude: 103.7618,
    description: 'Western region including Clementi, Jurong, and Bukit Batok with industrial and residential areas',
    districts: [
      {
        id: 'clementi',
        name: 'Clementi',
        latitude: 1.3345,
        longitude: 103.7618,
        subareas: [
          {
            id: 'clementi-central',
            name: 'Clementi Central',
            latitude: 1.3345,
            longitude: 103.7618,
            description: 'Residential area with shopping center and halal food options'
          },
          {
            id: 'clementi-west',
            name: 'Clementi West',
            latitude: 1.3311,
            longitude: 103.7502,
            description: 'Western residential area with community amenities'
          },
        ]
      },
      {
        id: 'jurong',
        name: 'Jurong',
        latitude: 1.3521,
        longitude: 103.7454,
        subareas: [
          {
            id: 'jurong-east',
            name: 'Jurong East',
            latitude: 1.3368,
            longitude: 103.7432,
            description: 'Industrial and commercial area with food courts and restaurants'
          },
          {
            id: 'jurong-west',
            name: 'Jurong West',
            latitude: 1.3445,
            longitude: 103.7132,
            description: 'Industrial area with diverse food options for workers'
          },
          {
            id: 'boon-lay',
            name: 'Boon Lay',
            latitude: 1.3404,
            longitude: 103.7037,
            description: 'Residential and commercial area with halal establishments'
          },
        ]
      },
      {
        id: 'bukit-batok',
        name: 'Bukit Batok',
        latitude: 1.3414,
        longitude: 103.7486,
        subareas: [
          {
            id: 'bukit-batok-central',
            name: 'Bukit Batok Central',
            latitude: 1.3414,
            longitude: 103.7486,
            description: 'Established new town with shopping center and halal restaurants'
          },
          {
            id: 'bukit-batok-east',
            name: 'Bukit Batok East',
            latitude: 1.3480,
            longitude: 103.7610,
            description: 'Residential area with community facilities'
          },
        ]
      },
      {
        id: 'pioneer',
        name: 'Pioneer',
        latitude: 1.3330,
        longitude: 103.6974,
        subareas: [
          {
            id: 'pioneer-central',
            name: 'Pioneer Central',
            latitude: 1.3330,
            longitude: 103.6974,
            description: 'Industrial area in the western region with food options'
          },
        ]
      },
    ]
  },
];

// Helper functions
export function getRegionById(regionId: string): Region | undefined {
  return singaporeAreas.find(r => r.id === regionId);
}

export function getDistrictById(regionId: string, districtId: string): District | undefined {
  const region = getRegionById(regionId);
  return region?.districts.find(d => d.id === districtId);
}

export function getSubAreaById(regionId: string, districtId: string, subareaId: string): SubArea | undefined {
  const district = getDistrictById(regionId, districtId);
  return district?.subareas.find(s => s.id === subareaId);
}

export function getAllSubAreas(): SubArea[] {
  return singaporeAreas.flatMap(region =>
    region.districts.flatMap(district => district.subareas)
  );
}

export function getAreaFromUrl(regionId: string, districtId?: string, subareaId?: string) {
  if (subareaId) {
    return getSubAreaById(regionId, districtId || '', subareaId);
  }
  if (districtId) {
    return getDistrictById(regionId, districtId);
  }
  return getRegionById(regionId);
}
