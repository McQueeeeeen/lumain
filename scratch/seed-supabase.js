const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const products = [
  {
    name: "Orlo Brass Chandelier",
    article: "LUM-101",
    brand: "Lumain Heritage",
    category: "Люстры",
    price: 450000,
    stock_status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb21?q=80&w=800",
    lumen: 4500,
    description: "Классическая люстра с латунным финишем и хрустальными элементами.",
    dimensions: { length: 800, width: 800, height: 600 },
    finish: "Латунь",
    luminous_flux: 4500,
    light_color: "3000K",
    power: 60,
    style_tags: ["Классика", "Ар-деко"],
    room_tags: ["Гостиная", "Столовая"]
  },
  {
    name: "Linea Magnetic Track",
    article: "LUM-303",
    brand: "Lumain Tech",
    category: "Споты",
    price: 85000,
    stock_status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1513506496266-aa6bb6a77510?q=80&w=800",
    lumen: 1200,
    description: "Минималистичный трековый светильник для современной архитектуры.",
    dimensions: { length: 300, width: 40, height: 100 },
    finish: "Черный матовый",
    luminous_flux: 1200,
    light_color: "4000K",
    power: 12,
    style_tags: ["Минимализм", "Лофт"],
    room_tags: ["Кухня", "Коридор"]
  },
  {
    name: "Vela Wall Sconce",
    article: "LUM-202",
    brand: "Lumain Modern",
    category: "Бра",
    price: 125000,
    stock_status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800",
    lumen: 800,
    description: "Элегантное бра с мягким рассеянным светом.",
    dimensions: { length: 200, width: 120, height: 350 },
    finish: "Белый гипс",
    luminous_flux: 800,
    light_color: "2700K",
    power: 8,
    style_tags: ["Современный", "Скандинавский"],
    room_tags: ["Спальня", "Ванная"]
  }
];

async function seed() {
  console.log("Seeding products...");
  const { error } = await supabase.from('products').insert(products);
  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Success! Products added to Supabase.");
  }
}

seed();
