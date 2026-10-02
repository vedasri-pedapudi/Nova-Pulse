import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { PageHeader } from '@/components/Layout';
import { Card, Button, Badge } from '@/components/ui';
import { Star, MessageSquare, Check } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function CustomerFeedback({ onNavigate }: Props) {
  const { orders, feedback, addFeedback } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || rating === 0) return;
    addFeedback(selectedOrder, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSelectedOrder('');
      setRating(0);
      setComment('');
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div>
      <PageHeader title="Customer Feedback" subtitle="Share your experience to help improve order reliability" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit form */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-teal-600" />
            Share Your Experience
          </h3>

          {submitted ? (
            <div className="text-center py-8 animate-slide-up">
              <div className="flex justify-center mb-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <Check size={28} className="text-emerald-600" />
                </div>
              </div>
              <p className="font-medium text-navy-900">Feedback submitted!</p>
              <p className="text-sm text-slate-400 mt-1">Thank you for helping us improve.</p>
            </div>
          ) : deliveredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">No delivered orders yet to leave feedback for.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Order</label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Choose an order...</option>
                  {deliveredOrders.map((o) => (
                    <option key={o.id} value={o.id}>{o.id} — {o.items.length} items · ₹{o.total}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Tell us about your delivery experience..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={!selectedOrder || rating === 0}>
                Submit Feedback
              </Button>
            </form>
          )}
        </Card>

        {/* Past feedback */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Your Past Feedback</h3>
          {feedback.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No feedback yet.</p>
          ) : (
            <div className="space-y-3">
              {feedback.map((fb) => (
                <div key={fb.id} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-navy-900">{fb.orderId}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={fb.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                      ))}
                    </div>
                  </div>
                  {fb.comment && <p className="text-sm text-slate-600 mt-1">{fb.comment}</p>}
                  <p className="text-xs text-slate-400 mt-1">{formatDate(fb.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
