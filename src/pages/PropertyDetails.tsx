/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      const ref = doc(db, "properties", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProperty({ id, ...snap.data() });
        setDescription(snap.data().description || "");
      }
    };
    fetchProperty();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    await updateDoc(doc(db, "properties", id), { description });
    setEditing(false);
    setProperty((prev: any) => ({ ...prev, description }));
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <PropertyCard {...property} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Description</h2>
        {editing ? (
          <>
            <textarea
              className="w-full border border-slate-300 rounded p-2 mb-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
            />
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" className="ml-2" onClick={() => setEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <p className="text-slate-700 whitespace-pre-line">{property.description || "No description yet."}</p>
            <Button className="mt-2" onClick={() => setEditing(true)}>Edit Description</Button>
          </>
        )}
      </div>
    </div>
  );
}
