import { pgTable, serial, text, varchar, integer, boolean, timestamp, json, decimal } from 'drizzle-orm/pg-core';

// Deals / Packages Table
export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  destination: varchar('destination', { length: 255 }).notNull(),
  destinationEn: varchar('destination_en', { length: 255 }),
  country: varchar('country', { length: 100 }),
  countryEn: varchar('country_en', { length: 100 }),
  description: text('description'),
  descriptionEn: text('description_en'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('ILS'),
  nights: integer('nights').default(1),
  image: text('image'),
  images: json('images').$type<string[]>(),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('4.5'),
  reviewsCount: integer('reviews_count').default(0),
  tag: varchar('tag', { length: 50 }),
  tagEn: varchar('tag_en', { length: 50 }),
  tagColor: varchar('tag_color', { length: 50 }).default('bg-primary-500'),
  departureDate: timestamp('departure_date'),
  returnDate: timestamp('return_date'),
  includes: json('includes').$type<string[]>(),
  includesEn: json('includes_en').$type<string[]>(),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  categoryId: integer('category_id'), // Link to categories table
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Blog Posts Table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  excerpt: text('excerpt'),
  excerptEn: text('excerpt_en'),
  content: text('content').notNull(),
  contentEn: text('content_en'),
  image: text('image'),
  authorName: varchar('author_name', { length: 100 }),
  authorImage: text('author_image'),
  category: varchar('category', { length: 100 }),
  categoryEn: varchar('category_en', { length: 100 }),
  tags: json('tags').$type<string[]>(),
  tagsEn: json('tags_en').$type<string[]>(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaTitleEn: varchar('meta_title_en', { length: 255 }),
  metaDescription: text('meta_description'),
  metaDescriptionEn: text('meta_description_en'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  viewsCount: integer('views_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Site Settings Table (for editable content)
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  valueEn: text('value_en'),
  type: varchar('type', { length: 50 }).default('text'), // text, html, image, json
  group: varchar('group', { length: 50 }).default('general'), // hero, about, contact, etc.
  label: varchar('label', { length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Testimonials Table
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  nameEn: varchar('name_en', { length: 100 }),
  role: varchar('role', { length: 100 }),
  roleEn: varchar('role_en', { length: 100 }),
  avatar: text('avatar'),
  rating: integer('rating').default(5),
  text: text('text').notNull(),
  textEn: text('text_en'),
  destination: varchar('destination', { length: 100 }),
  destinationEn: varchar('destination_en', { length: 100 }),
  isActive: boolean('is_active').default(true),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact Submissions Table
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  destination: varchar('destination', { length: 255 }),
  message: text('message'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Newsletter Subscribers Table
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
});

// Services Table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  description: text('description'),
  descriptionEn: text('description_en'),
  icon: varchar('icon', { length: 50 }).default('Plane'), // Lucide icon name
  gradient: varchar('gradient', { length: 100 }).default('from-blue-500 to-cyan-400'),
  bgLight: varchar('bg_light', { length: 50 }).default('bg-blue-50'),
  iconBg: varchar('icon_bg', { length: 50 }).default('bg-blue-500'),
  link: varchar('link', { length: 255 }),
  isActive: boolean('is_active').default(true),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Section Settings Table
export const sectionSettings = pgTable('section_settings', {
  id: serial('id').primaryKey(),
  sectionKey: varchar('section_key', { length: 50 }).notNull().unique(), // services, testimonials, etc.
  isVisible: boolean('is_visible').default(true),
  title: varchar('title', { length: 255 }),
  titleEn: varchar('title_en', { length: 255 }),
  subtitle: varchar('subtitle', { length: 500 }),
  subtitleEn: varchar('subtitle_en', { length: 500 }),
  badge: varchar('badge', { length: 100 }),
  badgeEn: varchar('badge_en', { length: 100 }),
  gridCols: integer('grid_cols').default(3), // 2, 3, 4
  maxItems: integer('max_items').default(6),
  backgroundColor: varchar('background_color', { length: 50 }),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }),
  slug: varchar('slug', { length: 255 }).notNull().unique(), // URL-friendly identifier
  image: text('image'),
  link: varchar('link', { length: 255 }),
  isActive: boolean('is_active').default(true),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Type exports
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type SectionSetting = typeof sectionSettings.$inferSelect;
