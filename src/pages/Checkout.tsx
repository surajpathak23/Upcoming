import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { blink } from '@/lib/blink'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to complete checkout')
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create Order
      const orderId = `ord_${Math.random().toString(36).substr(2, 9)}`
      await blink.db.orders.create({
        id: orderId,
        userId: user.id,
        totalAmount: total,
        status: 'paid',
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`
      })

      // Create Order Items
      await blink.db.order_items.createMany(items.map(item => ({
        id: `oi_${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.price || 0,
        size: item.size,
        color: item.color
      })))

      await clearCart()
      setIsSuccess(true)
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass p-12 rounded-3xl text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground mb-8">
            Your order has been placed successfully. We'll send you a confirmation email with your order details.
          </p>
          <Button asChild className="w-full rounded-full h-12">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Button asChild variant="ghost" size="sm" className="mb-4 hover:bg-secondary">
            <Link to="/cart"><ChevronLeft className="mr-2" size={16} /> Back to Bag</Link>
          </Button>
          <h1 className="font-serif text-4xl font-bold tracking-tighter uppercase">Checkout</h1>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Contact Info */}
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b border-secondary">01. Contact Information</h3>
              <div className="space-y-4">
                <Input 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl"
                />
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b border-secondary">02. Shipping Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input 
                  name="firstName"
                  placeholder="First Name" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl"
                />
                <Input 
                  name="lastName"
                  placeholder="Last Name" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <Input 
                name="address"
                placeholder="Street Address" 
                value={formData.address}
                onChange={handleInputChange}
                required
                className="h-12 rounded-xl mb-4"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="city"
                  placeholder="City" 
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl"
                />
                <Input 
                  name="zipCode"
                  placeholder="ZIP / Postal Code" 
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="h-12 rounded-xl"
                />
              </div>
            </section>

            {/* Payment Info */}
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 pb-2 border-b border-secondary">03. Payment Method</h3>
              <div className="bg-secondary/20 p-6 rounded-2xl mb-6">
                <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest mb-6">
                  <CreditCard size={18} />
                  <span>Credit Card</span>
                </div>
                <div className="space-y-4">
                  <Input 
                    name="cardNumber"
                    placeholder="Card Number" 
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="h-12 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      name="expiry"
                      placeholder="MM / YY" 
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      className="h-12 rounded-xl"
                    />
                    <Input 
                      name="cvv"
                      placeholder="CVV" 
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-xs text-muted-foreground uppercase tracking-widest">
                <ShieldCheck size={16} className="text-green-500" />
                <span>Your payment is secure and encrypted.</span>
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-3xl sticky top-24">
              <h3 className="text-xl font-serif font-bold mb-6 uppercase tracking-tighter">Your Order</h3>
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-secondary/50">
                      <img src={item.product?.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold line-clamp-1">{item.product?.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Qty: {item.quantity} | Size: {item.size}</p>
                      <p className="text-sm font-bold mt-1">${(Number(item.product?.price || 0) * Number(item.quantity)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 pt-6 border-t border-secondary">
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground font-bold">{total > 150 ? 'FREE' : '$15.00'}</span>
                </div>
                <div className="flex justify-between text-sm pt-4 border-t border-secondary font-bold uppercase tracking-tighter">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl">${(total > 150 ? total * 1.08 : (total + 15) * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-full font-bold uppercase tracking-widest"
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
