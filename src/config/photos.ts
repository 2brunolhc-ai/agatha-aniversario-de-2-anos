export type PhotoConfig = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition?: string;
  featured?: boolean;
};

const base = "/images/agatha";

export const heroPhoto: PhotoConfig = {
  src: `${base}/foto-principal-bebe.png`,
  alt: "Ágatha recém-nascida dormindo com vestido lilás",
  width: 900,
  height: 1600,
  objectPosition: "50% 38%",
};

export const playgroundHeroPhoto: PhotoConfig = {
  src: `${base}/foto-principal-oficial.png`,
  alt: "Ágatha sorrindo no playground, com vestido azul e laço de borboleta",
  width: 1220,
  height: 1449,
  objectPosition: "50% 50%",
};

export const secondHeroPhoto: PhotoConfig = {
  src: `${base}/foto-principal-vestido-vermelho.png`,
  alt: "Ágatha sorrindo com vestido vermelho e as mãos no rosto",
  width: 1576,
  height: 1406,
  objectPosition: "50% 50%",
};

export const heroPhotos: PhotoConfig[] = [heroPhoto, playgroundHeroPhoto, secondHeroPhoto];

export const invitationReference: PhotoConfig = {
  src: "/images/referencias/convite-oficial.png",
  alt: "Convite oficial dos 2 aninhos da Ágatha com passarinhos, flores e casinhas",
  width: 1024,
  height: 1536,
};

export const timelinePhotos: Array<PhotoConfig & { label: string }> = [
  {
    src: `${base}/05_1000085426.jpg`,
    alt: "Ágatha bebê sorrindo",
    width: 691,
    height: 1536,
    objectPosition: "50% 45%",
    label: "Nosso primeiro encontro",
  },
  {
    src: `${base}/14_1000062731.jpg`,
    alt: "Ágatha bebê sorrindo em um passeio",
    width: 1152,
    height: 1536,
    objectPosition: "50% 38%",
    label: "Primeiros sorrisos",
  },
  {
    src: `${base}/17_1000059940.jpg`,
    alt: "Ágatha brincando em seu triciclo",
    width: 1152,
    height: 1536,
    objectPosition: "50% 42%",
    label: "Primeiras aventuras",
  },
  {
    src: `${base}/04_1000089167.jpg`,
    alt: "Ágatha em pé sorrindo ao ar livre",
    width: 1152,
    height: 1536,
    objectPosition: "50% 36%",
    label: "Nosso passarinho cresceu",
  },
  {
    ...playgroundHeroPhoto,
    label: "Agora são 2 aninhos",
  },
];

export const galleryPhotos: PhotoConfig[] = [
  { ...heroPhoto, featured: true },
  {
    src: `${base}/02_1000092089.jpg`,
    alt: "Ágatha sorrindo entre a mamãe e o papai",
    width: 1536,
    height: 1152,
    objectPosition: "50% 42%",
    featured: true,
  },
  {
    src: `${base}/04_1000089167.jpg`,
    alt: "Ágatha sorrindo ao ar livre com roupa verde",
    width: 1152,
    height: 1536,
    objectPosition: "50% 36%",
  },
  {
    src: `${base}/08_1000072075.jpg`,
    alt: "Ágatha no colo da mamãe ao lado do papai no jardim",
    width: 1152,
    height: 1536,
    objectPosition: "50% 38%",
  },
  {
    src: `${base}/09_1000072065.jpg`,
    alt: "Ágatha sorrindo e brincando em casa",
    width: 1152,
    height: 1536,
    objectPosition: "50% 36%",
  },
  {
    src: `${base}/11_1000069114.jpg`,
    alt: "Ágatha com a mamãe e o papai em uma celebração de Natal",
    width: 1152,
    height: 1536,
    objectPosition: "50% 40%",
  },
  {
    src: `${base}/13_1000064933.jpg`,
    alt: "Ágatha sorrindo com roupa vermelha",
    width: 1152,
    height: 1536,
    objectPosition: "50% 36%",
  },
  {
    src: `${base}/14_1000062731.jpg`,
    alt: "Ágatha bebê sorrindo em um passeio",
    width: 1152,
    height: 1536,
    objectPosition: "50% 38%",
  },
  {
    src: `${base}/17_1000059940.jpg`,
    alt: "Ágatha brincando em seu triciclo roxo",
    width: 1152,
    height: 1536,
    objectPosition: "50% 42%",
  },
  {
    src: `${base}/18_1000059939.jpg`,
    alt: "Ágatha sorrindo em seu triciclo",
    width: 1152,
    height: 1536,
    objectPosition: "50% 40%",
  },
  {
    src: `${base}/19_ed8386d7-4642-4903-8bd2-16e68016d64b-1_all_10014.jpg`,
    alt: "Ágatha no colo da mamãe em um momento carinhoso",
    width: 1152,
    height: 1536,
    objectPosition: "50% 38%",
  },
  {
    src: `${base}/21_1000053886.webp`,
    alt: "Ágatha recém-nascida com a mamãe e o papai",
    width: 1536,
    height: 1536,
    objectPosition: "50% 50%",
    featured: true,
  },
];

export const familyPhoto: PhotoConfig = {
  src: `${base}/02_1000092089.jpg`,
  alt: "Ágatha sorrindo com a mamãe e o papai",
  width: 1536,
  height: 1152,
  objectPosition: "50% 43%",
};
