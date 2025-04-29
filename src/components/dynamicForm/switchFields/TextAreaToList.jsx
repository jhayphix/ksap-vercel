import { useContext, useEffect, useState } from "react";
import { MdArrowUpward, MdArrowDownward, MdClose } from "react-icons/md";
import { ConfigContext } from "@contexts/ConfigContextProvider";

const TextAreaToList = ({ props }) => {
  const { setShowModal, setShowFlashMessage } = useContext(ConfigContext);
  const {
    // fieldType,
    fieldKey,
    fieldValue,
    // fieldIsRequired,
    // fieldOptions,
    fieldPlaceholder,
    hasError,
    handleFormChange,
  } = props;

  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState(Array.isArray(fieldValue) ? fieldValue : []);

  useEffect(() => {
    if (
      (Array.isArray(fieldValue) && fieldValue?.length < 1) ||
      fieldValue === "" ||
      fieldValue?.length < 1
    ) {
      setList([]);
    }
  }, [fieldValue]);

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const newList = [...list, inputValue.trim()];
      setList(newList);
      handleFormChange({ target: { name: fieldKey, value: newList } });
      setInputValue("");
    }
  };

  const handleDeleteItem = (index) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
    handleFormChange({ target: { name: fieldKey, value: newList } });

    setShowFlashMessage({
      isActive: true,
      message: "Item deleted successfully!",
      type: "success",
    });
    setShowModal({
      isActive: false,
    });
  };
  const showModalToDeleteItem = (itemIndex) => {
    setShowModal({
      isActive: true,
      title: "Clear Form",
      message: "This will delete this item?",
      action: () => {
        handleDeleteItem(itemIndex);
      },
    });
  };

  const moveItem = (index, direction) => {
    const newList = [...list];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newList.length) {
      [newList[index], newList[targetIndex]] = [
        newList[targetIndex],
        newList[index],
      ];
      setList(newList);
      handleFormChange({ target: { name: fieldKey, value: newList } });
    }
  };

  return (
    <div>
      <div className="d-flex">
        <textarea
          name={fieldKey}
          rows={1}
          className={`form-control ${hasError ? "fieldHasError" : ""}`}
          //   required={fieldIsRequired}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={fieldPlaceholder}
        />
        <div
          role="button"
          className="btn btn_secondary_2  ms-2"
          onClick={handleAddItem}
        >
          Add Item
        </div>
      </div>
      <ul className="mt-2 has_scrollbar" style={{ maxHeight: "10rem" }}>
        {list?.map((item, index) => (
          <li key={index} className="d-flex align-items-center">
            <span className="flex-grow-1">{item}</span>

            <div
              role="button"
              className="btn  btn-outline-secondary ms-1"
              onClick={() => moveItem(index, -1)}
            >
              <MdArrowUpward size={20} />
            </div>
            <div
              role="button"
              className="btn  btn-outline-secondary ms-1"
              onClick={() => moveItem(index, 1)}
            >
              <MdArrowDownward size={20} />
            </div>
            <div
              role="button"
              className="btn  btn-outline-danger ms-2"
              onClick={() => showModalToDeleteItem(index)}
            >
              <MdClose size={20} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextAreaToList;
