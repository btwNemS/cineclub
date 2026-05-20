import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddMovie from "../Components/addMovie";
import EditMovie from "../Components/editMovie";

export default function Backoffice() {
  return (
    <div>
      <h1>Backoffice</h1>
        <AddMovie />
        <EditMovie />
    </div>
  );
}
