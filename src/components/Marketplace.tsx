/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, PlusCircle, Search, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketplaceItem } from '../types';
import { auth, getMarketplaceItems, createListing, deleteListing } from '../lib/firebase';

type ListingForm = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
};

const emptyForm: ListingForm = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  category: ''
};

export default function Marketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [form, setForm] = useState<ListingForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await getMarketplaceItems();
      setItems(fetched);
    } catch (err) {
      console.error('Fetch marketplace failed:', err);
      setError('Unable to load marketplace listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleInputChange = (field: keyof ListingForm, value: string) => {
    setForm((prev: ListingForm) => ({ ...prev, [field]: value }));
  };

  const handleCreateListing = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth.currentUser) {
      setError('Sign in to create a marketplace listing.');
      return;
    }

    if (!form.title || !form.description || !form.price || !form.imageUrl || !form.category) {
      setError('Please complete every field before submitting.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createListing({
        title: form.title,
        description: form.description,
        price: form.price.toLowerCase() === 'gift' ? 'Gift' : Number(form.price),
        imageUrl: form.imageUrl,
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName || 'Anonymous',
        category: form.category
      });

      setForm(emptyForm);
      setFormOpen(false);
      await loadItems();
    } catch (err) {
      console.error('Create listing failed:', err);
      setError('Unable to create new listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this listing from the marketplace?')) {
      return;
    }

    try {
      await deleteListing(id);
      setItems((prev: MarketplaceItem[]) => prev.filter((item: MarketplaceItem) => item.id !== id));
    } catch (err) {
      console.error('Delete listing failed:', err);
      setError('Unable to remove listing.');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-ink pb-4 gap-4">
        <div>
          <span className="label-caps mb-0">Commerce_Node</span>
          <h2 className="text-[40px] font-black uppercase tracking-tighter leading-none">Community_Loop</h2>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((open: boolean) => !open)}
          className="bg-ink text-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-accent transition-all flex items-center gap-2"
        >
          <PlusCircle size={16} />
          {formOpen ? 'Close_Form' : 'Create_Listing'}
        </button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleCreateListing}
            className="pane p-8 bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="label-caps">New_Recycled_Listing</div>
                  <p className="text-sm text-ink/60 uppercase">Add a new recycled object to the marketplace.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-ink"
                >
                  Reset_Form
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <input
                  value={form.title}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', event.target.value)}
                  placeholder="Title"
                  className="w-full p-4 border border-line bg-bg text-sm uppercase tracking-widest outline-none"
                />
                <input
                  value={form.category}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange('category', event.target.value)}
                  placeholder="Category"
                  className="w-full p-4 border border-line bg-bg text-sm uppercase tracking-widest outline-none"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <input
                  value={form.price}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange('price', event.target.value)}
                  placeholder="Price or Gift"
                  className="w-full p-4 border border-line bg-bg text-sm uppercase tracking-widest outline-none"
                />
                <input
                  value={form.imageUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange('imageUrl', event.target.value)}
                  placeholder="Image URL"
                  className="w-full p-4 border border-line bg-bg text-sm uppercase tracking-widest outline-none"
                />
              </div>

              <textarea
                value={form.description}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', event.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full p-4 border border-line bg-bg text-sm uppercase tracking-widest outline-none resize-none"
              />

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-tight">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent text-white px-6 py-4 font-bold uppercase tracking-[0.2em] hover:bg-ink transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Publish_Listing'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="relative border-bold p-1 bg-surface">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
        <input
          type="text"
          placeholder="SEARCH://UPCYCLED_ASSETS..."
          className="w-full pl-14 pr-6 py-4 bg-bg font-mono text-sm uppercase tracking-tighter outline-none focus:bg-white transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-ink/60">
          <Loader2 className="animate-spin mr-3" size={20} /> Loading marketplace...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card-geometric group flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line mb-6">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 px-4 py-2 bg-ink text-white text-sm font-black tracking-tighter font-mono">
                  {typeof item.price === 'number' ? `$${item.price}.00` : String(item.price).toUpperCase()}
                </div>
              </div>

              <div className="flex-grow flex flex-col">
                <div className="label-caps text-[10px] opacity-40">{item.category}</div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="text-xs font-medium text-ink/60 uppercase line-clamp-2 mb-6 leading-relaxed">{item.description}</p>

                <div className="mt-auto pt-6 border-t border-line flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border border-line flex items-center justify-center text-ink/40">
                      <User size={12} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60">{item.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-ink">
                      Inspect_Item
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

