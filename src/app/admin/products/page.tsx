"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductImage } from "@/components/products/ProductImage";
import { useAdmin } from "@/context/AdminContext";
import type { Product } from "@/data/products";
import {
  Pencil,
  Trash2,
  RotateCcw,
  Eye,
  MousePointer,
  Plus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ImagePicker } from "@/components/admin/ImagePicker";

const CATEGORIES: Product["category"][] = ["gamer", "smartphone", "games", "accessories"];

export default function AdminProductsPage() {
  const {
    products,
    analytics,
    saveError,
    clearSaveError,
    refreshProducts,
    updateProduct,
    addProduct,
    removeProduct,
    resetToDefaults,
  } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleReset = () => {
    resetToDefaults();
    setConfirmReset(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 px-4 py-3 flex flex-wrap items-center gap-3"
          >
            <AlertCircle className="shrink-0 size-5" />
            <span className="flex-1 text-sm">{saveError}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearSaveError();
                  refreshProducts();
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                <RefreshCw size={14} />
                Atualizar do servidor
              </button>
              <button
                type="button"
                onClick={clearSaveError}
                className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-primary/10 transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Produtos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o estoque: edite imagens, nomes e descrições
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 transition-colors"
          >
            <Plus size={18} />
            Adicionar produto
          </button>
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-500/20 transition-colors"
          >
            <RotateCcw size={18} />
            Restaurar padrão
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmReset(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl border border-border bg-card p-6 max-w-md w-full"
            >
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Restaurar estoque padrão?
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Todas as alterações feitas nos produtos serão perdidas. O estoque
                voltará ao estado original.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-primary/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  Restaurar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddForm && (
          <AddProductForm
            onSave={(product) => {
              addProduct(product);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-border bg-card/80 overflow-hidden hover:border-primary/30 transition-colors"
          >
            <div className="relative aspect-[4/3] bg-muted">
              <ProductImage
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-xs">
                  <Eye size={12} />
                  {analytics[product.id]?.views ?? 0}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 text-white text-xs">
                  <MousePointer size={12} />
                  {analytics[product.id]?.clicks ?? 0}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-foreground line-clamp-1 mb-1">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {product.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEditingId(editingId === product.id ? null : product.id)
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 transition-colors text-sm"
                >
                  <Pencil size={16} />
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm("Remover este produto do estoque?"))
                      removeProduct(product.id);
                  }}
                  className="flex items-center justify-center p-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Remover"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {editingId === product.id && (
                <ProductEditForm
                  product={product}
                  onSave={(updates) => {
                    updateProduct(product.id, updates);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function AddProductForm({
  onSave,
  onCancel,
}: {
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<Product["category"]>("gamer");
  const [price, setPrice] = useState("Sob consulta");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = `prod-${Date.now()}`;
    onSave({
      id,
      name: name.trim(),
      description: description.trim(),
      image: image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop",
      category,
      price: price.trim() || "Sob consulta",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl border border-border bg-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <Plus size={20} className="text-primary" />
          Adicionar produto
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              placeholder="Ex: PC Gamer Pro"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
              placeholder="Descrição do produto"
            />
          </div>
          <ImagePicker
            value={image}
            onChange={setImage}
            label="Foto do produto"
            className="mb-4"
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Product["category"])}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "gamer" && "PC Gamer"}
                  {c === "smartphone" && "Smartphone"}
                  {c === "games" && "Consoles/Jogos"}
                  {c === "accessories" && "Acessórios"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Preço</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              placeholder="Ex: Sob consulta"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 rounded-xl border border-border text-foreground text-sm hover:bg-primary/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ProductEditForm({
  product,
  onSave,
  onCancel,
}: {
  product: { id: string; name: string; description: string; image: string; category: string; price?: string };
  onSave: (updates: { name?: string; description?: string; image?: string; price?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(product.image);
  const [price, setPrice] = useState(product.price ?? "Sob consulta");

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-t border-border bg-background/80 p-4"
    >
      <h4 className="font-display font-bold text-foreground text-sm mb-3">
        Editar produto
      </h4>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            placeholder="Nome do produto"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
            placeholder="Descrição do produto"
          />
        </div>
        <ImagePicker
          value={image}
          onChange={setImage}
          label="Foto do produto"
          className="mb-3"
        />
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Preço
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            placeholder="Ex: R$ 3.000 ou Sob consulta"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSave({ name, description, image, price: price.trim() || "Sob consulta" })}
            className="flex-1 py-2 px-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Salvar
          </button>
          <button
            onClick={onCancel}
            className="py-2 px-3 rounded-lg border border-border text-foreground text-sm hover:bg-primary/10 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
