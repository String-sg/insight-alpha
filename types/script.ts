export interface PodcastScript {
  podcastId: string; // links to Podcast.id
  title: string; // script title (usually same as podcast title)
  content: string; // full script text
  language?: string; // optional language code (e.g., 'en', 'es', 'zh')
}