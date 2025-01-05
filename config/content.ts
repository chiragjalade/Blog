export const heroItems = [
  {
    id: "sora",
    title: "Sora",
    description: "Bring your imagination to life from text, image, or video.",
    background: "/placeholder.svg?height=800&width=1600",
    link: "/sora",
  },
  {
    id: "chatgpt",
    title: "ChatGPT",
    description: "Get started with our most advanced AI assistant.",
    background: "/placeholder.svg?height=800&width=1600",
    link: "/chatgpt",
  },
]

export const products = [
  {
    id: "sora",
    title: "Sora is here",
    content: "Bring your imagination to life with Sora, our new text-to-video model",
    date: "Dec 9, 2024",
  },
  {
    id: "chatgpt-pro",
    title: "Introducing ChatGPT Pro",
    content: "Get priority access, faster response times, and exclusive features",
    date: "Dec 5, 2024",
  },
  {
    id: "chatgpt-search",
    title: "Introducing ChatGPT search",
    content: "Enhance your search experience with AI-powered results",
    date: "Nov 15, 2024",
  },
  {
    id: "canvas",
    title: "Introducing canvas",
    content: "A new way to write and code with ChatGPT",
    date: "Oct 20, 2024",
  },
  {
    id: "gpt-4-turbo",
    title: "GPT-4 Turbo",
    content: "Experience the next level of language understanding and generation",
    date: "Sep 5, 2024",
  },
  {
    id: "dalle-3",
    title: "DALL·E 3",
    content: "Create stunning images with our most advanced image generation model",
    date: "Aug 1, 2024",
  },
  {
    id: "api",
    title: "API",
    content: "Integrate OpenAI's powerful models into your applications",
    date: "Jul 10, 2024",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    content: "Tailored AI solutions for your business needs",
    date: "Jun 1, 2024",
  },
]

export const research = [
  {
    id: "safety-alignment-1",
    title: "Safety & Alignment",
    content: "Our latest research on AI safety and alignment",
    date: "Dec 5, 2024",
  },
  {
    id: "video-models",
    title: "Video generation models as world simulators",
    content: "Understanding how video models simulate physical worlds",
    date: "Feb 15, 2024",
  },
  {
    id: "safety-alignment-2",
    title: "Safety & Alignment",
    content: "Advancements in ensuring AI systems align with human values",
    date: "Nov 30, 2024",
  },
  {
    id: "research-1",
    title: "Research",
    content: "Exploring the frontiers of artificial intelligence",
    date: "Dec 5, 2024",
  },
  {
    id: "research-2",
    title: "Research",
    content: "Breakthroughs in natural language processing and understanding",
    date: "Sep 12, 2024",
  },
  {
    id: "safety-alignment-3",
    title: "Safety & Alignment",
    content: "Developing robust and reliable AI systems",
    date: "Aug 28, 2024",
  },
  {
    id: "research-3",
    title: "Research",
    content: "Advancements in multimodal learning and generation",
    date: "Aug 15, 2024",
  },
  {
    id: "safety-alignment-4",
    title: "Safety & Alignment",
    content: "Ethical considerations in AI development and deployment",
    date: "Jul 30, 2024",
  },
]

export const allContent = [
  ...heroItems.map(item => ({ ...item, type: 'Hero' as const })),
  ...products.map(item => ({ ...item, type: 'Product' as const })),
  ...research.map(item => ({ ...item, type: 'Research' as const })),
]

