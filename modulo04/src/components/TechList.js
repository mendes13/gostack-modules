import React, { Component } from "react";

import TechItem from "./TechItem";

class TechList extends Component {
  state = {
    newTech: "",
    techs: ["Node.js", "ReactJS", "React Native"]
  };

  handleInputChange = e => {
    this.setState({ newTech: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const [...techs] = this.state.techs;

    // const techs = [...this.state.techs];

    techs.push(this.state.newTech);

    this.setState({ techs, newTech: "" });
  };

  handleDelete = tech => {
    const [...techsCopy] = this.state.techs;

    const techs = techsCopy.filter(item => item !== tech);

    this.setState({ techs });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>{this.state.newTech}</h1>
        <ul>
          {this.state.techs.map(tech => (
            <TechItem key={tech} tech={tech} onDelete={this.handleDelete} />
          ))}
        </ul>
        <input
          type="text"
          onChange={this.handleInputChange}
          value={this.state.newTech}
        />
        <button type="submit">Enviar</button>
      </form>
    );
  }
}

export default TechList;
