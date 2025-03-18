export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  releaseYear: number;
  genres: string[];
  ageRating: string;
  videoUrl: string;
  downloadable: boolean;
  isDownloaded?: boolean;
  downloadProgress?: number;
  downloadSize?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export const FEATURED_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Cosmos: A Spacetime Odyssey',
    description: 'An exploration of our discovery of the laws of nature and coordinates in space and time.',
    thumbnail: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1000',
    duration: '45m',
    releaseYear: 2014,
    genres: ['Documentary', 'Science', 'Space'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    downloadable: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Planet Earth II',
    description: 'Wildlife documentary series with David Attenborough.',
    thumbnail: 'https://images.unsplash.com/photo-1552799446-159ba9523315?q=80&w=1000',
    duration: '50m',
    releaseYear: 2016,
    genres: ['Documentary', 'Nature', 'Wildlife'],
    ageRating: 'G',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    downloadable: true,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Our Planet',
    description: 'Documentary focusing on the preservation of Earth and its animal inhabitants.',
    thumbnail: 'https://images.unsplash.com/photo-1572016430487-dcfb05c39901?q=80&w=1000',
    duration: '48m',
    releaseYear: 2019,
    genres: ['Documentary', 'Nature', 'Environment'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    downloadable: true,
    isFeatured: true,
  },
];

export const TRENDING_VIDEOS: Video[] = [
  {
    id: '4',
    title: 'The Blue Planet',
    description: 'Explores the deepest parts of the ocean, revealing exotic marine life.',
    thumbnail: 'https://images.unsplash.com/photo-1498330177096-689e3fb901ca?q=80&w=1000',
    duration: '42m',
    releaseYear: 2001,
    genres: ['Documentary', 'Nature', 'Ocean'],
    ageRating: 'G',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    downloadable: true,
    isTrending: true,
  },
  {
    id: '5',
    title: 'Frozen Planet',
    description: 'Documentary series focusing on life and the environment in both the Arctic and Antarctic.',
    thumbnail: 'https://images.unsplash.com/photo-1518134346374-184f9d21cea2?q=80&w=1000',
    duration: '46m',
    releaseYear: 2011,
    genres: ['Documentary', 'Nature', 'Arctic'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    downloadable: true,
    isTrending: true,
  },
  {
    id: '6',
    title: 'Night on Earth',
    description: 'Using the latest camera technology, this documentary reveals the behavior of wildlife after dark.',
    thumbnail: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1000',
    duration: '48m',
    releaseYear: 2020,
    genres: ['Documentary', 'Nature', 'Wildlife'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    downloadable: true,
    isTrending: true,
  },
];

export const ALL_VIDEOS: Video[] = [
  ...FEATURED_VIDEOS,
  ...TRENDING_VIDEOS,
  {
    id: '7',
    title: 'The Hunt',
    description: 'Documentary following predators and their prey in the wild.',
    thumbnail: 'https://images.unsplash.com/photo-1526631310638-79a2c5924247?q=80&w=1000',
    duration: '50m',
    releaseYear: 2015,
    genres: ['Documentary', 'Nature', 'Wildlife'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    downloadable: true,
  },
  {
    id: '8',
    title: 'Africa',
    description: 'Explore the wonders and challenges of wildlife across Africa.',
    thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000',
    duration: '48m',
    releaseYear: 2013,
    genres: ['Documentary', 'Nature', 'Wildlife'],
    ageRating: 'G',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    downloadable: true,
  },
  {
    id: '9',
    title: 'Seven Worlds, One Planet',
    description: 'Documentary focusing on the unique wildlife of each continent.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000',
    duration: '52m',
    releaseYear: 2019,
    genres: ['Documentary', 'Nature', 'Wildlife'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    downloadable: true,
  },
  {
    id: '10',
    title: 'Wild Alaska',
    description: 'Documentary exploring the harsh wilderness of Alaska.',
    thumbnail: 'https://images.unsplash.com/photo-1531002177377-549eb3e3e12b?q=80&w=1000',
    duration: '44m',
    releaseYear: 2018,
    genres: ['Documentary', 'Nature', 'Wildlife'],
    ageRating: 'PG',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    downloadable: true,
  },
]; 