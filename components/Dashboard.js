import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import AddRecipeForm from "./AddRecipeForm";
import EditRecipeForm from "./EditRecipeForm";

export default function Dashboard({ session }) {
  const [recipes, setRecipes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Error signing out:", error.message);
  };

  const deleteRecipe = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");

    if (!confirmed) return;

    try {
      const { error } = await supabase.from("recipes").delete().eq("id", id);

      if (error) throw error;

      // Refresh the recipes list
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      alert("Error deleting recipe");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-6"
      >
        {showAddForm ? "Hide Form" : "Add New Recipe"}
      </button>

      {showAddForm && (
        <div className="mb-6">
          <AddRecipeForm
            onRecipeAdded={() => {
              fetchRecipes();
              setShowAddForm(false);
            }}
            userId={session.user.id}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded p-4 relative"
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => setEditingRecipe(recipe)}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
            <div className="mb-2">
              <h3 className="font-semibold">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Instructions:</h3>
              <p className="whitespace-pre-wrap">{recipe.instructions}</p>
            </div>
          </div>
        ))}
      </div>
      {editingRecipe && (
        <EditRecipeForm
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onRecipeUpdated={fetchRecipes}
        />
      )}
    </div>
  );
}
