"use client";

import * as React from "react";
import { Card } from "@/app/components/Card";
import { CardData } from "@/app/types";
import cardData from './projectData.json'; // Importing the project data

const List = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleNavigation = (id: string | null) => {
    setSelectedId(id);
  };

  return (
    <ul className="card-list">
      {cardData.map((card: CardData) => (
        <Card
          key={card.id}
          isSelected={selectedId === card.id}
          history={{ push: handleNavigation }}
          {...card}
        />
      ))}
    </ul>
  );
};

export default function CardComp() {
  return <List />;
}
