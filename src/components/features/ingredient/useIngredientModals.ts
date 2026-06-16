import { useState } from "react";
import type { Ingredients } from "@/types/ingredients.type";

export type IngredientModalType = "add" | "stockIn" | "edit" | "history" | null;

interface IngredientModalsState {
  activeModal: IngredientModalType;
  selected: Ingredients | null;
}

export function useIngredientModals() {
  const [state, setState] = useState<IngredientModalsState>({
    activeModal: null,
    selected: null,
  });

  const openAdd = () =>
    setState({ activeModal: "add", selected: null });

  const openStockIn = (ingredient: Ingredients) =>
    setState({ activeModal: "stockIn", selected: ingredient });

  const openEdit = (ingredient: Ingredients) =>
    setState({ activeModal: "edit", selected: ingredient });

  const openHistory = (ingredient: Ingredients) =>
    setState({ activeModal: "history", selected: ingredient });

  const closeAll = () =>
    setState({ activeModal: null, selected: null });

  return {
    activeModal: state.activeModal,
    selected: state.selected,

    // Derived booleans — nyaman dipakai di JSX
    showAdd:     state.activeModal === "add",
    showStockIn: state.activeModal === "stockIn",
    showEdit:    state.activeModal === "edit",
    showHistory: state.activeModal === "history",

    // Actions
    openAdd,
    openStockIn,
    openEdit,
    openHistory,
    closeAll,
  };
}
