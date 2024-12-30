import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function AddRecipeForm({ onRecipeAdded, userId }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ingredientsArray = ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      const { data, error } = await supabase.from("recipes").insert([
        {
          title,
          ingredients: ingredientsArray,
          instructions,
          is_public: false,
          user_id: userId, // Add this line
        },
      ]);

      if (error) throw error;

      // Clear form
      setTitle("");
      setIngredients("");
      setInstructions("");

      // Notify parent component
      if (onRecipeAdded) onRecipeAdded();

      alert("Recipe added successfully!");
    } catch (error) {
      alert("Error adding recipe: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Recipe Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ingredients (one per line)
        </label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? "Adding..." : "Add Recipe"}
      </button>
    </form>
  );
}
