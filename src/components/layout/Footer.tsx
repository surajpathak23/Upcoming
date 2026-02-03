import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand & Newsletter */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold tracking-tighter mb-6 block">
              SHOE LUXE
            </Link>
            <p className="text-primary-foreground/60 mb-8 text-sm leading-relaxed">
              Crafting premium footwear for the modern explorer. Quality, style, and comfort in every step.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/60">
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=new-arrivals" className="hover:text-primary-foreground transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?category=lifestyle" className="hover:text-primary-foreground transition-colors">Lifestyle</Link></li>
              <li><Link to="/shop?category=performance" className="hover:text-primary-foreground transition-colors">Performance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/60">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-primary-foreground transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="font-semibold mb-6">Newsletter</h4>
            <p className="text-sm text-primary-foreground/60 mb-6">
              Subscribe to get special offers and once-in-a-lifetime deals.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Email address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
              />
              <Button size="icon" className="shrink-0 bg-white text-black hover:bg-white/90">
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-primary-foreground/40 uppercase tracking-widest">
          <p>© 2024 SHOE LUXE. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
