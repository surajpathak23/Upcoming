import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blink } from '@/lib/blink'
import { useCart } from '@/hooks/useCart'
import { motion } from 'framer-motion'

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeatured = async () => {
      const products = await blink.db.products.list({
        where: { isFeatured: "1" },
        limit: 4
      })
      setFeaturedProducts(products)
    }
    fetchFeatured()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 opacity-80">
              New Collection 2024
            </span>
            <h1 className="font-serif text-6xl md:text-8xl font-bold leading-tight mb-8">
              STEP INTO <br /> THE <span className="italic">FUTURE</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-lg">
              Experience the perfect blend of high-performance engineering and avant-garde style. Crafted for those who define the path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
                <Link to="/shop">Shop Collection</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 rounded-full px-8">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Curated Styles</h2>
              <p className="text-muted-foreground">Explores our most popular categories</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Lifestyle', slug: 'lifestyle', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800' },
              { name: 'Performance', slug: 'performance', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
              { name: 'Limited Edition', slug: 'limited-edition', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800' }
            ].map((cat, i) => (
              <Link 
                key={cat.slug} 
                to={`/shop?category=${cat.slug}`}
                className="group relative h-[500px] overflow-hidden rounded-2xl"
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="font-serif text-3xl font-bold mb-2">{cat.name}</h3>
                  <div className="flex items-center text-sm font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Explore <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">The Essentials</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
              Hand-picked selections from our master craftsmen. Each pair represents our commitment to quality and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-elegant"
              >
                <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-secondary/50">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {Number(product.is_new_arrival) > 0 && (
                    <span className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full">
                      New Arrival
                    </span>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-bold">
                      <Link to={`/product/${product.slug}`} className="hover:text-muted-foreground transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="font-bold text-lg">${product.price}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {product.description}
                  </p>
                  <Button 
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    Quick Add
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg" className="rounded-full px-12 group">
              <Link to="/shop">
                View All Collection <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-8">
                Quality that speaks <br /> for itself.
              </h2>
              <div className="space-y-8">
                {[
                  { title: 'Hand-Crafted', desc: 'Every pair is meticulously built by expert artisans with decades of experience.' },
                  { title: 'Sustainable Sourcing', desc: 'We only use ethically sourced materials that minimize our environmental footprint.' },
                  { title: 'Unmatched Comfort', desc: 'Proprietary cushioning technology designed for all-day wear without compromise.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-serif text-xl font-bold">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                      <p className="text-primary-foreground/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200" 
                alt="Brand Ethos" 
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-2xl max-w-xs hidden md:block">
                <p className="font-serif text-2xl font-italic leading-tight italic">
                  "The best footwear I've ever owned. Style meets soul."
                </p>
                <p className="mt-4 text-xs font-bold tracking-widest uppercase opacity-60">
                  — Marcus Thorne, Architect
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
