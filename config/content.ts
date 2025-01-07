interface BaseItem {
  id: string
  title: string
  content: string
  date: string
  gradient: string
}

export interface Product extends BaseItem {
  type: 'Product'
}

export interface ResearchItem extends BaseItem {
  type: 'Research'
}

export const products: Product[] = [
  {
    id: "sora",
    title: "Sora is here",
    content: "Bring your imagination to life with Sora, our new text-to-video model",
    date: "Dec 9, 2024",
    gradient: "linear-gradient(to bottom right, #9333ea, #6b21a8)",
    type: 'Product'
  },
  {
    id: "chatgpt-pro",
    title: "Introducing ChatGPT Pro",
    content: "Get priority access, faster response times, and exclusive features",
    date: "Dec 5, 2024",
    gradient: "linear-gradient(to bottom right, #fbbf24, #d97706)",
    type: 'Product'
  },
  {
    id: "introduction-to-perceptrons",
    title: "Introduction to Perceptrons",
    content: "The Building Blocks That Sparked an AI Revolution",
    date: "Nov 15, 2024",
    gradient: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
    type: 'Product'
  },
  {
    id: "wtf-are-gans",
    title: "WTF are GANs?",
    content: "Two Neural Networks Walk into a Bar: Understanding Generative Adversarial Networks",
    date: "Oct 20, 2024",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    type: 'Product'
  },
  {
    id: "gpt-4-turbo",
    title: "GPT-4 Turbo",
    content: "Experience the next level of language understanding and generation",
    date: "Sep 5, 2024",
    gradient: "linear-gradient(to bottom right, #4ade80, #16a34a)",
    type: 'Product'
  },
  {
    id: "dalle-3",
    title: "DALL·E 3",
    content: "Create stunning images with our most advanced image generation model",
    date: "Aug 1, 2024",
    gradient: "linear-gradient(to bottom right, #c084fc, #9333ea)",
    type: 'Product'
  },
  {
    id: "api",
    title: "API",
    content: "Integrate OpenAI's powerful models into your applications",
    date: "Jul 10, 2024",
    gradient: "linear-gradient(to bottom right, #94a3b8, #475569)",
    type: 'Product'
  },
  {
    id: "enterprise",
    title: "Enterprise",
    content: "Tailored AI solutions for your business needs",
    date: "Jun 1, 2024",
    gradient: "linear-gradient(to bottom right, #2dd4bf, #0d9488)",
    type: 'Product'
  }
]

export const research: ResearchItem[] = [
  {
    id: "safety-alignment-1",
    title: "Safety & Alignment",
    content: "Our latest research on AI safety and alignment",
    date: "Dec 5, 2024",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    type: 'Research'
  },
  {
    id: "video-models",
    title: "Video generation models as world simulators",
    content: "Understanding how video models simulate physical worlds",
    date: "Feb 15, 2024",
    gradient: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
    type: 'Research'
  },
  {
    id: "safety-alignment-2",
    title: "Safety & Alignment",
    content: "Advancements in ensuring AI systems align with human values",
    date: "Nov 30, 2024",
    gradient: "linear-gradient(to bottom right, #c084fc, #9333ea)",
    type: 'Research'
  },
  {
    id: "research-1",
    title: "Research",
    content: "Exploring the frontiers of artificial intelligence",
    date: "Dec 5, 2024",
    gradient: "linear-gradient(to bottom right, #fbbf24, #d97706)",
    type: 'Research'
  },
  {
    id: "research-2",
    title: "Research",
    content: "Breakthroughs in natural language processing and understanding",
    date: "Sep 12, 2024",
    gradient: "linear-gradient(to bottom right, #2dd4bf, #0d9488)",
    type: 'Research'
  },
  {
    id: "safety-alignment-3",
    title: "Safety & Alignment",
    content: "Developing robust and reliable AI systems",
    date: "Aug 28, 2024",
    gradient: "linear-gradient(to bottom right, #4ade80, #16a34a)",
    type: 'Research'
  },
  {
    id: "research-3",
    title: "Research",
    content: "Advancements in multimodal learning and generation",
    date: "Aug 15, 2024",
    gradient: "linear-gradient(to bottom right, #94a3b8, #475569)",
    type: 'Research'
  },
  {
    id: "safety-alignment-4",
    title: "Safety & Alignment",
    content: "Ethical considerations in AI development and deployment",
    date: "Jul 30, 2024",
    gradient: "linear-gradient(to bottom right, #f472b6, #db2777)",
    type: 'Research'
  }
]

export type ContentItem = Product | ResearchItem
export const allContent: ContentItem[] = [...products, ...research]

