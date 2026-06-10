import { useState } from "react";

export function usePageModal(autoDismissMs = 2500) {
  const [modal, setModal] = useState({ open: false, type: "info", title: "", message: "" });

  const showModal = (type, title, message) => {
    setModal({ open: true, type, title, message });
    setTimeout(() => setModal((m) => ({ ...m, open: false })), autoDismissMs);
  };

  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  return { modal, showModal, closeModal };
}
