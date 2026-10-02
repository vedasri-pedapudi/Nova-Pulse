import type { Product } from '@/types';

interface ProductImageProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

const categoryGradients: Record<string, string> = {
  Dairy: 'from-blue-400 to-blue-600',
  Bakery: 'from-amber-400 to-orange-500',
  Grocery: 'from-emerald-400 to-emerald-600',
  Pharmacy: 'from-rose-400 to-rose-600',
  Stationery: 'from-violet-400 to-violet-600',
  Snacks: 'from-yellow-400 to-amber-500',
  Vegetables: 'from-green-400 to-green-600',
};

const categoryEmoji: Record<string, string> = {
  Dairy: 'MILK', Bakery: 'BREAD', Grocery: 'RICE', Pharmacy: 'MED',
  Stationery: 'BOOK', Snacks: 'SNACK', Vegetables: 'VEG',
};

export function ProductImage({ product, size = 'md' }: ProductImageProps) {
  const sizes = {
    sm: 'h-12 w-12 text-[9px]',
    md: 'h-16 w-16 text-[10px]',
    lg: 'h-32 w-32 text-xs',
  };
  const gradient = categoryGradients[product.category] || 'from-slate-400 to-slate-600';
  const label = categoryEmoji[product.category] || product.name.slice(0, 4).toUpperCase();

  return (
    <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${gradient} ${sizes[size]} flex-shrink-0`}>
      <span className="font-bold text-white/90 tracking-wider">{label}</span>
    </div>
  );
}
