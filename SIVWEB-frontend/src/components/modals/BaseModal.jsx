import { X } from "lucide-react";

export function BaseModal({ title, children, footer, onClose, maxWidth = "max-w-md" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={`relative w-full rounded-lg bg-white p-6 shadow-lg ${maxWidth}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-700"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-gray-900">{title}</h2>

        <div className="space-y-4">{children}</div>

        {footer ? <div className="pt-4">{footer}</div> : null}
      </div>
    </div>
  );
}
