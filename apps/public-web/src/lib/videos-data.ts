export interface FeaturedVideo {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  watchUrl: string;
}

/**
 * Curated picks from the official "Uzbekistan railways" YouTube channel
 * (https://www.youtube.com/@uzrailwaysuz). Titles/thumbnails fetched live
 * via YouTube's oEmbed endpoint. Update this list by hand when swapping
 * in newer videos — there's no backend field for this yet (see
 * PublicArticleCard.video_url in public-types.ts for the future path).
 */
export const featuredVideos: FeaturedVideo[] = [
  {
    id: "y455HkhB6-g",
    title:
      "Xitoy—Qirg‘iziston—O‘zbekiston temiryo‘l magistrali – Yevrosiyoga yangi yo‘l",
    channel: "Uzbekistan railways",
    thumbnailUrl:
      "https://i.ytimg.com/vi/y455HkhB6-g/hqdefault.jpg",
    watchUrl: "https://youtu.be/y455HkhB6-g",
  },
  {
    id: "AMGr9Zi8Ups",
    title:
      "“O‘TY” AJda 2026-yilning I-choragi korrupsiyaga qarshi kurashish tizimining amal qilishi HISOBOTI",
    channel: "Uzbekistan railways",
    thumbnailUrl:
      "https://i.ytimg.com/vi/AMGr9Zi8Ups/hqdefault.jpg",
    watchUrl: "https://youtu.be/AMGr9Zi8Ups",
  },
  {
    id: "9HvpAj1ANds",
    title: "Mening kasbim – mening faxrim! Raximov Aziz",
    channel: "Uzbekistan railways",
    thumbnailUrl:
      "https://i.ytimg.com/vi/9HvpAj1ANds/hqdefault.jpg",
    watchUrl: "https://youtu.be/9HvpAj1ANds",
  },
  {
    id: "jV7iQbYaTXM",
    title: "SEVIMLI | Temir yo‘l sohasidagi islohotlar",
    channel: "Uzbekistan railways",
    thumbnailUrl:
      "https://i.ytimg.com/vi/jV7iQbYaTXM/hqdefault.jpg",
    watchUrl: "https://youtu.be/jV7iQbYaTXM",
  },
  {
    id: "-iz8jzMz3as",
    title:
      "Mening kasbim – mening faxrim! Otaniyozov Begijon",
    channel: "Uzbekistan railways",
    thumbnailUrl:
      "https://i.ytimg.com/vi/-iz8jzMz3as/hqdefault.jpg",
    watchUrl: "https://youtu.be/-iz8jzMz3as",
  },
];
