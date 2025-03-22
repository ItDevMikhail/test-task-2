import React, { useState, useRef } from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import bed from "../assets/images/bed.png";
import chair from "../assets/images/chair.png";
import table from "../assets/images/table.png";
import table4 from "../assets/images/table4.png";
import table5 from "../assets/images/table5.png";

// Тип объекта
interface ItemType {
  id: number;
  x: number;
  y: number;
  imageSrc: string;
}
type Category = "All" | "Tables" | "Others";

// Категории изображений
const categories = {
  All: [bed, chair, table, table4, table5],
  Tables: [table, table4, table5],
  Others: [bed, chair],
};

const Planner: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const stageRef = useRef<any>(null);

  const [image1] = useImage(bed);
  const [image2] = useImage(chair);
  const [image3] = useImage(table);
  const [image4] = useImage(table4);
  const [image5] = useImage(table5);

  const images = [
    { src: bed, image: image1 },
    { src: chair, image: image2 },
    { src: table, image: image3 },
    { src: table4, image: image4 },
    { src: table5, image: image5 },
  ];

  const addItem = (imageSrc: string) => {
    setItems((prev) => [...prev, { id: Date.now(), x: 100, y: 100, imageSrc }]);
  };

  const handleDrag = (id: number, e: any) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, x: e.target.x(), y: e.target.y() } : item
      )
    );
  };

  const deleteItems = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const saveLayout = () => {
    const json = JSON.stringify(items);
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "layoutShema.json";
    a.click();
  };

  const loadLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const data = JSON.parse(reader.result as string) as ItemType[];
      setItems(data);
    };
    reader.readAsText(file);
  };
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "250px",
          padding: "10px",
          borderRight: "2px solid #ddd",
        }}
      >
        <h3>Категории</h3>
        <select
          onChange={(e) => setSelectedCategory(e.target.value as Category)}
          value={selectedCategory}
        >
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <h3>Выбрать объект</h3>
        {categories[selectedCategory].map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`item-${index}`}
              width={50}
              height={50}
              style={{ margin: 5 }}
            />
            <button onClick={() => addItem(src)}>Добавить</button>
          </div>
        ))}
        <br />
        <button onClick={saveLayout}>Сохранить</button>
        <input type="file" onChange={loadLayout} />
      </div>

      <div style={{ flex: 1, border: "1px solid black" }}>
        <Stage ref={stageRef} width={800} height={600}>
          <Layer>
            {items.map((item) => {
              const image = images.find((image) => image.src === item.imageSrc);
              return image ? (
                <Image
                  key={item.id}
                  x={item.x}
                  y={item.y}
                  image={image.image}
                  draggable
                  onDragEnd={(e) => handleDrag(item.id, e)}
                  onClick={() => deleteItems(item.id)}
                />
              ) : null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Planner;
