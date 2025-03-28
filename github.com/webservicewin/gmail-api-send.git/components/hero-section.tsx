import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16 sm:py-24">
      <div className="absolute inset-0 hero-gradient opacity-60"></div>

      {/* Removed SVG pattern completely */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 sm:block lg:w-1/3 bg-blue-50/30 dark:bg-blue-900/10"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-xl">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 pr-2 text-blue-700 dark:text-blue-300 mb-6">
            <div className="rounded-full bg-blue-600 dark:bg-blue-500 p-1 text-white">
              <Mail className="h-4 w-4" />
            </div>
            <span className="ml-1 text-sm font-medium">Batch Email Sender</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Send multiple emails</span>
            <span className="block text-blue-600 dark:text-blue-400">efficiently with Gmail</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300">
            Streamline your email campaigns by sending multiple emails in a single batch request using the Gmail API.
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" className="rounded-full">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

