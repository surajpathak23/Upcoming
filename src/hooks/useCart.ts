import { useState, useEffect, useCallback } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  size?: string
  color?: string
  product?: {
    name: string
    price: number
    imageUrl: string
  }
}

export function useCart() {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const cartItems = await blink.db.table<CartItem>('cart_items').list({
        where: { userId: user.id }
      })
      
      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(cartItems.map(async (item) => {
        const product = await blink.db.table<any>('products').get(item.productId)
        return { ...item, product }
      }))

      setItems(itemsWithProducts)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId: string, quantity: number = 1, size?: string, color?: string) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      blink.auth.login()
      return
    }

    try {
      // Check if item already exists
      const existing = items.find(i => i.productId === productId && i.size === size && i.color === color)
      
      if (existing) {
        const newQuantity = Number(existing.quantity) + quantity
        await blink.db.cart_items.update(existing.id, { quantity: newQuantity })
        setItems(prev => prev.map(i => i.id === existing.id ? { ...i, quantity: newQuantity } : i))
      } else {
        const newItem = await blink.db.cart_items.create({
          userId: user.id,
          productId,
          quantity,
          size,
          color
        })
        const product = await blink.db.products.get(productId)
        setItems(prev => [...prev, { ...newItem, product }])
      }
      toast.success('Added to cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      setItems(prev => prev.filter(i => i.id !== itemId))
      await blink.db.cart_items.delete(itemId)
    } catch (error) {
      console.error('Error removing from cart:', error)
      fetchCart() // Revert on error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    try {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
      await blink.db.cart_items.update(itemId, { quantity })
    } catch (error) {
      console.error('Error updating quantity:', error)
      fetchCart() // Revert on error
    }
  }

  const clearCart = async () => {
    if (!user) return
    try {
      setItems([])
      await blink.db.cart_items.deleteMany({ where: { userId: user.id } })
    } catch (error) {
      console.error('Error clearing cart:', error)
      fetchCart()
    }
  }

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * Number(item.quantity), 0)

  return { items, loading, addToCart, removeFromCart, updateQuantity, clearCart, total }
}
