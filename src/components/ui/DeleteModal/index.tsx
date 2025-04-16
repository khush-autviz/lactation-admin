import { Modal } from "../modal";
import Button from "../button/Button";
import { ErrorIcon } from "../../../icons";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  text,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-lg p-6 shadow-xl"
    >
      <div className="flex flex-col justify-between items-center mb-5">
      <ErrorIcon className="size-17 mb-5" />
        <h2 className="text-xl text-gray-700 mb-2">Are you sure?</h2>
        <p className="text-gray-500 text-center max-w-sm mx-auto mb-5">
        Do you really want to delete the {text}? This process cannot be
        undone.
        </p>
        <div className="space-y-6">
          <div className="flex justify-between items-center mt-4 space-x-10">
            <Button
              onClick={onConfirm}
              className="px-10 text-[16px] font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600"
              disabled={isLoading}
            >
              Delete
            </Button>
            <Button
              onClick={onClose}
              className="px-10 text-[16px] font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
