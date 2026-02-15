'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
  X, 
  Star, 
  Send, 
  MessageSquareQuote,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function TestimonialForm() {
  const locale = useLocale();
  const isHebrew = locale === 'he';
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
    destination: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isActive: false, // Admin needs to approve
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit testimonial');
      }
      
      setIsSuccess(true);
      setFormData({
        name: '',
        role: '',
        rating: 5,
        text: '',
        destination: '',
      });
      
      // Close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert(isHebrew ? 'שגיאה בשליחת ההמלצה. אנא נסה שוב.' : 'Error submitting testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const texts = {
    button: isHebrew ? 'כתבו לנו המלצה' : 'Write a Review',
    title: isHebrew ? 'שתפו את החוויה שלכם' : 'Share Your Experience',
    subtitle: isHebrew ? 'נשמח לשמוע על הטיול שלכם!' : "We'd love to hear about your trip!",
    name: isHebrew ? 'שם מלא' : 'Full Name',
    namePlaceholder: isHebrew ? 'הכנס את שמך' : 'Enter your name',
    role: isHebrew ? 'מקצוע (אופציונלי)' : 'Occupation (optional)',
    rolePlaceholder: isHebrew ? 'לדוגמה: מהנדס, עו"ד...' : 'e.g., Engineer, Lawyer...',
    destination: isHebrew ? 'לאן טיילתם?' : 'Where did you travel?',
    destinationPlaceholder: isHebrew ? 'לדוגמה: יוון, תאילנד...' : 'e.g., Greece, Thailand...',
    rating: isHebrew ? 'דירוג' : 'Rating',
    review: isHebrew ? 'ההמלצה שלכם' : 'Your Review',
    reviewPlaceholder: isHebrew ? 'ספרו לנו על החוויה שלכם עם Deal Tours...' : 'Tell us about your experience with Deal Tours...',
    submit: isHebrew ? 'שלח המלצה' : 'Submit Review',
    submitting: isHebrew ? 'שולח...' : 'Submitting...',
    successTitle: isHebrew ? 'תודה רבה!' : 'Thank You!',
    successMessage: isHebrew ? 'ההמלצה שלכם התקבלה ותפורסם לאחר אישור.' : 'Your review has been received and will be published after approval.',
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 start-6 z-40 flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        <MessageSquareQuote className="w-5 h-5" />
        <span className="font-medium">{texts.button}</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isSubmitting && setIsOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
            dir={isHebrew ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-t-3xl">
              <button
                onClick={() => !isSubmitting && setIsOpen(false)}
                className="absolute top-4 end-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center text-white">
                <MessageSquareQuote className="w-12 h-12 mx-auto mb-3 opacity-80" />
                <h2 className="text-2xl font-bold">{texts.title}</h2>
                <p className="text-primary-100 mt-1">{texts.subtitle}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{texts.successTitle}</h3>
                  <p className="text-slate-600">{texts.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {texts.name} *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={texts.namePlaceholder}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Role & Destination */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {texts.role}
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder={texts.rolePlaceholder}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {texts.destination}
                      </label>
                      <input
                        type="text"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder={texts.destinationPlaceholder}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {texts.rating}
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= formData.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-slate-500 ms-2">
                        ({formData.rating}/5)
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {texts.review} *
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      placeholder={texts.reviewPlaceholder}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      required
                      minLength={20}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 text-white px-6 py-4 rounded-xl font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {texts.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {texts.submit}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
