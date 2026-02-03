import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, ChevronRight, Star, Truck, RefreshCcw, ShieldCheck, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { blink } from '@/lib/blink'
import { useCart } from '@/hooks/useCart'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await blink.db.products.list({
          where: { slug }
        })
        if (products.length > 0) {
          setProduct(products[0])
          setSelectedColor('Default')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-2xl animate-pulse">Loading Product...</div>
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>

  const sizes = ['7', '8', '9', '10', '11', '12']
  const colors = ['Default', 'Black', 'White', 'Cloud Grey']

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    addToCart(product.id, 1, selectedSize, selectedColor || 'Default')
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square rounded-3xl overflow-hidden bg-secondary/50 shadow-2xl"
            >
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary/50 cursor-pointer hover:ring-2 ring-primary transition-all">
                  <img 
                    src={product.image_url} 
                    alt={`${product.name} view ${i}`} 
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">(128 Reviews)</span>
              </div>
              <h1 className="font-serif text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
              <p className="text-3xl font-bold">${product.price}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Colors */}
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase mb-4 flex justify-between">
                <span>Color</span>
                <span className="text-muted-foreground font-normal">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-primary scale-110 shadow-lg' : 'border-transparent bg-secondary'}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${color === 'Black' ? 'bg-black' : color === 'White' ? 'bg-white border' : color === 'Cloud Grey' ? 'bg-zinc-400' : 'bg-orange-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold tracking-widest uppercase">Select Size (US)</h3>
                <button className="text-xs font-bold uppercase underline underline-offset-4 hover:text-muted-foreground">Size Guide</button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 flex items-center justify-center rounded-xl border-2 font-bold transition-all ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground shadow-lg' : 'border-secondary hover:border-primary/50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-14 text-lg font-bold"
              >
                <ShoppingBag className="mr-2" size={20} /> Add to Bag
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-14 h-14 rounded-full border-2 hover:bg-destructive hover:border-destructive hover:text-white transition-colors"
              >
                <Heart size={20} />
              </Button>
            </div>

            {/* Extra Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-secondary">
              <div className="flex flex-col items-center text-center">
                <Truck className="mb-2 opacity-60" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Free Shipping</p>
                <p className="text-[9px] text-muted-foreground mt-1">Orders over $150</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCcw className="mb-2 opacity-60" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest">30-Day Returns</p>
                <p className="text-[9px] text-muted-foreground mt-1">Hassle-free process</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="mb-2 opacity-60" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Secure Payments</p>
                <p className="text-[9px] text-muted-foreground mt-1">PCI Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
