"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Plus,
  Package,
  Store,
  Tag,
  Star,
  CheckCircle2,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import mockData from "@/data/sanity-mock.json";
import { formatNaira } from "@/lib/paystack/client";

type DocTypeKey = "product" | "seller" | "category" | "review";

// Maps the singular Sanity document type to the plural key used in the mock
// JSON file (which mirrors how a real Sanity dataset stores documents by type).
const DOC_TYPE_TO_JSON_KEY: Record<DocTypeKey, "products" | "sellers" | "categories" | "reviews"> = {
  product: "products",
  seller: "sellers",
  category: "categories",
  review: "reviews",
};

interface SanityStudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DOC_TYPES: { key: DocTypeKey; label: string; icon: React.ReactNode; type: string }[] = [
  { key: "product", label: "Products", icon: <Package className="size-4" />, type: "product" },
  { key: "seller", label: "Sellers", icon: <Store className="size-4" />, type: "seller" },
  { key: "category", label: "Categories", icon: <Tag className="size-4" />, type: "category" },
  { key: "review", label: "Reviews", icon: <Star className="size-4" />, type: "review" },
];

export function SanityStudioModal({ open, onOpenChange }: SanityStudioModalProps) {
  const [activeType, setActiveType] = useState<DocTypeKey>("product");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);

  const jsonKey = DOC_TYPE_TO_JSON_KEY[activeType];
  const collection =
    (mockData as Record<string, { _id: string; _type?: string }[]>)[jsonKey] ?? [];
  const list = collection.filter((d) => {
    if (!search.trim()) return true;
    const name = ("name" in d ? String((d as { name: unknown }).name) : d._id).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const selectedDoc = collection.find((d) => d._id === selectedId) as
    | Record<string, unknown>
    | undefined;

  const handlePublish = () => {
    toast.success("Published to production dataset", {
      description: `${activeType} document saved and live on trivera.ng`,
    });
    setDirty(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Sanity Studio Demo"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-[#f7f6f4] shadow-2xl"
          >
            {/* Studio top bar */}
            <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-[#f97316] to-[#db2777] text-xs font-black text-white">
                  S
                </div>
                <div className="leading-none">
                  <p className="text-sm font-bold text-neutral-900">Sanity Studio</p>
                  <p className="font-mono text-[10px] text-neutral-500">trivera / production</p>
                </div>
                <span className="ml-2 hidden rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 sm:inline">
                  localhost:3333
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublish}
                  disabled={!dirty && !selectedDoc}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-bold transition-colors",
                    dirty
                      ? "bg-[#f97316] text-white hover:bg-[#ea580c]"
                      : "bg-neutral-200 text-neutral-500",
                  )}
                >
                  Publish
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  aria-label="Close Sanity Studio"
                  className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="size-5" />
                </button>
              </div>
            </header>

            <div className="flex min-h-0 flex-1">
              {/* Sidebar: document types */}
              <aside className="hidden w-48 shrink-0 border-r border-neutral-200 bg-white p-2 sm:block">
                <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-neutral-400">
                  Content
                </p>
                <nav className="flex flex-col gap-0.5">
                  {DOC_TYPES.map((dt) => {
                    const count =
                      (mockData as Record<string, unknown[]>)[DOC_TYPE_TO_JSON_KEY[dt.key]]
                        ?.length ?? 0;
                    return (
                      <button
                        key={dt.key}
                        onClick={() => {
                          setActiveType(dt.key);
                          setSelectedId(null);
                          setSearch("");
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          activeType === dt.key
                            ? "bg-[#f97316]/10 font-semibold text-[#ea580c]"
                            : "text-neutral-700 hover:bg-neutral-100",
                        )}
                      >
                        <span className={activeType === dt.key ? "text-[#ea580c]" : "text-neutral-400"}>
                          {dt.icon}
                        </span>
                        <span className="flex-1">{dt.label}</span>
                        <span className="font-mono text-[10px] text-neutral-400">{count}</span>
                      </button>
                    );
                  })}
                </nav>
                <div className="mt-4 border-t border-neutral-100 pt-2">
                  <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-neutral-400">
                    Schema
                  </p>
                  <p className="px-2 py-1 text-[11px] text-neutral-400">4 document types</p>
                  <p className="px-2 py-1 text-[11px] text-neutral-400">API v2024-10-01</p>
                </div>
              </aside>

              {/* Document list */}
              <section className="w-64 shrink-0 border-r border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 p-2">
                  <div className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-1.5">
                    <Search className="size-3.5 text-neutral-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={`Search ${activeType}s`}
                      className="w-full bg-transparent text-xs outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="font-mono text-[10px] uppercase tracking-wide text-neutral-400">
                    {activeType}s ({list.length})
                  </p>
                  <button className="flex items-center gap-0.5 text-[11px] font-medium text-[#f97316]">
                    <Plus className="size-3" /> New
                  </button>
                </div>
                <ul className="trivera-scroll max-h-full overflow-y-auto pb-4">
                  {list.map((doc) => {
                    const d = doc as Record<string, unknown>;
                    const name = (d.name as string) ?? d._id;
                    const isSel = d._id === selectedId;
                    return (
                      <li key={d._id as string}>
                        <button
                          onClick={() => {
                            setSelectedId(d._id as string);
                            setDirty(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 border-l-2 px-3 py-2 text-left transition-colors",
                            isSel
                              ? "border-[#f97316] bg-[#f97316]/5"
                              : "border-transparent hover:bg-neutral-50",
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-neutral-800">
                              {String(name)}
                            </span>
                            <span className="block font-mono text-[10px] text-neutral-400">
                              {d._id as string}
                            </span>
                          </span>
                          {isSel && <ChevronRight className="size-3.5 text-neutral-400" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Document editor */}
              <section className="min-w-0 flex-1 overflow-y-auto bg-[#f7f6f4]">
                {!selectedDoc ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-neutral-400">
                    <Package className="size-10" />
                    <p className="text-sm">Select a document to edit</p>
                    <p className="font-mono text-[10px]">No document selected</p>
                  </div>
                ) : (
                  <DocumentEditor
                    doc={selectedDoc}
                    type={activeType}
                    dirty={dirty}
                    onDirty={() => setDirty(true)}
                  />
                )}
              </section>
            </div>

            {/* Status bar */}
            <footer className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-1.5 font-mono text-[10px] text-neutral-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-green-500" /> Connected
                </span>
                <span>Dataset: production</span>
                <span>CORS: enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <span>{dirty ? "Unpublished changes" : "All changes published"}</span>
                <span>Sanity Studio v3.74.0</span>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DocumentEditor({
  doc,
  type,
  dirty,
  onDirty,
}: {
  doc: Record<string, unknown>;
  type: DocTypeKey;
  dirty: boolean;
  onDirty: () => void;
}) {
  // Define which fields to render per type, matching schema.ts
  const fields: { name: string; label: string; kind: "text" | "number" | "slug" | "image" | "tags" | "boolean" | "reference" | "block" }[] =
    type === "product"
      ? [
          { name: "name", label: "Product Name", kind: "text" },
          { name: "slug", label: "Slug", kind: "slug" },
          { name: "shortDescription", label: "Short Description", kind: "text" },
          { name: "price", label: "Price (NGN)", kind: "number" },
          { name: "compareAtPrice", label: "Compare-at Price (NGN)", kind: "number" },
          { name: "freeShipping", label: "Free Shipping", kind: "boolean" },
          { name: "stock", label: "Stock", kind: "number" },
          { name: "brand", label: "Brand", kind: "text" },
          { name: "tags", label: "Tags", kind: "tags" },
          { name: "images", label: "Images", kind: "image" },
          { name: "body", label: "Description", kind: "block" },
        ]
      : type === "seller"
        ? [
            { name: "name", label: "Seller Name", kind: "text" },
            { name: "slug", label: "Slug", kind: "slug" },
            { name: "location", label: "Location", kind: "text" },
            { name: "ratingPercent", label: "Rating (%)", kind: "number" },
            { name: "shipOnTimePercent", label: "Ship On Time (%)", kind: "number" },
            { name: "chatResponsePercent", label: "Chat Response (%)", kind: "number" },
            { name: "followerCount", label: "Followers", kind: "number" },
            { name: "verified", label: "Verified", kind: "boolean" },
          ]
        : type === "category"
          ? [
              { name: "name", label: "Category Name", kind: "text" },
              { name: "slug", label: "Slug", kind: "slug" },
              { name: "icon", label: "Icon", kind: "text" },
            ]
          : [
              { name: "author", label: "Author", kind: "text" },
              { name: "location", label: "Location", kind: "text" },
              { name: "rating", label: "Rating", kind: "number" },
              { name: "title", label: "Title", kind: "text" },
              { name: "body", label: "Body", kind: "block" },
              { name: "verified", label: "Verified Purchase", kind: "boolean" },
            ];

  return (
    <div className="mx-auto max-w-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-neutral-400">
            {type} document
          </p>
          <h2 className="text-lg font-bold text-neutral-900">
            {String(doc.name ?? doc._id)}
          </h2>
        </div>
        {dirty ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            Edited
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            <CheckCircle2 className="size-3" /> Published
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {fields.map((f, i) => (
          <FieldRow key={f.name} field={f} value={doc[f.name]} last={i === fields.length - 1} onEdit={onDirty} />
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-neutral-400">
          Document ID
        </p>
        <p className="font-mono text-xs text-neutral-600">{String(doc._id)}</p>
      </div>
    </div>
  );
}

function FieldRow({
  field,
  value,
  last,
  onEdit,
}: {
  field: { name: string; label: string; kind: string };
  value: unknown;
  last: boolean;
  onEdit: () => void;
}) {
  return (
    <div className={cn("flex gap-4 p-3", !last && "border-b border-neutral-100")}>
      <div className="w-1/3 shrink-0">
        <p className="font-mono text-[11px] font-medium text-neutral-700">{field.label}</p>
        <p className="font-mono text-[10px] text-neutral-400">{field.name}</p>
      </div>
      <div className="min-w-0 flex-1">
        <FieldInput field={field} value={value} onEdit={onEdit} />
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onEdit,
}: {
  field: { name: string; label: string; kind: string };
  value: unknown;
  onEdit: () => void;
}) {
  if (field.kind === "image") {
    const images = (value as { url?: string; alt?: string }[] | undefined) ?? [];
    return (
      <div className="flex flex-wrap gap-2">
        {images.length === 0 && <span className="text-xs text-neutral-400">No images</span>}
        {images.map((img, i) => (
          <div key={i} className="size-16 overflow-hidden rounded border border-neutral-200 bg-neutral-50">
            {img.url && <img src={img.url} alt={img.alt ?? ""} className="size-full object-cover" />}
          </div>
        ))}
        <button className="flex size-16 items-center justify-center rounded border border-dashed border-neutral-300 text-neutral-400 hover:border-[#f97316] hover:text-[#f97316]">
          <ImageIcon className="size-4" />
        </button>
      </div>
    );
  }
  if (field.kind === "slug") {
    const slug = (value as { current?: string } | undefined)?.current ?? "";
    return (
      <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1.5">
        <span className="font-mono text-xs text-neutral-400">/product/</span>
        <input
          defaultValue={slug}
          onChange={onEdit}
          className="flex-1 bg-transparent font-mono text-xs text-neutral-700 outline-none"
        />
      </div>
    );
  }
  if (field.kind === "tags") {
    const tags = (value as string[] | undefined) ?? [];
    return (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded bg-[#f97316]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[#ea580c]">
            {t}
          </span>
        ))}
        <button className="rounded border border-dashed border-neutral-300 px-2 py-0.5 font-mono text-[10px] text-neutral-400">
          + add
        </button>
      </div>
    );
  }
  if (field.kind === "boolean") {
    const v = Boolean(value);
    return (
      <button
        onClick={onEdit}
        className={cn(
          "flex h-6 w-11 items-center rounded-full px-0.5 transition-colors",
          v ? "bg-[#f97316]" : "bg-neutral-300",
        )}
        aria-label={`Toggle ${field.label}`}
      >
        <span className={cn("size-5 rounded-full bg-white shadow transition-transform", v && "translate-x-5")} />
      </button>
    );
  }
  if (field.kind === "number") {
    return (
      <input
        type="number"
        defaultValue={typeof value === "number" ? value : Number(value ?? 0)}
        onChange={onEdit}
        className="w-full rounded-md border border-neutral-200 px-2 py-1.5 font-mono text-xs text-neutral-700 outline-none focus:border-[#f97316]"
      />
    );
  }
  if (field.kind === "block") {
    const blocks = (value as { children?: { text?: string }[] }[] | undefined) ?? [];
    const text = blocks.map((b) => b.children?.map((c) => c.text).join("") ?? "").join(" ");
    return (
      <textarea
        defaultValue={text}
        onChange={onEdit}
        rows={3}
        className="w-full rounded-md border border-neutral-200 px-2 py-1.5 text-xs text-neutral-700 outline-none focus:border-[#f97316]"
      />
    );
  }
  // default text
  let display = value == null ? "" : String(value);
  if (field.name === "price" || field.name === "compareAtPrice") {
    display = typeof value === "number" ? formatNaira(value) : display;
  }
  return (
    <input
      defaultValue={display}
      onChange={onEdit}
      className="w-full rounded-md border border-neutral-200 px-2 py-1.5 text-xs text-neutral-700 outline-none focus:border-[#f97316]"
    />
  );
}
