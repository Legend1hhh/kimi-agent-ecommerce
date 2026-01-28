import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow">
      {/* Quote Icon */}
      <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
        <Quote className="w-5 h-5 text-violet-600" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= testimonial.rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-slate-700 mb-6 line-clamp-4">{testimonial.comment}</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
          <p className="text-sm text-slate-500">
            {new Date(testimonial.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
