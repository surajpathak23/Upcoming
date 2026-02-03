import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, SlidersHorizontal, Search, Grid2X2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { blink } from '@/lib/blink'
import { useCart } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart } = useCart()

  const currentCategory = searchParams.get('category') || 'all'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [cats, prods] = await Promise.all([
          blink.db.categories.list(),
          blink.db.products.list({
            where: currentCategory !== 'all' 
              ? { category_id: (await blink.db.categories.list({ where: { slug: currentCategory } }))[0]?.id }
              : undefined
          })
        ])
        setCategories(cats)
        setProducts(prods)
      } catch (error) {
        console.error('Error fetching shop data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentCategory])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-secondary/30 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl font-bold mb-4 uppercase tracking-tighter">
            {currentCategory === 'all' ? 'Collection' : currentCategory.replace('-', ' ')}
          </h1>
          <nav className="flex space-x-2 text-sm text-muted-foreground uppercase tracking-widest font-bold">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shop</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0 space-y-10">
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Find your pair..." 
                  className="pl-10 rounded-full border-secondary-foreground/10 focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`text-sm transition-colors ${currentCategory === 'all' ? 'font-bold text-foreground underline decoration-2 underline-offset-8' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    All Collection
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setSearchParams({ category: cat.slug })}
                      className={`text-sm transition-colors ${currentCategory === cat.slug ? 'font-bold text-foreground underline decoration-2 underline-offset-8' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6">Sort By</h3>
              <select className="w-full bg-transparent border-b-2 border-secondary p-2 text-sm focus:outline-none focus:border-primary transition-colors">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Bestselling</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-secondary">
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> products
              </p>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-foreground"><Grid2X2 size={18} /></Button>
                <Button variant="ghost" size="icon" className="text-foreground/40 hover:text-foreground"><List size={18} /></Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-secondary animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-300"
                    >
                      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-secondary/50">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                          Add to Bag
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                <Button onClick={() => { setSearchParams({}); setSearchQuery(''); }}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
