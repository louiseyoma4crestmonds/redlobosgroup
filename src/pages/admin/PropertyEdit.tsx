import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../../context/AuthContext";
import UtilityBar from "../../organisms/UtilityBar/UtilityBar";

interface Amenity { id: number; name: string; }
interface PropertyImage { id: number; image_url: string; is_primary: boolean; }

interface PropertyForm {
  name: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  price_per_night: number;
  is_available: boolean;
}

const EMPTY_FORM: PropertyForm = {
  name: "", address: "", description: "",
  bedrooms: 1, bathrooms: 1, max_guests: 2, price_per_night: 0, is_available: true,
};

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data: session, status } = useSession();

  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Amenity editing state
  const [newAmenity, setNewAmenity] = useState("");
  const [editingAmenity, setEditingAmenity] = useState<{ id: number; name: string } | null>(null);

  // Image adding state
  const [newImageUrl, setNewImageUrl] = useState("");
  const [addingImage, setAddingImage] = useState(false);

  const isAdmin = !!(session?.isAdmin);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !isAdmin) { navigate("/"); return; }
    if (!isNew) loadProperty();
  }, [status, isAdmin, id]);

  async function loadProperty() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      const json = await res.json();
      const p = json.data;
      setForm({
        name: p.name, address: p.address, description: p.description,
        bedrooms: p.bedrooms, bathrooms: p.bathrooms, max_guests: p.max_guests,
        price_per_night: p.price_per_night, is_available: p.is_available,
      });
      setAmenities(p.amenities);
      setImages(p.images);
    } catch {
      setError("Failed to load property.");
    } finally {
      setLoading(false);
    }
  }

  // ── Save property details ──────────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const url = isNew ? "/api/admin/properties" : `/api/admin/properties/${id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      const json = await res.json();
      setSuccess("Property saved successfully!");
      if (isNew) {
        navigate(`/admin/properties/${json.data.id}`, { replace: true });
      }
    } catch {
      setError("Failed to save property. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Amenity actions ────────────────────────────────────────────────────────
  async function addAmenity() {
    if (!newAmenity.trim()) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}/amenities`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAmenity.trim() }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setAmenities((prev) => [...prev, json.data]);
      setNewAmenity("");
    } catch {
      alert("Failed to add amenity.");
    }
  }

  async function saveAmenityEdit() {
    if (!editingAmenity) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}/amenities/${editingAmenity.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingAmenity.name }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setAmenities((prev) => prev.map((a) => a.id === editingAmenity.id ? json.data : a));
      setEditingAmenity(null);
    } catch {
      alert("Failed to update amenity.");
    }
  }

  async function deleteAmenity(amenityId: number) {
    if (!window.confirm("Delete this amenity?")) return;
    try {
      await fetch(`/api/admin/properties/${id}/amenities/${amenityId}`, {
        method: "DELETE", credentials: "include",
      });
      setAmenities((prev) => prev.filter((a) => a.id !== amenityId));
    } catch {
      alert("Failed to delete amenity.");
    }
  }

  // ── Image actions ──────────────────────────────────────────────────────────
  async function addImage() {
    if (!newImageUrl.trim()) return;
    setAddingImage(true);
    try {
      const isPrimary = images.length === 0;
      const res = await fetch(`/api/admin/properties/${id}/images`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: newImageUrl.trim(), is_primary: isPrimary }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setImages((prev) => [...prev, json.data]);
      setNewImageUrl("");
    } catch {
      alert("Failed to add image.");
    } finally {
      setAddingImage(false);
    }
  }

  async function setPrimaryImage(imageId: number) {
    try {
      await fetch(`/api/admin/properties/${id}/images/${imageId}`, {
        method: "PUT", credentials: "include",
      });
      setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })));
    } catch {
      alert("Failed to set primary image.");
    }
  }

  async function deleteImage(imageId: number) {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`/api/admin/properties/${id}/images/${imageId}`, {
        method: "DELETE", credentials: "include",
      });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      alert("Failed to delete image.");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UtilityBar activeLink="ADMIN" />
        <div className="flex items-center justify-center py-40">
          <div className="text-gray-400">Loading…</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <UtilityBar activeLink="ADMIN" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Back"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Add New Property" : "Edit Property"}
          </h1>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
        )}

        {/* ── Property Details ─────────────────────────────────────────────── */}
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">Property Details</h2>

          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Ocean View Villa"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. 123 Coastal Road, Malibu, CA"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                placeholder="Describe the property…"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(["bedrooms", "bathrooms", "max_guests"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price / Night ($)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price_per_night}
                  onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, is_available: !form.is_available })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.is_available ? "bg-[#c9a96e]" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_available ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {form.is_available ? "Listed (visible to guests)" : "Hidden (not shown to guests)"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#c9a96e] hover:bg-[#b8945a] disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-lg transition-colors text-sm"
            >
              {saving ? "Saving…" : isNew ? "Create Property" : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Only show amenities + images sections after property is created */}
        {!isNew && (
          <>
            {/* ── Amenities ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">Amenities</h2>

              {/* Add new amenity */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  placeholder="e.g. Swimming Pool, WiFi, Air Conditioning…"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
                />
                <button
                  onClick={addAmenity}
                  className="bg-[#c9a96e] hover:bg-[#b8945a] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Amenity list */}
              {amenities.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No amenities yet.</p>
              ) : (
                <ul className="space-y-2">
                  {amenities.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 group">
                      {editingAmenity?.id === a.id ? (
                        <>
                          <input
                            type="text"
                            value={editingAmenity.name}
                            onChange={(e) => setEditingAmenity({ ...editingAmenity, name: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && saveAmenityEdit()}
                            autoFocus
                            className="flex-1 border border-[#c9a96e] rounded-lg px-3 py-2 text-sm focus:outline-none"
                          />
                          <button onClick={saveAmenityEdit} className="text-green-600 text-sm font-semibold px-2 py-1">Save</button>
                          <button onClick={() => setEditingAmenity(null)} className="text-gray-400 text-sm px-2 py-1">Cancel</button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{a.name}</span>
                          <button
                            onClick={() => setEditingAmenity({ id: a.id, name: a.name })}
                            className="opacity-0 group-hover:opacity-100 text-[#c9a96e] text-xs font-semibold px-2 py-1 transition-opacity"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAmenity(a.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 text-xs font-semibold px-2 py-1 transition-opacity"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Images ────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-100">Photos</h2>

              {/* Add image */}
              <div className="flex gap-2 mb-5">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/30 focus:border-[#c9a96e]"
                />
                <button
                  onClick={addImage}
                  disabled={addingImage}
                  className="bg-[#c9a96e] hover:bg-[#b8945a] disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                  {addingImage ? "…" : "Add"}
                </button>
              </div>

              {/* Image grid */}
              {images.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No photos yet. Add a URL above.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-100">
                      <img
                        src={img.image_url}
                        alt=""
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='80'%3E%3Crect fill='%23f3f4f6' width='100' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'%3ENo image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {/* Primary badge */}
                      {img.is_primary && (
                        <div className="absolute top-2 left-2 bg-[#c9a96e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Primary
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {!img.is_primary && (
                          <button
                            onClick={() => setPrimaryImage(img.id)}
                            className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#c9a96e] hover:text-white transition-colors"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          onClick={() => deleteImage(img.id)}
                          className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3">Hover over a photo to set it as primary or delete it. The primary photo appears on property listing cards.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
