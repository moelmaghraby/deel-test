import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../utils/debounce";

type AutoCompleteProps = {
  getOptions: (searchTerm?: string) => Promise<string[]>;
  searchDelay?: number;
  placeholder?: string;
};

type ItemListProps = {
  options: string[];
  searchTerm: string;
  error: boolean;
  loading: boolean;
  onItemClick: (item: string) => void;
};
export const AutoComplete: FC<AutoCompleteProps> = ({
  getOptions,
  searchDelay = 150,
  placeholder,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      getOptions(searchTerm)
        .then((res) => {
          setError(false);
          setOptions(res);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [searchTerm, getOptions]);
  return (
    <div className="auto-complete">
      <input
        aria-label="search"
        ref={inputRef}
        className="auto-complete__input"
        type="text"
        placeholder={placeholder}
        onChange={debounce(
          (e: any) => setSearchTerm(e.target.value),
          searchDelay
        )}
      ></input>
      {searchTerm && !!options.length && (
        <ItemList
          loading={loading}
          error={error}
          options={options}
          searchTerm={searchTerm}
          onItemClick={(item) => {
            setSearchTerm(item);
            inputRef.current!.value = item;
          }}
        ></ItemList>
      )}
    </div>
  );
};

const ItemList: FC<ItemListProps> = React.memo(
  ({ options, searchTerm, error, loading, onItemClick }) => {
    const renderWithHighlight = useCallback(
      (
        item: string,
        searchTerm: string,
        onItemClick: (item: string) => void
      ) => {
        const highlightIndex = item
          .toLowerCase()
          .indexOf(searchTerm.toLocaleLowerCase());
        return (
          <li
            className="auto-complete__item"
            key={item}
            onClick={() => onItemClick(item)}
          >
            {item.substring(0, highlightIndex)}
            <mark>
              {item.substring(
                highlightIndex,
                highlightIndex + searchTerm.length
              )}
            </mark>
            {item.substring(highlightIndex + searchTerm.length)}
          </li>
        );
      },
      []
    );

    const renderOptions = useCallback(() => {
      if (loading) return <li>Loading...</li>;
      if (error) return <li>Something went wrong :(</li>;
      return options.map((item) =>
        renderWithHighlight(item, searchTerm, onItemClick)
      );
    }, [loading, error, options, searchTerm, onItemClick, renderWithHighlight]);

    return <ul className="auto-complete__list">{renderOptions()}</ul>;
  }
);
