import React from "react";

function TechItem(props) {
  const { tech, onDelete } = props;
  return (
    <li>
      {tech}
      <button onClick={() => onDelete(tech)} type="button">
        Remover
      </button>
    </li>
  );
}

export default TechItem;
