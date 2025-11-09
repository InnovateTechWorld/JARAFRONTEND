
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
  Film,
  CreditCard,
  BarChart3,
  ArrowRight,
  Star,
  DollarSign,
  Upload,
  Smartphone,
  Globe,
  Shield,
} from "lucide-react";

export function Home() {
  const features = [
    {
      icon: Film,
      title: "Movie Upload & Management",
      description:
        "Easily upload your movies and manage your entire film library with our intuitive dashboard.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment Options",
      description:
        "Accept payments via credit cards, bank transfers, cryptocurrency, and mobile money worldwide.",
    },
    {
      icon: Smartphone,
      title: "Mobile Access Codes",
      description:
        "Generate secure access codes for movie rentals that work seamlessly with mobile apps.",
    },
    {
      icon: BarChart3,
      title: "Revenue Analytics",
      description:
        "Track your movie performance, earnings, and audience engagement with detailed insights.",
    },
    {
      icon: Globe,
      title: "Global Distribution",
      description:
        "Share your movies worldwide with customizable pricing and multi-currency support.",
    },
    {
      icon: Shield,
      title: "Secure & Protected",
      description:
        "Your content is protected with enterprise-grade security and copyright management.",
    },
  ];

  const testimonials = [
    {
      name: "David Kim",
      role: "Independent Filmmaker",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      content:
        "Jara made it so easy to rent my documentary worldwide. The flexible payment options and access codes work perfectly!",
      rating: 5,
    },
    {
      name: "Maria Santos",
      role: "Short Film Director",
      image:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      content:
        "Finally, a platform that understands filmmakers! Upload, price, and distribute my movies globally with just a few clicks.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Video Content Creator",
      image:
        "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      content:
        "The revenue analytics are incredible. I can see exactly how my movies are performing and optimize my pricing strategy.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "5K+", label: "Filmmakers" },
    { value: "$1M+", label: "Movie Revenue" },
    { value: "100+", label: "Movies Rented" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-50 rounded-md bg-white px-3 py-1 text-sm text-red-600 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        Skip to content
      </a>
      {/* Hero Section */}
      <section
        id="main-content"
        className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50"
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                <Film className="w-4 h-4" />
                <span>Movie Rental Platform for Filmmakers</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Share Your Movies Worldwide with{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Jara
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your films, set rental prices, and reach global audiences.
              Accept payments through cards, crypto, and mobile money with
              secure access codes for seamless viewing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/auth" aria-label="Start creating an account">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 focus-visible:ring-2 focus-visible:ring-red-500 focus:outline-none"
                >
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth" aria-label="Sign in to your account">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 focus-visible:ring-2 focus-visible:ring-red-500 focus:outline-none"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered design to global payments, we've got every aspect
              of creator monetization covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} padding="lg" hover className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Start Earning from Your Movies Today
            </h2>
            <p className="text-xl text-gray-600">
              Upload, price, and distribute your films globally in just three
              simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Movie",
                description:
                  "Upload your film to our secure platform and add compelling descriptions and cover images.",
                icon: Upload,
              },
              {
                step: "02",
                title: "Set Your Price",
                description:
                  "Choose your rental price and payment methods - cards, crypto, or mobile money.",
                icon: DollarSign,
              },
              {
                step: "03",
                title: "Share & Earn",
                description:
                  "Share your movie page and start earning as viewers rent and watch your content.",
                icon: Globe,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-red-600 border-2 border-red-200">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community of creators has to say about Jara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} padding="lg" hover>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Share Your Movies Worldwide?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join filmmakers who are earning from their movies. Upload, price,
            and distribute your films globally with flexible payment options.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth" aria-label="Start uploading your movie">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 bg-white text-red-600 border-white hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus:outline-none"
              >
                Start Uploading Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-red-200 text-sm mt-6">
            No credit card required • Free forever plan • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Jara</span>
            </div>

            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Jara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
