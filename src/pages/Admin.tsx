import { useState } from "react";

const API = "https://ecommerce-api.fariqshop62.workers.dev";

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!image) return alert("Select image");

    setLoading(true);

    // 1) upload image
    const form = new FormData();
    form.append("file", image);

    const uploadRes = await fetch(API + "/upload-image", {
      method: "POST",
      body: form,
    });

    const uploadData = await uploadRes.json();

    // 2) save product
    await fetch(API + "/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        description,
        image: uploadData.url,
      }),
    });

    alert("Product added!");
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={e=>setName(e.target.value)} /><br/><br/>
        <input placeholder="Price" onChange={e=>setPrice(e.target.value)} /><br/><br/>
        <textarea placeholder="Description" onChange={e=>setDescription(e.target.value)} /><br/><br/>
        <input type="file" onChange={e=>setImage(e.target.files![0])} /><br/><br/>

        <button disabled={loading}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}