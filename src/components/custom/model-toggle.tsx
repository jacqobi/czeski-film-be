import { useState, useEffect } from "react";
import { ModelMapping, modelMappings } from "@/interfaces/interfaces";
import { useChat } from "@/context/ChatContext";

export function ModelToggle() {
  const { model, setModel } = useChat();
  const [selectedModel, setSelectedModel] = useState<ModelMapping | null>(
    model,
  );

  useEffect(() => {
    const storedModelId = localStorage.getItem("selectedModelId");
    if (storedModelId) {
      const storedModel =
        modelMappings.find((m) => m.id === storedModelId) || null;
      if (storedModel) {
        setSelectedModel(storedModel);
        setModel(storedModel);
      }
    } else if (model) {
      setSelectedModel(model);
    }
  }, [model, setModel]);

  const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selected = modelMappings.find((m) => m.id === selectedId) || null;
    setSelectedModel(selected);
    setModel(selected);
    localStorage.setItem("selectedModelId", selectedId);
  };

  return (
    <div>
      <select
        className="bg-background border border-gray text-gray-600 hover:white dark:text-gray-200 h-10 ml-2"
        onChange={handleSelection}
        value={selectedModel?.id || ""}
      >
        {modelMappings.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
