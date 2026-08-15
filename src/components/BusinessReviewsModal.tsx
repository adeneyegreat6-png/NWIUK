import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { Modal, StarRating, Badge } from './ui';

export default function BusinessReviewsModal({ businessId }: { businessId: string }) {
  const { businesses, closeModal, addReview, user, openModal } = useCommunity();
  const business = businesses.find((b) => b.id === businessId);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  if (!business) return null;
  const avg = business.reviews.length
    ? business.reviews.reduce((s, r) => s + r.rating, 0) / business.reviews.length
    : 0;

  const submit = () => {
    if (!user) {
      openModal({ type: 'auth' });
      return;
    }
    if (!title.trim() || !comment.trim()) return;
    addReview(businessId, { author: user.name, rating, title: title.trim(), comment: comment.trim() });
    setTitle('');
    setComment('');
    setRating(5);
  };

  return (
    <Modal
      title={
        <span className="flex items-center gap-2">
          {business.name}
          {business.verified && (
            <Badge tone="green">
              <BadgeCheck size={13} /> Verified
            </Badge>
          )}
        </span>
      }
      onClose={closeModal}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4">
        <div className="text-3xl font-bold text-stone-900">{avg ? avg.toFixed(1) : '–'}</div>
        <div>
          <StarRating value={Math.round(avg)} size={18} />
          <p className="mt-0.5 text-xs text-stone-500">
            {business.reviews.length} review{business.reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Write a review */}
      <div className="mt-5 rounded-2xl border border-stone-200 p-4">
        <p className="text-sm font-semibold text-stone-700">Write a review</p>
        <div className="mt-2">
          <StarRating value={rating} onChange={setRating} />
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title"
          className="mt-3 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Share your experience…"
          className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={!title.trim() || !comment.trim()}
          className="mt-3 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {user ? 'Submit review' : 'Sign in to review'}
        </button>
      </div>

      {/* Existing reviews */}
      <div className="mt-5 space-y-3">
        {business.reviews.length === 0 && (
          <p className="text-center text-sm text-stone-400">No reviews yet — be the first!</p>
        )}
        {business.reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-stone-100 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800">{r.title}</span>
              <StarRating value={r.rating} size={14} />
            </div>
            <p className="mt-1 text-sm text-stone-500">{r.comment}</p>
            <p className="mt-2 text-xs text-stone-400">
              — {r.author} · {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
