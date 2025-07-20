// Mock anime data (will be updated by generator)
let animeData = [
  {
    id: 1,
    title: "Demon Slayer",
    image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    synopsis: "Un joven lucha contra demonios para salvar a su hermana.",
    episodes: [
      { number: 1, title: "Episodio 1", url: "mpv://example.com/demon-slayer-ep1.mp4" }
    ]
  }
];

// Mock latest episodes
let latestEpisodes = [
  { anime: "Demon Slayer", episode: animeData[0].episodes[0] }
];
