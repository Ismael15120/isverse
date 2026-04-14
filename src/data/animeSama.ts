export interface AnimeSamaMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  media_type: 'movie';
  overview: string;
  isAnimeSama: boolean;
}

export const animeSamaCinema: AnimeSamaMovie[] = [
  {
    id: 378064,
    title: "A Silent Voice",
    poster_path: "/tuFa9CNVP04vU6G9YF9S76uEvvW.jpg",
    backdrop_path: "/5lAM096Ym8pYv2mZonm6997pXTI.jpg",
    vote_average: 8.4,
    media_type: 'movie',
    overview: "Shoya Ishida, un lycéen autrefois harceleur, tente de se racheter auprès de Shoko Nishimiya, une jeune fille sourde qu'il a tourmentée au primaire.",
    isAnimeSama: true
  },
  {
    id: 149,
    title: "AKIRA",
    poster_path: "/neZ0qH7st21uepBrA9ZpS7BKUMc.jpg",
    backdrop_path: "/7Vs6ub6yv9u0SshjN8T6S9m8iT0.jpg",
    vote_average: 8.0,
    media_type: 'movie',
    overview: "En 2019, 31 ans après la Troisième Guerre mondiale, Néo-Tokyo est en proie à la corruption et à la violence. Tetsuo, un jeune motard, développe des pouvoirs télékinétiques dévastateurs.",
    isAnimeSama: true
  },
  {
    id: 372058,
    title: "Your Name.",
    poster_path: "/q719js0oV79szZHiSUE3VVkpST2.jpg",
    backdrop_path: "/vVpB799S9m_f69_8T9_6_S9m8iT.jpg", // Needs valid path
    vote_average: 8.5,
    media_type: 'movie',
    overview: "Mitsuha et Taki sont deux adolescents qui vivent des vies totalement différentes. Un jour, ils commencent à échanger leurs corps de manière inexpliquée.",
    isAnimeSama: true
  },
  {
    id: 504253,
    title: "I Want to Eat Your Pancreas",
    poster_path: "/6rIn39l9W88o7Nsc66XQhF8InW.jpg",
    backdrop_path: "/6rIn39l9W88o7Nsc66XQhF8InW.jpg",
    vote_average: 8.2,
    media_type: 'movie',
    overview: "Un lycéen introverti trouve le journal d'une de ses camarades de classe, Sakura, et découvre qu'elle souffre d'une maladie pancréatique terminale.",
    isAnimeSama: true
  },
  {
    id: 10494,
    title: "Perfect Blue",
    poster_path: "/86E6cAtf3l9C2r9E31m3n6V0a0L.jpg",
    backdrop_path: "/86E6cAtf3l9C2r9E31m3n6V0a0L.jpg",
    vote_average: 8.3,
    media_type: 'movie',
    overview: "Mima, une idole pop, décide de quitter son groupe pour devenir actrice. Sa vie commence à sombrer dans l'horreur lorsqu'elle est hantée par son passé et un fan obsessionnel.",
    isAnimeSama: true
  },
  {
    id: 13903,
    title: "5 Centimeters Per Second",
    poster_path: "/6Zf0J7K6w7XG6L4V5X6vX5X6vX5.jpg",
    backdrop_path: "/6Zf0J7K6w7XG6L4V5X6vX5X6vX5.jpg",
    vote_average: 7.7,
    media_type: 'movie',
    overview: "Trois moments de la vie d'un garçon nommé Takaki, explorant la distance et la solitude qui s'installent entre les gens au fil du temps.",
    isAnimeSama: true
  }
];
