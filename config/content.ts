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
    description: "Experience the future of video creation with Sora, our groundbreaking text-to-video AI model.",
    gradient: "linear-gradient(to bottom right, #9333ea, #6b21a8)",
    link: "/products/sora"
  },
  {
    id: "chatgpt-pro",
    title: "Introducing ChatGPT Pro",
    content: "Get priority access, faster response times, and exclusive features",
    date: "Dec 5, 2024",
    description: "Upgrade your AI experience with ChatGPT Pro, offering enhanced capabilities and premium support.",
    gradient: "linear-gradient(to bottom right, #fbbf24, #d97706)",
    link: "/products/chatgpt-pro"
  },
  {
    id: "chatgpt-search",
    title: "Introducing ChatGPT search",
    content: "Enhance your search experience with AI-powered results",
    date: "Nov 15, 2024",
    description: "Search smarter with ChatGPT search, leveraging AI for more relevant and insightful results.",
    gradient: "linear-gradient(to bottom right, #22c55e, #16a34a)",
    link: "/products/chatgpt-search"
  },
  {
    id: "canvas",
    title: "Introducing canvas",
    content: "A new way to write and code with ChatGPT",
    date: "Oct 20, 2024",
    description: "Experience seamless writing and coding with our innovative canvas feature, powered by ChatGPT.",
    gradient: "linear-gradient(to bottom right, #1e3a8a, #1a202c)",
    link: "/products/canvas"
  },
  {
    id: "gpt-4-turbo",
    title: "GPT-4 Turbo",
    content: "Experience the next level of language understanding and generation",
    date: "Sep 5, 2024",
    description: "Unlock unparalleled language capabilities with GPT-4 Turbo, our most advanced language model yet.",
    gradient: "linear-gradient(to bottom right, #a78bfa, #8167d7)",
    link: "/products/gpt-4-turbo"
  },
  {
    id: "dalle-3",
    title: "DALL·E 3",
    content: "Create stunning images with our most advanced image generation model",
    date: "Aug 1, 2024",
    description: "Unleash your creativity with DALL·E 3, generating breathtaking images from your text prompts.",
    gradient: "linear-gradient(to bottom right, #f97316, #e36414)",
    link: "/products/dalle-3"
  },
  {
    id: "api",
    title: "API",
    content: "Integrate OpenAI's powerful models into your applications",
    date: "Jul 10, 2024",
    description: "Seamlessly integrate OpenAI's powerful models into your applications with our robust and versatile API.",
    gradient: "linear-gradient(to bottom right, #0ea5e9, #0284c7)",
    link: "/products/api"
  },
  {
    id: "enterprise",
    title: "Enterprise",
    content: "Tailored AI solutions for your business needs",
    date: "Jun 1, 2024",
    description: "Empower your business with tailored AI solutions designed to meet your specific needs and drive growth.",
    gradient: "linear-gradient(to bottom right, #4ade80, #22c55e)",
    link: "/products/enterprise"
  },
]

export const research = [
  {
    id: "safety-alignment-1",
    title: "Safety & Alignment",
    content: "Our latest research on AI safety and alignment",
    date: "Dec 5, 2024",
    description: "Explore our cutting-edge research on ensuring AI systems are safe and aligned with human values.",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    link: "/research/safety-alignment-dec-5"
  },
  {
    id: "video-models",
    title: "Video generation models as world simulators",
    content: "Understanding how video models simulate physical worlds",
    date: "Feb 15, 2024",
    description: "Dive into our research on how video generation models can simulate complex physical environments.",
    gradient: "linear-gradient(to bottom right, #60a5fa, #3b82f6)",
    link: "/research/video-models"
  },
  {
    id: "safety-alignment-2",
    title: "Safety & Alignment",
    content: "Advancements in ensuring AI systems align with human values",
    date: "Nov 30, 2024",
    description: "Learn about our progress in aligning AI systems with human values and ethical considerations.",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    link: "/research/safety-alignment-nov-30"
  },
  {
    id: "research-1",
    title: "Research",
    content: "Exploring the frontiers of artificial intelligence",
    date: "Dec 5, 2024",
    description: "Discover our latest breakthroughs and explorations in the field of artificial intelligence.",
    gradient: "linear-gradient(to bottom right, #a78bfa, #8167d7)",
    link: "/research/research-dec-5"
  },
  {
    id: "research-2",
    title: "Research",
    content: "Breakthroughs in natural language processing and understanding",
    date: "Sep 12, 2024",
    description: "Explore our advancements in natural language processing and understanding.",
    gradient: "linear-gradient(to bottom right, #a78bfa, #8167d7)",
    link: "/research/research-sep-12"
  },
  {
    id: "safety-alignment-3",
    title: "Safety & Alignment",
    content: "Developing robust and reliable AI systems",
    date: "Aug 28, 2024",
    description: "Learn about our methods for developing robust and reliable AI systems.",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    link: "/research/safety-alignment-aug-28"
  },
  {
    id: "research-3",
    title: "Research",
    content: "Advancements in multimodal learning and generation",
    date: "Aug 15, 2024",
    description: "Discover our progress in multimodal learning and generation.",
    gradient: "linear-gradient(to bottom right, #a78bfa, #8167d7)",
    link: "/research/research-aug-15"
  },
  {
    id: "safety-alignment-4",
    title: "Safety & Alignment",
    content: "Ethical considerations in AI development and deployment",
    date: "Jul 30, 2024",
    description: "Explore the ethical considerations in AI development and deployment.",
    gradient: "linear-gradient(to bottom right, #f87171, #dc2626)",
    link: "/research/safety-alignment-jul-30"
  },
]

export const allContent = [
  ...heroItems.map(item => ({ ...item, type: 'Hero' as const })),
  ...products.map(item => ({ ...item, type: 'Product' as const })),
  ...research.map(item => ({ ...item, type: 'Research' as const })),
]

