import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export function Cart() {
  const { items, updateQuantity, removeFromCart, total, loading } = useCart()

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-2xl animate-pulse">Loading Cart...</div>

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-secondary/30 pt-20 pb-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold mb-4 tracking-tighter uppercase">Your Bag</h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">
            {items.length} {items.length === 1 ? 'Item' : 'Items'} in total
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-secondary">
            <ShoppingBag className="mx-auto mb-6 opacity-20" size={64} />
            <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
            <p className="text-muted-foreground mb-8">Seems like you haven't added anything to your bag yet.</p>
            <Button asChild size="lg" className="rounded-full px-12">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-6 p-6 bg-white rounded-3xl shadow-elegant group"
                  >
                    <div className="w-32 h-40 shrink-0 rounded-2xl overflow-hidden bg-secondary/50">
                      <img 
                        src={item.product?.imageUrl} 
                        alt={item.product?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-xl font-bold mb-1">{item.product?.name}</h3>
                          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                          </div>
                        </div>
                        <p className="font-bold text-lg">${item.product?.price}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center bg-secondary rounded-full p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors flex items-center text-xs font-bold uppercase tracking-widest"
                        >
                          <Trash2 size={16} className="mr-2" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass p-8 rounded-3xl sticky top-24">
                <h3 className="text-xl font-serif font-bold mb-8 uppercase tracking-tighter">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Shipping</span>
                    <span className="font-bold">{total > 150 ? 'FREE' : '$15.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span className="font-bold">${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-secondary flex justify-between">
                    <span className="font-bold text-lg uppercase tracking-widest">Total</span>
                    <span className="font-bold text-2xl tracking-tighter">${(total > 150 ? total + (total * 0.08) : total + 15 + (total * 0.08)).toFixed(2)}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-full font-bold group">
                  <Link to="/checkout">
                    Checkout Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <div className="mt-8 space-y-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">Accepted Payments</p>
                  <div className="flex justify-center gap-4 opacity-40">
                    <div className="h-6 w-10 bg-black rounded" />
                    <div className="h-6 w-10 bg-black rounded" />
                    <div className="h-6 w-10 bg-black rounded" />
                    <div className="h-6 w-10 bg-black rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
